import layerMapping from "../../../../museovirasto-map-data/contract/layer-mapping.json"
import { featureResponse, type FeatureDetailRow } from "./feature-details"
import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

type FeatureReference = { sourceLayer: string; featureId: string }
type RelatedArchaeologicalSite = { registryId: string; name: string | null }
const sourceLayers = new Set(layerMapping.physicalLayers.map((layer) => layer.mvtSourceLayer))
const archaeologicalPointLogicalLayerIds = layerMapping.logicalLayers
  .filter((layer) => layer.sourceLayer === "muinaisjaannokset_piste")
  .map((layer) => layer.id)
const D1_BATCH_SIZE = 30
const RELATED_D1_BATCH_SIZE = 50

function relatedRegistryIds(properties: Record<string, unknown>): string[] {
  const raw = properties.related_registry_ids_raw
  if (typeof raw !== "string") return []
  return [...new Set(raw.split(",").map((value) => value.trim()).filter(Boolean))]
}

async function relatedArchaeologicalSites(
  registryIds: string[],
  env: Env,
): Promise<Map<string, string | null>> {
  const statements = []
  for (let offset = 0; offset < registryIds.length; offset += RELATED_D1_BATCH_SIZE) {
    const batch = registryIds.slice(offset, offset + RELATED_D1_BATCH_SIZE)
    const registryPlaceholders = batch.map(() => "?").join(", ")
    const layerPlaceholders = archaeologicalPointLogicalLayerIds.map(() => "?").join(", ")
    statements.push(env.MAP_FEATURES.prepare(`
      SELECT registry_id, name
      FROM feature_details
      WHERE logical_layer_id IN (${layerPlaceholders})
        AND registry_id IN (${registryPlaceholders})
      ORDER BY registry_id, feature_id
    `).bind(...archaeologicalPointLogicalLayerIds, ...batch))
  }

  const names = new Map<string, string | null>()
  if (statements.length === 0) return names
  const results = await env.MAP_FEATURES.batch<{ registry_id: string; name: string | null }>(statements)
  for (const result of results) {
    for (const row of result.results) {
      if (!names.has(row.registry_id)) names.set(row.registry_id, row.name)
    }
  }
  return names
}

export async function handleFeatureBatch(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "POST") return methodNotAllowed("POST, OPTIONS")
  if (Number(request.headers.get("Content-Length") ?? 0) > 32_768) return errorResponse("Request body too large", 413)
  let body: unknown
  try { body = await request.json() } catch { return errorResponse("Invalid JSON body", 400) }
  const candidates = (body as { features?: unknown })?.features
  if (!Array.isArray(candidates) || candidates.length === 0 || candidates.length > 100) {
    return errorResponse("features must contain 1-100 references", 400)
  }

  const references: FeatureReference[] = []
  const seen = new Set<string>()
  for (const candidate of candidates) {
    const sourceLayer = (candidate as FeatureReference | null)?.sourceLayer
    const featureId = (candidate as FeatureReference | null)?.featureId
    if (typeof sourceLayer !== "string" || typeof featureId !== "string" ||
        !sourceLayers.has(sourceLayer) || !/^[1-9]\d{0,15}$/.test(featureId) || !Number.isSafeInteger(Number(featureId))) {
      return errorResponse("Invalid feature reference", 400)
    }
    const key = `${sourceLayer}:${featureId}`
    if (!seen.has(key)) {
      seen.add(key)
      references.push({ sourceLayer, featureId })
    }
  }

  const statements = []
  for (let offset = 0; offset < references.length; offset += D1_BATCH_SIZE) {
    const batch = references.slice(offset, offset + D1_BATCH_SIZE)
    const values = batch.map(() => "(?, ?, ?)").join(", ")
    const bindings = batch.flatMap((reference, index) => [offset + index, reference.sourceLayer, Number(reference.featureId)])
    statements.push(env.MAP_FEATURES.prepare(`
      WITH requested(request_order, source_layer, feature_id) AS (VALUES ${values})
      SELECT requested.request_order, details.*
      FROM requested
      LEFT JOIN feature_details AS details
        ON details.source_layer = requested.source_layer AND details.feature_id = requested.feature_id
      ORDER BY requested.request_order
    `).bind(...bindings))
  }
  const results = await env.MAP_FEATURES.batch<FeatureDetailRow>(statements)

  const features: Array<ReturnType<typeof featureResponse> & {
    relatedArchaeologicalSites?: RelatedArchaeologicalSite[]
  }> = []
  const missing = []
  for (const result of results) {
    for (const row of result.results) {
      const reference = references[row.request_order]
      if (!row.source_layer) missing.push(reference)
      else features.push(featureResponse(row))
    }
  }

  const idsByFeature = new Map<(typeof features)[number], string[]>()
  const allRelatedIds = new Set<string>()
  for (const feature of features) {
    if (!feature.sourceLayer?.startsWith("vark_")) continue
    const ids = relatedRegistryIds(feature.properties)
    delete feature.properties.related_registry_ids_raw
    idsByFeature.set(feature, ids)
    ids.forEach((id) => allRelatedIds.add(id))
  }
  const relatedNames = await relatedArchaeologicalSites([...allRelatedIds], env)
  for (const [feature, ids] of idsByFeature) {
    feature.relatedArchaeologicalSites = ids.map((registryId) => ({
      registryId,
      name: relatedNames.get(registryId) ?? null,
    }))
  }
  return Response.json({ features, missing }, { headers: corsHeaders() })
}
