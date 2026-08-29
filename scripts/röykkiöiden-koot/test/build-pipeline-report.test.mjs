import assert from "node:assert/strict"
import test from "node:test"

import { createPipelineReport, renderPipelineReportHtml } from "../13_build-pipeline-report.mjs"

test("koeajoraportti kokoaa vaiheiden 7–12 keskeiset tunnusluvut", () => {
  const inputs = {
    step7: { generatedAt: "2026-08-30T10:00:00Z", sites: [{}, {}], records: [{}] },
    step8: { generatedAt: "2026-08-30T10:01:00Z", summary: { selectedRecords: 1, recordPagesDownloaded: 1, documentsDownloaded: 2, documentsSkipped: 1, failed: 0 } },
    step9: { generatedAt: "2026-08-30T10:02:00Z", selectedSites: 2, sitesWithPassages: 2, documentsMatched: 2, documentsWithoutMatch: 0, pagesExtracted: 8 },
    coverage: { generatedAt: "2026-08-30T10:02:01Z", counts: { ready_for_llm: 2, site_not_found: 0 } },
    step10: { generatedAt: "2026-08-30T10:03:00Z", selectedSites: 2, successfulSites: 2, failedSites: 0, outputSites: 2, apiCalls: 1, reusedResponses: 1, cacheHits: 0, model: "test" },
    step11: { generatedAt: "2026-08-30T10:04:00Z", totalSites: 2, acceptedSites: 1, reviewSites: 1, invalidSites: 0, totalMounds: 3, issueCounts: { model_review: 1 } },
    step12: { generatedAt: "2026-08-30T10:05:00Z", totalMounds: 3, publishedSites: 2, publishedMounds: 3, automaticAcceptedMounds: 2, humanAcceptedMounds: 1, pendingReviewMounds: 0, permanentlySkippedMounds: 0, invalidMounds: 0 }
  }
  const report = createPipelineReport(inputs, "2026-08-30T10:06:00Z")
  assert.equal(report.status, "complete")
  assert.deepEqual(report.warnings, [])
  assert.equal(report.stages.documents.documentsDownloaded, 2)
  assert.equal(report.stages.extraction.candidateResponsesReused, 1)
  assert.equal(report.stages.publication.publishedMounds, 3)
  const html = renderPipelineReportHtml(report)
  assert.match(html, /Raporttiputken koeajo/)
  assert.match(html, /Kattavuusluokat/)
  assert.match(html, /Kaikki vaiheet löytyvät/)
})

test("koeajoraportti varoittaa puuttuvista ja ristiriitaisista vaiheista", () => {
  const report = createPipelineReport({
    step7: { generatedAt: "2026-08-30T10:00:00Z", sites: [{}], records: [] },
    step9: { generatedAt: "2026-08-30T10:01:00Z", selectedSites: 2, sitesWithPassages: 0 }
  }, "2026-08-30T10:02:00Z")
  assert.equal(report.status, "incomplete")
  assert.ok(report.warnings.some((warning) => warning.includes("Vaiheessa 7 on 1 kohdetta")))
  assert.ok(report.warnings.some((warning) => warning.includes("Puuttuvat raportit")))
})

test("koostesivu näyttää description- ja PDF-vertailun sekä tarkistustilamatriisin", () => {
  const comparison = {
    pdfSites: 2, comparableSites: 2, missingDescriptionSites: 0,
    sameMoundCountSites: 1, differentMoundCountSites: 1,
    sameMeasurementSites: 0, differentMeasurementSites: 1, unpairedMeasurementSites: 1,
    sameStatusSites: 0, differentStatusSites: 2,
    statusMatrix: { "accepted|review": 1, "review|accepted": 1 },
    lists: { moundCountDifference: ["123"], measurementDifference: ["456"], statusDifference: ["123", "456"] },
    sites: []
  }
  const report = createPipelineReport({}, "2026-08-30T10:02:00Z", comparison)
  const html = renderPipelineReportHtml(report)
  assert.match(html, /Description- ja PDF-päätelmien vertailu/)
  assert.match(html, /Tarkistustilojen vertailu/)
  assert.match(html, /hyväksytty/)
  assert.match(html, /tarkistettava/)
  assert.match(html, /11_report-review\.html#site-123/)
})
