import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, pmtilesBody, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto PMTiles endpoint", () => {
  it("serves byte ranges", async () => {
    const response = await museovirastoRequest("/pmtiles", { headers: { Range: "bytes=0-6" } })

    expect(response.status).toBe(206)
    expect(response.headers.get("Content-Range")).toBe(`bytes 0-6/${pmtilesBody.length}`)
    expect(new TextDecoder().decode(await response.arrayBuffer())).toBe("PMTiles")
  })

  it("rejects multiple byte ranges", async () => {
    const response = await museovirastoRequest("/pmtiles", { headers: { Range: "bytes=0-1,4-5" } })

    expect(response.status).toBe(416)
  })

  it("does not expose an unused HEAD operation", async () => {
    const response = await museovirastoRequest("/pmtiles", { method: "HEAD" })

    expect(response.status).toBe(405)
    expect(response.headers.get("Allow")).toBe("GET, OPTIONS")
  })
})
