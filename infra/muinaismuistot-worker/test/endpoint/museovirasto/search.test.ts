import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto search endpoint", () => {
  it("searches feature names", async () => {
    await env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name, search_name)
      VALUES ('rky_points', 7, 'rajapinta_suojellut:rky_piste', '100', 'Vanha kirkko', 'vanha kirkko')
    `).run()

    const response = await museovirastoRequest("/search?q=kirkko")
    expect(response.status).toBe(200)
    expect((await response.json() as { results: unknown[] }).results).toHaveLength(1)
  })
})
