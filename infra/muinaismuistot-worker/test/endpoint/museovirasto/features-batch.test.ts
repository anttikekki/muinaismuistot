import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto feature batch endpoint", () => {
  it("returns requested feature details", async () => {
    await env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name, search_name, geometry_json)
      VALUES ('rky_points', 7, 'rajapinta_suojellut:rky_piste', '100', 'Vanha kirkko', 'vanha kirkko', '{"type":"Point","coordinates":[385000,6670000]}')
    `).run()

    const response = await museovirastoRequest("/features/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [{ sourceLayer: "rky_points", featureId: "7" }] })
    })

    expect(response.status).toBe(200)
    const result = await response.json() as { features: Array<{ geometry: unknown }> }
    expect(result.features).toHaveLength(1)
    expect(result.features[0].geometry).toEqual({ type: "Point", coordinates: [385000, 6670000] })
  })
})
