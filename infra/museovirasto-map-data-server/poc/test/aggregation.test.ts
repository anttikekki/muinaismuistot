import { describe, expect, it } from "vitest"
import { nextAggregationMode } from "../web/aggregation"

describe("aggregation hysteresis", () => {
  it("enables aggregation only above the upper threshold", () => {
    expect(nextAggregationMode(false, 40_000)).toBe(false)
    expect(nextAggregationMode(false, 40_001)).toBe(true)
  })

  it("keeps aggregation enabled through the hysteresis band", () => {
    expect(nextAggregationMode(true, 20_000)).toBe(true)
    expect(nextAggregationMode(true, 39_999)).toBe(true)
  })

  it("disables aggregation below the lower threshold", () => {
    expect(nextAggregationMode(true, 19_999)).toBe(false)
  })

  it("rejects overlapping thresholds", () => {
    expect(() => nextAggregationMode(false, 1, 10, 10)).toThrow()
  })
})
