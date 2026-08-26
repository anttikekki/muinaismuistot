import assert from "node:assert/strict"
import test from "node:test"
import { countIdentitiesByLayer, duplicateValues, parseIdentityTsv, setDifference, validateGeometryFamily } from "../lib/rules.mjs"

test("accepts polygon and multipolygon rows behind generic geometry metadata", () => {
  assert.doesNotThrow(() => validateGeometryFamily("POLYGON", "Geometry", [
    { geometryType: "POLYGON", count: 10 },
    { geometryType: "MULTIPOLYGON", count: 1 },
  ]))
})

test("rejects a line in a polygonal layer", () => {
  assert.throws(() => validateGeometryFamily("POLYGON", "GEOMETRY", [
    { geometryType: "LINESTRING", count: 1 },
  ]), /LINESTRING=1/)
})

test("finds duplicate contract identifiers", () => {
  assert.deepEqual(duplicateValues(["a", "b", "a", "c", "b"]), ["a", "b"])
})

test("parses, compares and counts identity TSV", () => {
  const left = parseIdentityTsv("areas\t1\npoints\t2\npoints\t3\n")
  const right = parseIdentityTsv("areas\t1\npoints\t3\n")
  assert.deepEqual(setDifference(left, right), ["points\t2"])
  assert.deepEqual(countIdentitiesByLayer(left), { areas: 1, points: 2 })
})

test("rejects malformed identity TSV", () => {
  assert.throws(() => parseIdentityTsv("points\tnot-a-number\n"), /invalid identity TSV row/)
})
