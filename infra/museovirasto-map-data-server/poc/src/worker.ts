import layerMapping from "../../layer-mapping.json"

const ARCHIVE_PATH = "/pmtiles/current.pmtiles"
const ARCHIVE_KEY = "current.pmtiles"
const ALLOWED_METHODS = "GET, HEAD, POST, OPTIONS"
const EXPOSED_HEADERS = "Accept-Ranges, Content-Length, Content-Range, ETag"

type ByteRange = { offset: number; length: number }

function corsHeaders(): Headers {
  return new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": "Range, If-None-Match, Content-Type",
    "Access-Control-Expose-Headers": EXPOSED_HEADERS,
    "Access-Control-Max-Age": "86400",
  })
}

function errorResponse(message: string, status: number, size?: number): Response {
  const headers = corsHeaders()
  headers.set("Content-Type", "text/plain; charset=utf-8")
  if (status === 416 && size !== undefined) {
    headers.set("Content-Range", `bytes */${size}`)
  }
  return new Response(message, { status, headers })
}

function methodNotAllowed(allow: string): Response {
  const response = errorResponse("Method not allowed", 405)
  response.headers.set("Allow", allow)
  return response
}

export function parseSingleRange(value: string, size: number): ByteRange | null {
  if (!Number.isSafeInteger(size) || size <= 0 || value.includes(",")) return null

  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim())
  if (!match || (!match[1] && !match[2])) return null

  if (!match[1]) {
    const suffixLength = Number(match[2])
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null
    const length = Math.min(suffixLength, size)
    return { offset: size - length, length }
  }

  const offset = Number(match[1])
  if (!Number.isSafeInteger(offset) || offset >= size) return null

  const requestedEnd = match[2] ? Number(match[2]) : size - 1
  if (!Number.isSafeInteger(requestedEnd) || requestedEnd < offset) return null
  const end = Math.min(requestedEnd, size - 1)
  return { offset, length: end - offset + 1 }
}

async function serveArchive(request: Request, env: Env): Promise<Response> {
  const metadata = await env.MAP_DATA.head(ARCHIVE_KEY)
  if (!metadata) return errorResponse("PMTiles archive not found", 404)

  const baseHeaders = corsHeaders()
  baseHeaders.set("Accept-Ranges", "bytes")
  baseHeaders.set("Content-Type", "application/vnd.pmtiles")
  baseHeaders.set("ETag", metadata.httpEtag)
  baseHeaders.set("Cache-Control", "public, max-age=300")

  if (request.method === "HEAD") {
    baseHeaders.set("Content-Length", String(metadata.size))
    return new Response(null, { status: 200, headers: baseHeaders })
  }

  const rangeHeader = request.headers.get("Range")
  if (!rangeHeader) return errorResponse("A single byte Range is required", 400)

  const range = parseSingleRange(rangeHeader, metadata.size)
  if (!range) return errorResponse("Range not satisfiable", 416, metadata.size)

  const object = await env.MAP_DATA.get(ARCHIVE_KEY, { range })
  if (!object || !object.body) return errorResponse("PMTiles archive not found", 404)

  const end = range.offset + range.length - 1
  baseHeaders.set("Content-Range", `bytes ${range.offset}-${end}/${metadata.size}`)
  baseHeaders.set("Content-Length", String(range.length))
  return new Response(object.body, { status: 206, headers: baseHeaders })
}

type FeatureReference = { sourceLayer: string; featureId: string }
type RegistryReference = { logicalLayerId: string; registryId: string }
type FeatureDetailRow = {
  request_order: number
  source_layer: string | null
  feature_id: number | null
  logical_layer_id: string | null
  registry_id: string | null
  name: string | null
  municipality: string | null
  properties_json: string | null
}
type RegistryDetailRow = FeatureDetailRow & {
  requested_logical_layer_id: string
  requested_registry_id: string
}

