import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

export async function handleMetadata(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const metadata = await env.MAP_DATA.get("current.json")
  if (!metadata?.body) return errorResponse("Dataset metadata not found", 503)
  const headers = corsHeaders()
  headers.set("Cache-Control", "public, max-age=60")
  headers.set("Content-Type", "application/json; charset=utf-8")
  return new Response(metadata.body, { headers })
}
