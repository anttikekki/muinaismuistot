import { beforeEach, describe, expect, it } from "vitest"
import { museovirastoRequest, resetMuseovirastoData } from "../../support/museovirasto"

beforeEach(resetMuseovirastoData)

describe("Museovirasto layers endpoint", () => {
  it("returns all logical layer definitions", async () => {
    const response = await museovirastoRequest("/layers")
    expect(response.status).toBe(200)
    expect(await response.json()).toHaveLength(26)
  })
})
