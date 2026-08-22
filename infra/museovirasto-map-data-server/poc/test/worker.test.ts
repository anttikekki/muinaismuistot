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
})
