import assert from "node:assert/strict"
import test from "node:test"
import { createSourceDocumentSummary, renderReviewHtml, validateReportExtraction } from "../11_validate-report-results.mjs"

test("raporttivalidointi löytää lähteessä mainitun mutta tuloksesta puuttuvan korkeuden", () => {
  const evidence = "Röykkiön koko on 4 x 5 m ja korkeus noin metrin."
  const site = { mjtunnus: "123", needsReview: false, documents: [{ documentId: "doc", passages: [{ page: 2, text: evidence }] }] }
  const extraction = {
    mjtunnus: "123", statedMoundCount: 1, notes: [],
    mounds: [{ sourceOrder: 1, lengthM: { min: 5, max: 5, approximate: false }, widthM: { min: 4, max: 4, approximate: false }, diameterM: null, heightM: null, shape: null, status: null, confidence: "high", needsReview: false, evidence: [evidence], sourceReferences: [{ documentId: "doc", page: 2, evidence }] }]
  }
  const issues = validateReportExtraction(extraction, site)
  assert.ok(issues.some((issue) => issue.code === "height_omitted"))
  assert.ok(!issues.some((issue) => issue.code === "dimensions_omitted"))
})

test("raporttivalidointi hylkää vanhemman aineiston käytön, kun uudempi on saatavilla", () => {
  const evidence = "Röykkiön halkaisija on 12 m."
  const site = {
    mjtunnus: "123", latestSourceYear: 2009, needsReview: false,
    documents: [{ documentId: "old", sourceYear: 2001, isLatestSource: false, passages: [{ page: 2, text: evidence }] }]
  }
  const extraction = {
    mjtunnus: "123", statedMoundCount: 1, notes: [],
    mounds: [{ sourceOrder: 1, lengthM: null, widthM: null, diameterM: { min: 12, max: 12, approximate: false }, heightM: null, shape: null, status: null, confidence: "high", needsReview: false, evidence: [evidence], sourceReferences: [{ documentId: "old", page: 2, evidence }] }]
  }
  const issues = validateReportExtraction(extraction, site)
  assert.ok(issues.some((issue) => issue.code === "outdated_source_used" && issue.severity === "error"))
})

test("lähteen tukema mitaton röykkiö ei yksin aiheuta tarkistushavaintoa", () => {
  const evidence = "Kyseessä on epämääräinen röykkiönpohja. Paikalla on isoja maakiviä."
  const site = { mjtunnus: "123", latestSourceYear: 2009, needsReview: true, documents: [{ documentId: "new", sourceYear: 2009, isLatestSource: true, passages: [{ page: 2, text: evidence, quality: { needsReview: false } }] }] }
  const extraction = {
    mjtunnus: "123", statedMoundCount: 1, notes: [],
    mounds: [{ sourceOrder: 1, lengthM: null, widthM: null, diameterM: null, heightM: null, shape: null, status: "röykkiönpohja", confidence: "high", needsReview: false, evidence: [evidence], sourceReferences: [{ documentId: "new", page: 2, evidence }] }]
  }
  assert.deepEqual(validateReportExtraction(extraction, site), [])
})

