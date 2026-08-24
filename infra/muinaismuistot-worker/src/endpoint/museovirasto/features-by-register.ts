import layerMapping from "../../../../museovirasto-map-data-server/layer-mapping.json"
import { featureResponse, type FeatureDetailRow } from "./feature-details"
import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

type RegistryReference = { logicalLayerId: string; registryId: string }
type RegistryDetailRow = FeatureDetailRow & { requested_logical_layer_id: string; requested_registry_id: string }
const logicalLayerIds = new Set(layerMapping.logicalLayers.map((layer) => layer.id))
const D1_BATCH_SIZE = 30

export async function handleFeaturesByRegister(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "POST") return methodNotAllowed("POST, OPTIONS")
  if (Number(request.headers.get("Content-Length") ?? 0) > 32_768) return errorResponse("Request body too large", 413)
  let body: unknown
  try { body = await request.json() } catch { return errorResponse("Invalid JSON body", 400) }
  const candidates = (body as { features?: unknown })?.features
  if (!Array.isArray(candidates) || candidates.length === 0 || candidates.length > 100) {
    return errorResponse("features must contain 1-100 references", 400)
  }

  const references: RegistryReference[] = []
  const seen = new Set<string>()
  for (const candidate of candidates) {
    const logicalLayerId = (candidate as RegistryReference | null)?.logicalLayerId
    const registryId = (candidate as RegistryReference | null)?.registryId
    if (typeof logicalLayerId !== "string" || !logicalLayerIds.has(logicalLayerId) ||
        typeof registryId !== "string" || registryId.length === 0 || registryId.length > 256) {
      return errorResponse("Invalid registry reference", 400)
    }
    const key = `${logicalLayerId}\u0000${registryId}`
    if (!seen.has(key)) {
      seen.add(key)
      references.push({ logicalLayerId, registryId })
    }
  }

  const statements = []
  for (let offset = 0; offset < references.length; offset += D1_BATCH_SIZE) {
    const batch = references.slice(offset, offset + D1_BATCH_SIZE)
    const values = batch.map(() => "(?, ?, ?)").join(", ")
    const bindings = batch.flatMap((reference, index) => [offset + index, reference.logicalLayerId, reference.registryId])
    statements.push(env.MAP_FEATURES.prepare(`
      WITH requested(request_order, logical_layer_id, registry_id) AS (VALUES ${values})
      SELECT requested.request_order,
        requested.logical_layer_id AS requested_logical_layer_id,
        requested.registry_id AS requested_registry_id,
        details.*
      FROM requested
      LEFT JOIN feature_details AS details
        ON details.logical_layer_id = requested.logical_layer_id AND details.registry_id = requested.registry_id
      ORDER BY requested.request_order, details.source_layer, details.feature_id
    `).bind(...bindings))
  }
  const results = await env.MAP_FEATURES.batch<RegistryDetailRow>(statements)

  const features = []
  const foundOrders = new Set<number>()
  for (const result of results) {
    for (const row of result.results) {
      if (!row.source_layer) continue
      foundOrders.add(row.request_order)
      features.push(featureResponse(row))
    }
  }
  const missing = references.filter((_, index) => !foundOrders.has(index))
  return Response.json({ features, missing }, { headers: corsHeaders() })
}
