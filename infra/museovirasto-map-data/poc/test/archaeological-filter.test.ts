import { describe, expect, it } from "vitest"
import { archaeologicalDatings, archaeologicalTypes, compileArchaeologicalFilter, matchesArchaeologicalFilter } from "../web/archaeological-filter"

const allTypes = new Set<string>(archaeologicalTypes)
const allDatings = new Set<string>(archaeologicalDatings)

describe("compact archaeological point filters", () => {
  it("matches the bronze-age burial cairn use case", () => {
    const filter = compileArchaeologicalFilter(new Set(["hautapaikat"]), new Set(["pronssikautinen"]), "Hautaröykkiöt")
    expect(matchesArchaeologicalFilter({ typeMask: 8, datingMask: 16, subtypeCodes: "c.1z" }, filter)).toBe(true)
  })

  it("uses OR within a dimension and AND between dimensions", () => {
    const filter = compileArchaeologicalFilter(new Set(["asuinpaikat", "kivirakenteet"]), new Set(["pronssikautinen"]), "")
    expect(matchesArchaeologicalFilter({ typeMask: 12, datingMask: 32, subtypeCodes: "c" }, filter)).toBe(false)
  })

  it("passes empty source classifications when all options are selected", () => {
    const filter = compileArchaeologicalFilter(allTypes, allDatings, "")
    expect(matchesArchaeologicalFilter({ typeMask: 0, datingMask: 0, subtypeCodes: "" }, filter)).toBe(true)
  })

  it("excludes all points when either selection is empty", () => {
    const filter = compileArchaeologicalFilter(new Set(), allDatings, "")
    expect(matchesArchaeologicalFilter({ typeMask: 8, datingMask: 16, subtypeCodes: "c" }, filter)).toBe(false)
  })

  it("retains subtype substring matching through the vocabulary", () => {
    const filter = compileArchaeologicalFilter(allTypes, allDatings, "röykkiöt")
    expect(matchesArchaeologicalFilter({ typeMask: 8, datingMask: 16, subtypeCodes: "c" }, filter)).toBe(true)
    expect(matchesArchaeologicalFilter({ typeMask: 8, datingMask: 16, subtypeCodes: "d" }, filter)).toBe(false)
  })
})
