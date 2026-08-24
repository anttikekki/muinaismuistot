import layerMapping from "../../../../museovirasto-map-data-server/layer-mapping.json"
import { featureResponse, type FeatureDetailRow } from "./feature-details"
import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

type FeatureReference = { sourceLayer: string; featureId: string }
const sourceLayers = new Set(layerMapping.physicalLayers.map((layer) => layer.mvtSourceLayer))

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

  const values = references.map(() => "(?, ?, ?)").join(", ")
  const bindings = references.flatMap((reference, index) => [index, reference.sourceLayer, Number(reference.featureId)])
  const result = await env.MAP_FEATURES.prepare(`
    WITH requested(request_order, source_layer, feature_id) AS (VALUES ${values})
    SELECT requested.request_order, details.*
    FROM requested
    LEFT JOIN feature_details AS details
      ON details.source_layer = requested.source_layer AND details.feature_id = requested.feature_id
    ORDER BY requested.request_order
  `).bind(...bindings).all<FeatureDetailRow>()

  const features = []
  const missing = []
  for (const row of result.results) {
    const reference = references[row.request_order]
    if (!row.source_layer) missing.push(reference)
    else features.push(featureResponse(row))
  }
  return Response.json({ features, missing }, { headers: corsHeaders() })
}
