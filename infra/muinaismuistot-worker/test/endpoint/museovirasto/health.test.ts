import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto health endpoint", () => {
  it("reports a complete active dataset as healthy", async () => {
    await env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details (source_layer, feature_id, logical_layer_id)
      VALUES ('rky_points', 1, 'rajapinta_suojellut:rky_piste')
    `).run()

    const response = await museovirastoRequest("/health")
    expect(response.status).toBe(200)
    expect((await response.json() as { ok: boolean }).ok).toBe(true)
  })
})
