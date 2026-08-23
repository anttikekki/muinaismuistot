import vocabulary from "./filter-vocabulary.json"

export const archaeologicalTypes = vocabulary.types
export const archaeologicalDatings = vocabulary.datings

export type ArchaeologicalFilter = { typeMask: number; datingMask: number; subtypeCodes: ReadonlySet<string> | undefined; allTypes: boolean; allDatings: boolean }
export type ArchaeologicalFilterProperties = { typeMask: number; datingMask: number; subtypeCodes: string }

export function compileArchaeologicalFilter(selectedTypes: ReadonlySet<string>, selectedDatings: ReadonlySet<string>, subtypeQuery: string): ArchaeologicalFilter {
  return {
    typeMask: selectionMask(selectedTypes, archaeologicalTypes),
    datingMask: selectionMask(selectedDatings, archaeologicalDatings),
    subtypeCodes: matchingSubtypeCodes(subtypeQuery),
    allTypes: selectedTypes.size === archaeologicalTypes.length,
    allDatings: selectedDatings.size === archaeologicalDatings.length,
  }
}

export function matchesArchaeologicalFilter(properties: ArchaeologicalFilterProperties, filter: ArchaeologicalFilter): boolean {
  if (filter.typeMask === 0 || filter.datingMask === 0) return false
  if (!filter.allTypes && (properties.typeMask & filter.typeMask) === 0) return false
  if (!filter.allDatings && (properties.datingMask & filter.datingMask) === 0) return false
  if (!filter.subtypeCodes) return true
  return properties.subtypeCodes.split(".").some((code) => filter.subtypeCodes?.has(code))
}

function selectionMask(selected: ReadonlySet<string>, values: readonly string[]): number {
  let mask = 0
  values.forEach((value, index) => { if (selected.has(value)) mask += 2 ** index })
  return mask
}

function matchingSubtypeCodes(query: string): ReadonlySet<string> | undefined {
  const normalized = normalize(query)
  if (!normalized) return undefined
  const result = new Set<string>()
  vocabulary.subtypes.forEach((value, index) => {
    if (normalize(value).includes(normalized)) result.add((index + 1).toString(36))
  })
  return result
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("fi-FI")
}
