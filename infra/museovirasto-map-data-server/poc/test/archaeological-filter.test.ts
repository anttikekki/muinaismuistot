import { describe, expect, it } from "vitest"
import {
  archaeologicalDatings,
  archaeologicalTypes,
  matchesArchaeologicalFilter,
} from "../web/archaeological-filter"

const allTypes = new Set<string>(archaeologicalTypes)
const allDatings = new Set<string>(archaeologicalDatings)

describe("archaeological point filters", () => {
  it("matches the bronze-age burial cairn use case", () => {
    expect(
      matchesArchaeologicalFilter(
        {
          typesRaw: "hautapaikat,  ,  ,",
          subtypesRaw: "hautaröykkiöt, kuppikivet,  ,",
          datingsRaw: "pronssikautinen, rautakautinen,  ,",
        },
        {
          selectedTypes: new Set(["hautapaikat"]),
          selectedDatings: new Set(["pronssikautinen"]),
          subtype: "Hautaröykkiöt",
        },
      ),
    ).toBe(true)
  })

  it("uses OR within a dimension and AND between dimensions", () => {
    expect(
      matchesArchaeologicalFilter(
        {
          typesRaw: "asuinpaikat, hautapaikat,  ,",
          subtypesRaw: "hautaröykkiöt,  ,  ,",
          datingsRaw: "rautakautinen,  ,  ,",
        },
        {
          selectedTypes: new Set(["asuinpaikat", "kivirakenteet"]),
          selectedDatings: new Set(["pronssikautinen"]),
          subtype: "",
        },
      ),
    ).toBe(false)
  })

  it("passes all values when all current options are selected", () => {
    expect(
      matchesArchaeologicalFilter(
        { typesRaw: "", subtypesRaw: "", datingsRaw: "" },
        { selectedTypes: allTypes, selectedDatings: allDatings, subtype: "" },
      ),
    ).toBe(true)
  })

  it("excludes all archaeological points when either selection is empty", () => {
    const properties = { typesRaw: "hautapaikat", subtypesRaw: "hautaröykkiöt", datingsRaw: "pronssikautinen" }
    expect(
      matchesArchaeologicalFilter(properties, {
        selectedTypes: new Set(),
        selectedDatings: allDatings,
        subtype: "",
      }),
    ).toBe(false)
  })
})
