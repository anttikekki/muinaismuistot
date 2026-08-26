import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto metadata endpoint", () => {
  it("returns the active dataset metadata", async () => {
    const response = await museovirastoRequest("/meta")

    expect(response.status).toBe(200)
    expect((await response.json() as { version: string }).version).toBe("20260822T000000Z")
  })
})
