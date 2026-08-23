import { env, exports } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"

const KEY = "museovirasto-poc.pmtiles"
const BODY = new TextEncoder().encode("0123456789abcdefghijklmnopqrstuvwxyz")
const decoder = new TextDecoder()

declare module "cloudflare:workers" {
  interface ProvidedEnv extends Env {}
}

async function request(range?: string, method = "GET"): Promise<Response> {
  const headers = range ? { Range: range } : undefined
  return exports.default.fetch(
    new Request("https://example.test/pmtiles/museovirasto-poc.pmtiles", { method, headers }),
  )
}

beforeEach(async () => {
  await env.MAP_DATA.put(KEY, BODY, {
    httpMetadata: { contentType: "application/vnd.pmtiles" },
  })
  await env.MAP_FEATURES.prepare("CREATE TABLE IF NOT EXISTS feature_details (source_layer TEXT NOT NULL, feature_id INTEGER NOT NULL, logical_layer_id TEXT NOT NULL, registry_id TEXT, name TEXT, municipality TEXT, properties_json TEXT NOT NULL DEFAULT '{}', PRIMARY KEY (source_layer, feature_id)) WITHOUT ROWID").run()
  await env.MAP_FEATURES.prepare("DELETE FROM feature_details").run()
})

describe("PMTiles byte range Worker", () => {
  it("returns an exact byte range", async () => {
    const response = await request("bytes=5-9")

    expect(response.status).toBe(206)
    expect(response.headers.get("Content-Range")).toBe(`bytes 5-9/${BODY.length}`)
    expect(response.headers.get("Content-Length")).toBe("5")
    expect(response.headers.get("Accept-Ranges")).toBe("bytes")
    expect(response.headers.get("ETag")).toBeTruthy()
    expect(decoder.decode(await response.arrayBuffer())).toBe("56789")
  })

  it("supports open-ended and suffix ranges", async () => {
    const openEnded = await request("bytes=32-")
    expect(openEnded.status).toBe(206)
    expect(decoder.decode(await openEnded.arrayBuffer())).toBe("wxyz")

    const suffix = await request("bytes=-4")
    expect(suffix.status).toBe(206)
    expect(decoder.decode(await suffix.arrayBuffer())).toBe("wxyz")
  })

  it("clamps the requested end to the object size", async () => {
    const response = await request("bytes=34-999")
    expect(response.headers.get("Content-Range")).toBe(`bytes 34-35/${BODY.length}`)
    expect(decoder.decode(await response.arrayBuffer())).toBe("yz")
  })

  it.each(["items=0-1", "bytes=", "bytes=9-4", "bytes=999-", "bytes=0-1,3-4", "bytes=-0"])(
    "rejects invalid or multiple ranges: %s",
    async (range) => {
      const response = await request(range)
      expect(response.status).toBe(416)
      expect(response.headers.get("Content-Range")).toBe(`bytes */${BODY.length}`)
      await response.arrayBuffer()
    },
  )

  it("requires a Range header for GET", async () => {
    const response = await request()
    expect(response.status).toBe(400)
    expect(await response.text()).toContain("Range")
  })

  it("serves HEAD without an object body", async () => {
    const response = await request(undefined, "HEAD")
    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Length")).toBe(String(BODY.length))
    expect(await response.text()).toBe("")
  })

  it("handles CORS preflight", async () => {
    const response = await request(undefined, "OPTIONS")
    expect(response.status).toBe(204)
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain("Range")
    await response.arrayBuffer()
  })

  it("rejects unsupported methods", async () => {
    const response = await request(undefined, "POST")
    expect(response.status).toBe(405)
    expect(response.headers.get("Allow")).toBe("GET, HEAD, OPTIONS")
    await response.arrayBuffer()
  })

  it("returns 404 when the configured object is missing", async () => {
    await env.MAP_DATA.delete(KEY)
    const response = await request("bytes=0-1")
    expect(response.status).toBe(404)
    await response.arrayBuffer()
  })

  it("returns the 26 logical layer definitions", async () => {
    const response = await exports.default.fetch(new Request("https://example.test/api/layers"))
    const layers = (await response.json()) as unknown[]
    expect(response.status).toBe(200)
    expect(layers).toHaveLength(26)
  })

  it("returns deduplicated feature details in request order with one batch", async () => {
    await env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name, municipality, properties_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind("archaeological_points", 123, "rajapinta_suojellut:muinaisjaannos_piste", "100", "Testikohde", "Turku", '{"kind":"kiinteä muinaisjäännös"}').run()

    const response = await exports.default.fetch(new Request("https://example.test/api/features/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [
        { sourceLayer: "archaeological_points", featureId: "123" },
        { sourceLayer: "rky_points", featureId: "456" },
        { sourceLayer: "archaeological_points", featureId: "123" },
      ] }),
    }))
    const body = await response.json() as { features: Array<{ properties: { name: string } }>; missing: unknown[] }
    expect(response.status).toBe(200)
    expect(body.features).toHaveLength(1)
    expect(body.features[0].properties.name).toBe("Testikohde")
    expect(body.missing).toEqual([{ sourceLayer: "rky_points", featureId: "456" }])
  })

  it("validates feature batch requests", async () => {
    const invalidLayer = await exports.default.fetch(new Request("https://example.test/api/features/batch", {
      method: "POST",
      body: JSON.stringify({ features: [{ sourceLayer: "invalid", featureId: "1" }] }),
    }))
    expect(invalidLayer.status).toBe(400)

    const tooMany = await exports.default.fetch(new Request("https://example.test/api/features/batch", {
      method: "POST",
      body: JSON.stringify({ features: Array.from({ length: 101 }, (_, index) => ({ sourceLayer: "rky_points", featureId: String(index + 1) })) }),
    }))
    expect(tooMany.status).toBe(400)
  })

  it("returns every current row matching a logical layer and registry ID", async () => {
    const insert = env.MAP_FEATURES.prepare(`
      INSERT INTO feature_details
        (source_layer, feature_id, logical_layer_id, registry_id, name, municipality, properties_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    await env.MAP_FEATURES.batch([
      insert.bind("archaeological_areas", 10, "rajapinta_suojellut:muinaisjaannos_alue", "100", "Ensimmäinen geometria", "Turku", "{}"),
      insert.bind("archaeological_areas", 11, "rajapinta_suojellut:muinaisjaannos_alue", "100", "Toinen geometria", "Turku", "{}"),
      insert.bind("archaeological_areas", 12, "rajapinta_suojellut:muinaisjaannos_alue", "200", "Muu kohde", "Turku", "{}"),
    ])

    const response = await exports.default.fetch(new Request("https://example.test/api/features/by-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [
        { logicalLayerId: "rajapinta_suojellut:muinaisjaannos_alue", registryId: "100" },
        { logicalLayerId: "rajapinta_suojellut:muinaisjaannos_alue", registryId: "999" },
      ] }),
    }))
    const body = await response.json() as { features: Array<{ featureId: string }>; missing: unknown[] }
    expect(response.status).toBe(200)
    expect(body.features.map((feature) => feature.featureId)).toEqual(["10", "11"])
    expect(body.missing).toEqual([
      { logicalLayerId: "rajapinta_suojellut:muinaisjaannos_alue", registryId: "999" },
    ])
  })

  it("validates registry batch requests", async () => {
    const response = await exports.default.fetch(new Request("https://example.test/api/features/by-register", {
      method: "POST",
      body: JSON.stringify({ features: [{ logicalLayerId: "invalid", registryId: "100" }] }),
    }))
    expect(response.status).toBe(400)
  })
})
