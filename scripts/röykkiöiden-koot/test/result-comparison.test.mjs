import assert from "node:assert/strict"
import test from "node:test"
import { compareSiteResults, createResultComparison } from "../lib/result-comparison.mjs"

const measure = (value) => value == null ? null : ({ min: value, max: value, approximate: false })
const mound = (order, length, width = null) => ({ sourceOrder: order, lengthM: measure(length), widthM: measure(width), diameterM: null, heightM: null })
const result = (mjtunnus, status, mounds, statedMoundCount = mounds.length) => ({ mjtunnus, statedMoundCount, mounds, validation: { status, issues: [] } })

test("vertailu laskee määrä-, mitta- ja tarkistustilaerot", () => {
  const descriptions = [
    result("1", "accepted", [mound(1, 5)]),
    result("2", "review", [mound(1, 4)]),
    result("3", "accepted", [mound(1, 2), mound(2, 3)])
  ]
  const pdfs = [
    result("1", "accepted", [mound(1, 5)]),
    result("2", "accepted", [mound(1, 6)]),
    result("3", "review", [mound(1, 2)])
  ]
  const comparison = createResultComparison(descriptions, pdfs)
  assert.equal(comparison.comparableSites, 3)
  assert.equal(comparison.differentMoundCountSites, 1)
  assert.equal(comparison.differentMeasurementSites, 1)
  assert.equal(comparison.unpairedMeasurementSites, 1)
  assert.equal(comparison.differentStatusSites, 2)
  assert.deepEqual(comparison.statusMatrix, { "accepted|accepted": 1, "review|accepted": 1, "accepted|review": 1 })
})

test("määräeron yhteydessä röykkiöitä ei pariteta väkisin", () => {
  const comparison = compareSiteResults(result("1", "accepted", [mound(1, 5), mound(2, 6)]), result("1", "accepted", [mound(1, 5)]))
  assert.equal(comparison.moundCountDifference, true)
  assert.equal(comparison.measurementDifference, null)
  assert.deepEqual(comparison.pairedMounds, [])
})

test("sama mitta-arvo mutta eri arvioituusmerkintä raportoidaan erikseen", () => {
  const description = result("1", "accepted", [mound(1, 13)])
  const pdf = result("1", "accepted", [mound(1, 13)])
  pdf.mounds[0].lengthM.approximate = true
  const comparison = compareSiteResults(description, pdf)
  assert.equal(comparison.measurementDifference, false)
  assert.equal(comparison.approximationDifference, true)
  assert.deepEqual(comparison.pairedMounds[0].differingFields, [])
  assert.deepEqual(comparison.pairedMounds[0].approximationDifferingFields, ["lengthM"])
})