const sourceLayers = new Set(layerMapping.physicalLayers.map((layer) => layer.mvtSourceLayer))
const logicalLayerIds = new Set(layerMapping.logicalLayers.map((layer) => layer.id))
const SEARCH_LIMIT = 50

function featureResponse(row: FeatureDetailRow) {
  return {
    sourceLayer: row.source_layer,
    featureId: String(row.feature_id),
    logicalLayerId: row.logical_layer_id,
    properties: {
      ...JSON.parse(row.properties_json ?? "{}"),
      registryId: row.registry_id,
      name: row.name,
      municipality: row.municipality,
    },
  }
}

async function serveCurrentMetadata(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const metadata = await env.MAP_DATA.get("current.json")
  if (!metadata?.body) return errorResponse("Dataset metadata not found", 503)
  const headers = corsHeaders()
  headers.set("Cache-Control", "public, max-age=60")
  headers.set("Content-Type", "application/json; charset=utf-8")
  return new Response(metadata.body, { headers })
}

async function serveFeatureBatch(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return methodNotAllowed("POST, OPTIONS")
  const contentLength = Number(request.headers.get("Content-Length") ?? 0)
  if (contentLength > 32_768) return errorResponse("Request body too large", 413)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse("Invalid JSON body", 400)
  }
  const candidates = (body as { features?: unknown })?.features
  if (!Array.isArray(candidates) || candidates.length === 0 || candidates.length > 100) {
    return errorResponse("features must contain 1-100 references", 400)
  }

  const references: FeatureReference[] = []
  const seen = new Set<string>()
  for (const candidate of candidates) {
    const sourceLayer = (candidate as FeatureReference)?.sourceLayer
    const featureId = (candidate as FeatureReference)?.featureId
    if (!sourceLayers.has(sourceLayer) || !/^[1-9]\d{0,15}$/.test(featureId)) {
      return errorResponse("Invalid feature reference", 400)
    }
    const numericId = Number(featureId)
    if (!Number.isSafeInteger(numericId)) return errorResponse("Invalid feature reference", 400)
    const key = `${sourceLayer}:${featureId}`
    if (!seen.has(key)) {
      seen.add(key)
      references.push({ sourceLayer, featureId })
    }
  }

  const values = references.map(() => "(?, ?, ?)").join(", ")
  const bindings = references.flatMap((reference, index) => [index, reference.sourceLayer, Number(reference.featureId)])
  const query = `
    WITH requested(request_order, source_layer, feature_id) AS (VALUES ${values})
    SELECT requested.request_order, details.*
    FROM requested
    LEFT JOIN feature_details AS details
      ON details.source_layer = requested.source_layer AND details.feature_id = requested.feature_id
    ORDER BY requested.request_order
  `
  const result = await env.MAP_FEATURES.prepare(query).bind(...bindings).all<FeatureDetailRow>()
  const features = []
  const missing = []
  for (const row of result.results) {
    const reference = references[row.request_order]
    if (!row.source_layer) {
      missing.push(reference)
      continue
    }
    features.push(featureResponse(row))
  }
  return Response.json({ features, missing }, { headers: corsHeaders() })
}

