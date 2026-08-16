import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import {
  formatReviewList,
  run,
  validateExtraction
} from "../5_validate-results.mjs"

test("validateExtraction hyväksyy lähdetekstin tukeman tuloksen", () => {
  assert.deepEqual(validateExtraction(extraction(), site()), [])
})

test("validateExtraction löytää määrä-, mitta- ja lähdetukiongelmat", () => {
  const value = extraction()
  value.statedMoundCount = 2
  value.mounds[0].heightM = { min: 0, max: 0, approximate: false }
  value.mounds[0].evidence = ["Tekstiä jota lähteessä ei ole."]
  const codes = validateExtraction(value, site()).map((issue) => issue.code)
  assert.ok(codes.includes("mound_count_mismatch"))
  assert.ok(codes.includes("non_positive_measurement"))
  assert.ok(codes.includes("evidence_not_in_source"))
})

test("run kirjoittaa validoidun aineiston, tarkistusjonon ja raportin", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mound-validation-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = {
    parsedSiteContentFile: path.join(directory, "3.jsonl"),
    moundDimensionsFile: path.join(directory, "4.jsonl"),
    validatedResultsFile: path.join(directory, "5.jsonl"),
    reviewFile: path.join(directory, "review.json"),
    validationReportFile: path.join(directory, "report.json")
  }
  await fs.writeFile(paths.parsedSiteContentFile, `${JSON.stringify(site())}\n`)
  await fs.writeFile(paths.moundDimensionsFile, `${JSON.stringify(extraction())}\n`)
  const { report } = await run({ paths, now: () => new Date("2026-08-02T12:00:00Z") })
  assert.equal(report.acceptedSites, 1)
  assert.equal(report.totalMounds, 1)
  assert.equal(JSON.parse(await fs.readFile(paths.reviewFile)).sites.length, 0)
})

test("tarkistusraportti sisältää lähde- ja poimintatiedot", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mound-review-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = {
    parsedSiteContentFile: path.join(directory, "3.jsonl"),
    moundDimensionsFile: path.join(directory, "4.jsonl"),
    validatedResultsFile: path.join(directory, "5.jsonl"),
    reviewFile: path.join(directory, "review.json"),
    validationReportFile: path.join(directory, "report.json")
  }
  const source = site()
  const result = extraction()
  result.mounds[0].needsReview = true
  await fs.writeFile(paths.parsedSiteContentFile, `${JSON.stringify(source)}\n`)
  await fs.writeFile(paths.moundDimensionsFile, `${JSON.stringify(result)}\n`)
  await run({ paths })
  const review = JSON.parse(await fs.readFile(paths.reviewFile))
  assert.equal(review.sites[0].name, null)
  assert.equal(review.sites[0].sourceData.description, source.description)
  assert.deepEqual(review.sites[0].extractedData.mounds, result.mounds)
})

test("formatReviewList tulostaa tunnuksen, metatiedot, syyt ja linkin", () => {
  const result = extraction()
  result.validation = {
    status: "review",
    issues: [{ code: "model_review", severity: "warning", message: "Tarkista" }]
  }
  const lines = formatReviewList(
    [result],
    new Map([["123", site()]]),
    new Map([["123", {
      name: "Testikohde",
      municipality: "Testikunta",
      url: "https://example.test/123"
    }]])
  )
  assert.deepEqual(lines, [
    "123 | Testikohde, Testikunta | model_review | https://example.test/123"
  ])
})

function site() {
  return { mjtunnus: "123", description: "Röykkiön halkaisija on noin 11 m.", parsing: { needsReview: false } }
}

function extraction() {
  return {
    mjtunnus: "123", statedMoundCount: 1,
    mounds: [{ sourceOrder: 1, ordinal: null, direction: null, lengthM: null, widthM: null,
      diameterM: { min: 11, max: 11, approximate: true }, heightM: null,
      shape: null, status: null, confidence: "high", needsReview: false,
      evidence: ["Röykkiön halkaisija on noin 11 m."] }],
    notes: []
  }
}
