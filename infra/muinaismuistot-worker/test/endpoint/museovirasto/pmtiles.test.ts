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
})
