import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto features by register endpoint", () => {
  it("returns all geometries matching a registry ID", async () => {
    const insert = env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name)
      VALUES (?, ?, ?, ?, ?)
    `)
    await env.MAP_FEATURES.batch([
      insert.bind("archaeological_areas", 1, "rajapinta_suojellut:muinaisjaannos_alue", "100", "Alue 1"),
      insert.bind("archaeological_areas", 2, "rajapinta_suojellut:muinaisjaannos_alue", "100", "Alue 2")
    ])

    const response = await museovirastoRequest("/features/by-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [{
        logicalLayerId: "rajapinta_suojellut:muinaisjaannos_alue",
        registryId: "100"
      }] })
    })

    expect(response.status).toBe(200)
    expect((await response.json() as { features: unknown[] }).features).toHaveLength(2)
  })
})