async function serveRegistryBatch(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return methodNotAllowed("POST, OPTIONS")
  const contentLength = Number(request.headers.get("Content-Length") ?? 0)
  if (contentLength > 32_768) return errorResponse("Request body too large", 413)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse("Invalid JSON body", 400)
  }
  const candidates = (body as { features?: unknown })?.features
  if (!Array.isArray(candidates) || candidates.length === 0 || candidates.length > 100) {
    return errorResponse("features must contain 1-100 references", 400)
  }

  const references: RegistryReference[] = []
  const seen = new Set<string>()
  for (const candidate of candidates) {
    const logicalLayerId = (candidate as RegistryReference)?.logicalLayerId
    const registryId = (candidate as RegistryReference)?.registryId
    if (!logicalLayerIds.has(logicalLayerId) || typeof registryId !== "string" || registryId.length === 0 || registryId.length > 256) {
      return errorResponse("Invalid registry reference", 400)
    }
    const key = `${logicalLayerId}\u0000${registryId}`
    if (!seen.has(key)) {
      seen.add(key)
      references.push({ logicalLayerId, registryId })
    }
  }

  const values = references.map(() => "(?, ?, ?)").join(", ")
  const bindings = references.flatMap((reference, index) => [index, reference.logicalLayerId, reference.registryId])
  const query = `
    WITH requested(request_order, logical_layer_id, registry_id) AS (VALUES ${values})
    SELECT requested.request_order,
      requested.logical_layer_id AS requested_logical_layer_id,
      requested.registry_id AS requested_registry_id,
      details.*
    FROM requested
    LEFT JOIN feature_details AS details
      ON details.logical_layer_id = requested.logical_layer_id AND details.registry_id = requested.registry_id
    ORDER BY requested.request_order, details.source_layer, details.feature_id
  `
  const result = await env.MAP_FEATURES.prepare(query).bind(...bindings).all<RegistryDetailRow>()
  const features = []
  const foundOrders = new Set<number>()
  for (const row of result.results) {
    if (!row.source_layer) continue
    foundOrders.add(row.request_order)
    features.push(featureResponse(row))
  }
  const missing = references.filter((_, index) => !foundOrders.has(index))
  return Response.json({ features, missing }, { headers: corsHeaders() })
}

type SearchRow = {
  logical_layer_id: string
  registry_id: string
  source_layer: string
  name: string | null
  municipality: string | null
  geometry_count: number
}

function escapeLike(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_")
}

async function serveSearch(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const rawQuery = url.searchParams.get("q")?.trim() ?? ""
  const queryLength = [...rawQuery].length
  if (queryLength < 3 || queryLength > 100) return errorResponse("q must contain 3-100 characters", 400)
  const normalized = rawQuery.normalize("NFC").toLocaleLowerCase("fi")
  const pattern = `%${escapeLike(normalized)}%`
  const result = await env.MAP_FEATURES.prepare(`
    SELECT logical_layer_id, registry_id,
      MIN(source_layer) AS source_layer,
      MIN(name) AS name,
      MIN(municipality) AS municipality,
      COUNT(*) AS geometry_count
    FROM feature_details
    WHERE registry_id IS NOT NULL
      AND (search_name LIKE ? ESCAPE '\\' OR registry_id LIKE ? ESCAPE '\\')
    GROUP BY logical_layer_id, registry_id
    ORDER BY CASE WHEN registry_id = ? THEN 0 ELSE 1 END, name, logical_layer_id, registry_id
    LIMIT ?
  `).bind(pattern, pattern, rawQuery, SEARCH_LIMIT + 1).all<SearchRow>()
  const truncated = result.results.length > SEARCH_LIMIT
  const results = result.results.slice(0, SEARCH_LIMIT).map((row) => ({
    logicalLayerId: row.logical_layer_id,
    registryId: row.registry_id,
    sourceLayer: row.source_layer,
    name: row.name,
    municipality: row.municipality,
    geometryCount: row.geometry_count,
  }))
  const headers = corsHeaders()
  headers.set("Cache-Control", "public, max-age=60")
  return Response.json({ query: rawQuery, results, truncated, limit: SEARCH_LIMIT }, { headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }
    if (url.pathname === ARCHIVE_PATH) {
      if (!["GET", "HEAD"].includes(request.method)) return methodNotAllowed("GET, HEAD, OPTIONS")
      return serveArchive(request, env)
    }
    if (url.pathname === "/api/meta") return serveCurrentMetadata(request, env)
    if (url.pathname === "/api/features/batch") return serveFeatureBatch(request, env)
    if (url.pathname === "/api/features/by-register") return serveRegistryBatch(request, env)
    if (url.pathname === "/api/search") return serveSearch(request, env, url)
    if (url.pathname === "/api/layers") {
      if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
      return Response.json(layerMapping.logicalLayers, {
        headers: { ...Object.fromEntries(corsHeaders()), "Cache-Control": "no-store" },
      })
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
