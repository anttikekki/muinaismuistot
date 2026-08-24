import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

const SEARCH_LIMIT = 50
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

export async function handleSearch(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const rawQuery = new URL(request.url).searchParams.get("q")?.trim() ?? ""
  const queryLength = [...rawQuery].length
  if (queryLength < 3 || queryLength > 100) return errorResponse("q must contain 3-100 characters", 400)
  const pattern = `%${escapeLike(rawQuery.normalize("NFC").toLocaleLowerCase("fi"))}%`
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
