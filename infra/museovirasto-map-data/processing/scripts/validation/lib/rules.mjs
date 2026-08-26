import { assertValid } from "./diagnostics.mjs"

export function normalizeGeometryType(value) {
  return String(value ?? "").toUpperCase().replaceAll(" ", "")
}

export function validateGeometryFamily(expected, declared, observed = []) {
  const normalizedExpected = normalizeGeometryType(expected)
  const normalizedDeclared = normalizeGeometryType(declared)
  if (normalizedDeclared === normalizedExpected) return
  if (normalizedExpected === "POLYGON" && ["GEOMETRY", "MULTIPOLYGON"].includes(normalizedDeclared)) {
    const unexpected = observed.filter(({ geometryType }) => !["POLYGON", "MULTIPOLYGON"].includes(normalizeGeometryType(geometryType)))
    assertValid(unexpected.length === 0, `expected polygonal features, got ${unexpected.map(({ geometryType, count }) => `${geometryType}=${count}`).join(", ")}`)
    return
  }
  throw new Error(`expected ${normalizedExpected}, got ${normalizedDeclared || "missing"}`)
}

export function duplicateValues(values) {
  const seen = new Set()
  const duplicates = new Set()
  for (const value of values) seen.has(value) ? duplicates.add(value) : seen.add(value)
  return [...duplicates].sort()
}

export function parseIdentityTsv(text) {
  const identities = new Set()
  for (const line of text.split("\n")) {
    if (!line) continue
    const [layer, id, extra] = line.split("\t")
    assertValid(Boolean(layer) && /^\d+$/.test(id ?? "") && extra === undefined, `invalid identity TSV row: ${line}`)
    identities.add(`${layer}\t${id}`)
  }
  return identities
}

export function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort()
}

export function countIdentitiesByLayer(identities) {
  const counts = {}
  for (const identity of identities) {
    const layer = identity.split("\t", 1)[0]
    counts[layer] = (counts[layer] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)))
}
