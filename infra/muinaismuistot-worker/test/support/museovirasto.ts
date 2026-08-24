import { env } from "cloudflare:workers"
import worker from "../../src/index"

export const pmtilesBody = new TextEncoder().encode("PMTiles-test-data")

export async function resetMuseovirastoData(): Promise<void> {
  await env.MAP_DATA.put("current.pmtiles", pmtilesBody, {
    httpMetadata: { contentType: "application/vnd.pmtiles" }
  })
  await env.MAP_DATA.put("current.json", JSON.stringify({
    version: "20260822T000000Z",
    pmtilesUrl: "/api/museovirasto/pmtiles"
  }))
  await env.MAP_FEATURES.prepare(`
    CREATE TABLE IF NOT EXISTS feature_details (
      source_layer TEXT NOT NULL,
      feature_id INTEGER NOT NULL,
      logical_layer_id TEXT NOT NULL,
      registry_id TEXT,
      name TEXT,
      municipality TEXT,
      properties_json TEXT NOT NULL DEFAULT '{}',
      search_name TEXT NOT NULL DEFAULT '',
      PRIMARY KEY (source_layer, feature_id)
    ) WITHOUT ROWID
  `).run()
  await env.MAP_FEATURES.prepare("DELETE FROM feature_details").run()
}

export function museovirastoRequest(path: string, init?: RequestInit): Promise<Response> {
  return worker.fetch(new Request(`https://muinaismuistot.info/api/museovirasto${path}`, init), env)
}