test("raporttien tarkistusnäkymä suodattaa tilat ja ohittaa röykkiöittäin", () => {
  const html = renderReviewHtml({ sites: [] }, { totalSites: 0, reviewSites: 0, invalidSites: 0 })
  assert.match(html, /Näytettävät röykkiöiden tilat:/)
  assert.match(html, /value="automatic" checked/)
  assert.match(html, /value="human_reviewed" checked/)
  assert.match(html, /value="pending" checked/)
  assert.match(html, /value="skipped" checked/)
  assert.match(html, /value="invalid" checked/)
  assert.match(html, /id="automatic-count"/)
  assert.match(html, /id="human-count"/)
  assert.match(html, /id="pending-count"/)
  assert.match(html, /id="skipped-count"/)
  assert.match(html, /id="invalid-count"/)
  assert.match(html, /Mukana lopullisessa aineistossa/)
  assert.match(html, /\/api\/mound-decisions\//)
})

test("tarkistusnäkymän PDF-luettelo kertoo vuodet ja valintaperusteet", () => {
  const sourceDocuments = createSourceDocumentSummary({
    latestSourceYear: 2020,
    readiness: { status: "ready_for_llm", pages: ["new:4"] },
    documents: [
      { documentId: "new", title: "Inventointi 2020", sourceUrl: "https://www.kyppi.fi/new.pdf", sourceYear: 2020, passages: [{ page: 4, text: "Kohteen koko PDF-teksti.", matchedBy: ["mjtunnus"], quality: { needsReview: false } }] },
      { documentId: "old", title: "Inventointi 1980", sourceUrl: "https://www.kyppi.fi/old.pdf", sourceYear: 1980 }
    ],
    unmatchedDocuments: [{ documentId: "other", title: "Muu raportti", sourceUrl: "https://www.kyppi.fi/other.pdf", sourceYear: 2019 }],
    failedDocuments: []
  })
  assert.equal(sourceDocuments[0].selected, true)
  assert.match(sourceDocuments[0].selectionReason, /uusin tunnettu tutkimusvuosi 2020/)
  assert.match(sourceDocuments[1].selectionReason, /uusin.*tutkimusvuosi on 2020/)
  assert.match(sourceDocuments[2].selectionReason, /ei löytynyt kohteen nimeä/)

  const html = renderReviewHtml({ sites: [{
    mjtunnus: "123", kohdenimi: "Kohde", kunta: "Kunta", issues: [], notes: [], mounds: [], documents: {}, sourceDocuments,
    kyppiDescription: { text: "Vanha Kyppi-kuvaus", sourceUrl: "https://www.kyppi.fi/site", needsReview: false, warnings: [] }
  }] }, { totalSites: 1, reviewSites: 1, invalidSites: 0 })
  assert.match(html, /Kohteelle löytyneet PDF-aineistot \(3\)/)
  assert.doesNotMatch(html, /<details class="source-documents" open>/)
  assert.match(html, /Inventointi 2020/)
  assert.match(html, />2020</)
  assert.match(html, /https:\/\/www\.kyppi\.fi\/new\.pdf/)
  assert.match(html, /Valintaperuste/)
  assert.match(html, /Kyppi\.fi-kohdesivun kuvausteksti \(vertailuaineisto\)/)
  assert.doesNotMatch(html, /<details class="kyppi-description" open>/)
  assert.match(html, /Vanha Kyppi-kuvaus/)
  assert.match(html, /ei käytetty PDF-pohjaisten mittojen/)
  assert.match(html, /PDF:istä poimittu kohteen koko tekstikonteksti/)
  assert.match(html, /Kohteen koko PDF-teksti\./)
  assert.match(html, /Annettu LLM:lle/)
  assert.doesNotMatch(html, /class="pdf-document-text"><summary><a/)
})

test("tarkistushavainnot ovat omassa nimetyssä osiossaan", () => {
  const html = renderReviewHtml({ sites: [{
    mjtunnus: "123", kohdenimi: "Kohde", kunta: "Kunta", notes: [], mounds: [], documents: {}, sourceDocuments: [], kyppiDescription: null,
    issues: [{ observationId: "a".repeat(64), severity: "warning", code: "model_review", message: "Röykkiö 1 vaatii tarkistuksen", mound: 1 }]
  }] }, { totalSites: 1, reviewSites: 1, invalidSites: 0 })
  assert.match(html, /<section class="review-issues"><h3>Tarkistushavainnot<\/h3>/)
  assert.match(html, /model_review/)
})

test("tarkistusnäkymä näyttää rinnakkaiset päätelmät ja vertailusuodattimet", () => {
  const value = { min: 5, max: 5, approximate: false }
  const comparison = {
    descriptionAvailable: true, descriptionStatus: "accepted", pdfStatus: "review", statusDifference: true,
    descriptionCount: 1, pdfCount: 1, moundCountDifference: false, moundsPairable: true, measurementDifference: true,
    descriptionIssues: [], pdfIssues: [{ code: "model_review" }], descriptionMounds: [], pdfMounds: [],
    pairedMounds: [{ sourceOrder: 1, description: { sourceOrder: 1, lengthM: value, widthM: null, diameterM: null, heightM: null }, pdf: { sourceOrder: 1, lengthM: { ...value, min: 6, max: 6 }, widthM: null, diameterM: null, heightM: null }, differingFields: ["lengthM"], approximationDifferingFields: [] }]
  }
  const html = renderReviewHtml({ sites: [{
    mjtunnus: "123", kohdenimi: "Kohde", kunta: "Kunta", notes: [], issues: [], mounds: [], documents: {}, sourceDocuments: [], kyppiDescription: null, comparison
  }] }, { totalSites: 1, reviewSites: 1, invalidSites: 0 })
  assert.match(html, /Description- ja PDF-päätelmien vertailu/)
  assert.match(html, /Description: hyväksytty/)
  assert.match(html, /PDF: tarkistettava/)
  assert.match(html, /lengthM/)
  assert.match(html, /class="comparison-filter"[^>]+value="count"/)
  assert.match(html, /data-status-difference="true"/)
})
