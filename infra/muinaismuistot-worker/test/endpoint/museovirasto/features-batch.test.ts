import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto feature batch endpoint", () => {
  it("returns requested feature details", async () => {
    await env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name, search_name, geometry_json)
      VALUES ('rky_piste', 7, 'rajapinta_suojellut:rky_piste', '100', 'Vanha kirkko', 'vanha kirkko', '{"type":"Point","coordinates":[385000,6670000]}')
    `).run()

    const response = await museovirastoRequest("/features/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [{ sourceLayer: "rky_piste", featureId: "7" }] })
    })

    expect(response.status).toBe(200)
    const result = await response.json() as { features: Array<{ geometry: unknown }> }
    expect(result.features).toHaveLength(1)
    expect(result.features[0].geometry).toEqual({ type: "Point", coordinates: [385000, 6670000] })
  })

  it("returns VARK related archaeological sites with names in source order", async () => {
    await env.MAP_FEATURES.batch([
      env.MAP_FEATURES.prepare(`
        INSERT INTO feature_details
          (source_layer, feature_id, logical_layer_id, registry_id, name, properties_json, geometry_json)
        VALUES (
          'vark_pisteet', 49, 'rajapinta_suojellut:vark_pisteet', '100310',
          'Kivikon linnoitteiden VARK-alue',
          '{"related_registry_ids_raw":"1000011231, 1000007733, 9999999999"}',
          '{"type":"Point","coordinates":[25.07,60.24]}'
        )
      `),
      env.MAP_FEATURES.prepare(`
        INSERT INTO feature_details
          (source_layer, feature_id, logical_layer_id, registry_id, name, geometry_json)
        VALUES
          ('muinaisjaannokset_piste', 1, 'rajapinta_suojellut:muinaisjaannos_piste', '1000007733', 'Tukikohta IV:10', '{"type":"Point","coordinates":[25.1,60.2]}'),
          ('muinaisjaannokset_piste', 2, 'rajapinta_suojellut:muu_kulttuuriperintokohde_piste', '1000011231', 'Tukikohta IV:11', '{"type":"Point","coordinates":[25.2,60.3]}')
      `),
    ])

    const response = await museovirastoRequest("/features/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [{ sourceLayer: "vark_pisteet", featureId: "49" }] })
    })

    expect(response.status).toBe(200)
    const result = await response.json() as {
      features: Array<{
        properties: Record<string, unknown>
        relatedArchaeologicalSites: Array<{ registryId: string; name: string | null }>
      }>
    }
    expect(result.features[0].properties).not.toHaveProperty("related_registry_ids_raw")
    expect(result.features[0].relatedArchaeologicalSites).toEqual([
      { registryId: "1000011231", name: "Tukikohta IV:11" },
      { registryId: "1000007733", name: "Tukikohta IV:10" },
      { registryId: "9999999999", name: null },
    ])
  })

  it("splits more than 33 references into D1 batches", async () => {
    const insert = env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, geometry_json)
      VALUES ('rky_piste', ?, 'rajapinta_suojellut:rky_piste', ?, '{"type":"Point","coordinates":[385000,6670000]}')
    `)
    await env.MAP_FEATURES.batch(
      Array.from({ length: 40 }, (_, index) => insert.bind(index + 1, String(index + 1)))
    )

    const response = await museovirastoRequest("/features/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features: Array.from({ length: 40 }, (_, index) => ({
          sourceLayer: "rky_piste",
          featureId: String(index + 1)
        }))
      })
    })

    expect(response.status).toBe(200)
    const result = await response.json() as { features: unknown[]; missing: unknown[] }
    expect(result.features).toHaveLength(40)
    expect(result.missing).toEqual([])
  })
})
