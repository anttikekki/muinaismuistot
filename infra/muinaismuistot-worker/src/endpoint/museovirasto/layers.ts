import layerMapping from "../../../../museovirasto-map-data-server/layer-mapping.json"
import { corsHeaders, methodNotAllowed, preflightResponse } from "./responses"

export function handleLayers(request: Request): Response {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const headers = corsHeaders()
  headers.set("Cache-Control", "no-store")
  return Response.json(layerMapping.logicalLayers, { headers })
}
