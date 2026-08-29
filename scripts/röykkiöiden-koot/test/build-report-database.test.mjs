import assert from "node:assert/strict"
import crypto from "node:crypto"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { run } from "../12_build-report-database.mjs"

test("vaihe 12 julkaisee hyväksytyt ja kuitatut mutta ei keskeneräisiä tai ohitettuja röykkiöitä", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "report-database-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = createPaths(directory)
  const issue1 = { code: "model_review", severity: "warning", message: "Röykkiö 1 tarkistettava", mound: 1 }
  const issue2 = { code: "model_review", severity: "warning", message: "Röykkiö 2 tarkistettava", mound: 2 }
  const reviewed = site("200", [mound(1), mound(2)], [issue1, issue2], "review")
  const accepted = site("100", [mound(1)], [], "accepted")
  await fs.writeFile(paths.siteIndexFile, JSON.stringify({
    type: "FeatureCollection", crs: { type: "name", properties: { name: "EPSG:3067" } },
    features: [feature("100", 1), feature("200", 2)]
  }))
  await fs.writeFile(paths.validatedReportResultsFile, [accepted, reviewed].map(JSON.stringify).join("\n") + "\n")
  await fs.writeFile(paths.documentPassagesFile, ["100", "200"].map((mjtunnus) => JSON.stringify({
    mjtunnus, documents: [{ documentId: "doc", title: "Inventointi 2020", sourceUrl: "https://example.test/doc", sourceYear: 2020 }]
  })).join("\n") + "\n")
  await fs.writeFile(paths.parsedSiteContentFile, ["100", "200"].map((mjtunnus) => JSON.stringify({
    mjtunnus, description: `Kyppi-kuvaus ${mjtunnus}`, source: { sourceUrl: `https://www.kyppi.fi/${mjtunnus}`, fetchedAt: "2026-08-01T00:00:00Z" }
  })).join("\n") + "\n")
  await fs.writeFile(paths.reportReviewAcknowledgementsFile, JSON.stringify({
    acknowledgements: { [id("200", issue1)]: { acknowledgedAt: "2026-08-30T00:00:00Z" } },
    moundDecisions: { "200:2": { status: "permanently_skipped" } }
  }))

  const { records, collection, report } = await run({ paths, now: () => new Date("2026-08-30T18:00:00Z") })
  assert.deepEqual(records.map((record) => record.id), ["100-1", "200-1"])
  assert.equal(records[0].acceptance, "automatic")
  assert.equal(records[1].acceptance, "human_reviewed")
  assert.equal(records[1].sourceReferences[0].title, "Inventointi 2020")
  assert.equal(records[1].kyppiDescription.text, "Kyppi-kuvaus 200")
  assert.equal(records[1].kyppiDescription.role, "supporting_context_not_measurement_source")
  assert.equal(collection.features.length, 2)
  assert.deepEqual(report, {
    schemaVersion: 1, generatedAt: "2026-08-30T18:00:00.000Z", totalSites: 2, totalMounds: 3,
    publishedSites: 2, publishedMounds: 2, automaticAcceptedMounds: 1, humanAcceptedMounds: 1,
    pendingReviewMounds: 0, permanentlySkippedMounds: 1, invalidMounds: 0
  })
  assert.equal((await fs.readFile(paths.finalReportMoundsFile, "utf8")).trim().split("\n").length, 2)
})

test("kohdetason kuittaamaton havainto estää kohteen kaikki röykkiöt", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "report-site-issue-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = createPaths(directory)
  const issue = { code: "mound_count_mismatch", severity: "warning", message: "Määrä ei täsmää", mound: null }
  await fs.writeFile(paths.siteIndexFile, JSON.stringify({ type: "FeatureCollection", features: [feature("100", 1)] }))
  await fs.writeFile(paths.validatedReportResultsFile, JSON.stringify(site("100", [mound(1), mound(2)], [issue], "review")) + "\n")
  await fs.writeFile(paths.documentPassagesFile, JSON.stringify({ mjtunnus: "100", documents: [] }) + "\n")

  const { records, report } = await run({ paths })
  assert.equal(records.length, 0)
  assert.equal(report.pendingReviewMounds, 2)
})

function createPaths(directory) {
  return {
    siteIndexFile: path.join(directory, "sites.geojson"),
    validatedReportResultsFile: path.join(directory, "validated.jsonl"),
    documentPassagesFile: path.join(directory, "passages.jsonl"),
    parsedSiteContentFile: path.join(directory, "site-content.jsonl"),
    reportReviewAcknowledgementsFile: path.join(directory, "ack.json"),
    finalReportMoundsFile: path.join(directory, "results", "mounds.jsonl"),
    finalReportMoundsGeoJsonFile: path.join(directory, "results", "mounds.geojson"),
    finalReportBuildReportFile: path.join(directory, "results", "report.json")
  }
}

function feature(mjtunnus, coordinate) {
  return { type: "Feature", id: `source.${mjtunnus}`, geometry: { type: "Point", coordinates: [coordinate, coordinate] }, properties: { mjtunnus, kohdenimi: `Kohde ${mjtunnus}`, kunta: "Testilä", url: "https://example.test/site" } }
}

function mound(sourceOrder) {
  return { sourceOrder, lengthM: { min: 4, max: 4, approximate: false }, widthM: { min: 3, max: 3, approximate: false }, diameterM: null, heightM: { min: 1, max: 1, approximate: false }, shape: null, status: null, confidence: "high", sourceReferences: [{ documentId: "doc", page: 2, evidence: "Röykkiö on 4 x 3 m ja 1 m korkea." }] }
}

function site(mjtunnus, mounds, issues, status) {
  return { mjtunnus, mounds, notes: [], extraction: { model: "test", createdAt: "2026-08-30T00:00:00Z" }, validation: { status, issues } }
}

function id(mjtunnus, issue) {
  return crypto.createHash("sha256").update(JSON.stringify({ mjtunnus, code: issue.code, message: issue.message, mound: issue.mound ?? null })).digest("hex")
}
