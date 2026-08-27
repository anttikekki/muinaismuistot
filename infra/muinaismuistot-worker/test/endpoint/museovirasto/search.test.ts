import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto search endpoint", () => {
  it("searches feature names", async () => {
    await env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name, search_name, geometry_json)
      VALUES ('rky_piste', 7, 'rajapinta_suojellut:rky_piste', '100', 'Vanha kirkko', 'vanha kirkko', '{"type":"Point","coordinates":[385000,6670000]}')
    `).run()

    const response = await museovirastoRequest("/search?q=kirkko")
    expect(response.status).toBe(200)
    const body = await response.json() as { results: unknown[] }
    expect(body.results).toHaveLength(1)
  })

  it("limits results to selected logical layers", async () => {
    await env.MAP_FEATURES.batch([
      env.MAP_FEATURES.prepare(`
        INSERT INTO feature_details
          (source_layer, feature_id, logical_layer_id, registry_id, name, search_name)
        VALUES ('rky_piste', 7, 'rajapinta_suojellut:rky_piste', '100', 'Vanha kirkko', 'vanha kirkko')
      `),
      env.MAP_FEATURES.prepare(`
        INSERT INTO feature_details
          (source_layer, feature_id, logical_layer_id, registry_id, name, search_name)
        VALUES ('maailmanperinto_piste', 8, 'rajapinta_suojellut:maailmanperinto_piste', '200', 'Toinen kirkko', 'toinen kirkko')
      `)
    ])
    const layer = encodeURIComponent("rajapinta_suojellut:rky_piste")
    const response = await museovirastoRequest(`/search?q=kirkko&layers=${layer}`)
    const body = await response.json() as { results: { logicalLayerId: string }[] }
    expect(body.results).toHaveLength(1)
    expect(body.results[0].logicalLayerId).toBe("rajapinta_suojellut:rky_piste")
  })
})
