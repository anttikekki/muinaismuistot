import { corsHeaders, methodNotAllowed, preflightResponse } from "./responses"

type HealthD1Row = { source_layer: string; feature_id: number }

export async function handleHealth(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const [archive, metadata, feature] = await Promise.all([
    env.MAP_DATA.head("current.pmtiles"),
    env.MAP_DATA.get("current.json"),
    env.MAP_FEATURES.prepare("SELECT source_layer, feature_id FROM feature_details LIMIT 1").first<HealthD1Row>(),
  ])
  let version: string | null = null
  if (metadata) {
    try {
      const parsed = JSON.parse(await metadata.text()) as { version?: unknown }
      if (typeof parsed.version === "string" && /^\d{8}T\d{6}Z$/.test(parsed.version)) version = parsed.version
    } catch {}
  }
  const checks = {
    pmtiles: { ok: Boolean(archive), bytes: archive?.size ?? null },
    metadata: { ok: version !== null },
    d1: { ok: feature !== null },
  }
  const ok = Object.values(checks).every((check) => check.ok)
  const headers = corsHeaders()
  headers.set("Cache-Control", "no-store")
  return Response.json({ ok, version, checks }, { status: ok ? 200 : 503, headers })
}
