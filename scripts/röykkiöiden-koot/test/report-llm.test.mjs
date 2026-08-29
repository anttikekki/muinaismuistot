import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { parseArguments, run, selectSites } from "../10_extract-report-mound-dimensions.mjs"
import { assertReportExtractionResult, buildReportOpenAIRequest, extractReportMoundDimensions, repairReportSourceReferences } from "../lib/report-llm.mjs"

const site = {
  mjtunnus: "123",
  kohdenimi: "Testikohde",
  kunta: "Testikunta",
  documents: [{ documentId: "doc-1", title: "Inventointi", passages: [{ page: 7, text: "Röykkiön halkaisija on 11 m." }] }]
}

test("raporttipyyntö sisältää sivutetut lähteet ja tiukan lähdeviiteskeeman", () => {
  const request = buildReportOpenAIRequest({ site, model: "test-model" })
  const input = JSON.parse(request.input)
  assert.equal(input.documents[0].pages[0].page, 7)
  assert.equal(request.store, false)
  assert.equal(request.text.format.strict, true)
  assert.ok(request.text.format.schema.properties.mounds.items.required.includes("sourceReferences"))
})

test("raporttipyyntö jättää vanhemmat aineistot mallisyötteen ulkopuolelle", () => {
  const datedSite = {
    ...site,
    latestSourceYear: 2009,
    documents: [
      { ...site.documents[0], sourceYear: 2009, isLatestSource: true },
      { ...site.documents[0], documentId: "old", sourceYear: 2001, isLatestSource: false }
    ]
  }
  const input = JSON.parse(buildReportOpenAIRequest({ site: datedSite }).input)
  assert.equal(input.latestSourceYear, 2009)
  assert.deepEqual(input.documents.map((document) => document.documentId), ["doc-1"])
})

test("raporttipyyntö sisältää readiness-raportin valitsemat sivut", () => {
  const readySite = {
    ...site,
    readiness: { status: "ready_for_llm", pages: ["doc-1:7"] },
    documents: [{ ...site.documents[0], passages: [
      { page: 6, text: "Kontekstisivu" },
      { page: 7, text: "Röykkiön halkaisija on 11 m." },
      { page: 8, text: "Toinen kontekstisivu" }
    ] }]
  }
  const input = JSON.parse(buildReportOpenAIRequest({ site: readySite }).input)
  assert.deepEqual(input.documents[0].pages.map((page) => page.page), [7])
})

test("--ready valitsee vain kattavuusraportin LLM-valmiit kohteet", () => {
  const sites = [
    { mjtunnus: "1", readiness: { status: "ready_for_llm" } },
    { mjtunnus: "2", readiness: { status: "site_not_found" } }
  ]
  assert.deepEqual(selectSites(sites, { ready: true }).map((item) => item.mjtunnus), ["1"])
  assert.deepEqual(parseArguments(["--ready"]), { siteIds: [], ready: true })
})

test("raporttituloksen lähdeviitteen täytyy löytyä täsmälleen viitatulta sivulta", async () => {
  const valid = result("Röykkiön halkaisija on 11 m.")
  assert.equal(assertReportExtractionResult(valid, site).mounds[0].diameterM.min, 11)
  assert.throws(() => assertReportExtractionResult(result("Halkaisija on 12 m."), site), /ei löydy viitatulta sivulta/)

  const client = { responses: { create: async () => ({ status: "completed", output_text: JSON.stringify(valid) }) } }
  const extraction = await extractReportMoundDimensions({ client, site })
  assert.equal(extraction.result.mjtunnus, "123")
})

test("lähdevalidointi sallii PDF-taiton välilyöntien normalisoinnin", () => {
  const layoutSite = {
    ...site,
    documents: [{ ...site.documents[0], passages: [{ page: 7, text: "Röykkiön   halkaisija\non 11 m." }] }]
  }
  assert.doesNotThrow(() => assertReportExtractionResult(result("Röykkiön halkaisija on 11 m."), layoutSite))
})

test("lähdevalidointi sallii OCR:n lisäämät sanansisäiset välit", () => {
  const ocrSite = {
    ...site,
    documents: [{ ...site.documents[0], passages: [{ page: 7, text: "Röy kkiön ha lkaisija on 11 m ." }] }]
  }
  assert.doesNotThrow(() => assertReportExtractionResult(result("Röykkiön halkaisija on 11 m."), ocrSite))
  assert.throws(() => assertReportExtractionResult(result("Röykkiön halkaisija on 12 m."), ocrSite), /ei löydy viitatulta sivulta/)
})

test("lähdeviitteen korjaus vaihtaa väärän dokumentin vain yksiselitteiselle osumalle", () => {
  const repairSite = {
    ...site,
    documents: [
      { documentId: "wrong", passages: [{ page: 7, text: "Muu teksti." }] },
      { documentId: "right", passages: [{ page: 8, text: "Röykkiön halkaisija on 11 m." }] }
    ]
  }
  const value = result("Röykkiön halkaisija on 11 m.")
  assert.equal(repairReportSourceReferences(value, repairSite), true)
  assert.deepEqual(value.mounds[0].sourceReferences[0], { documentId: "right", page: 8, evidence: "Röykkiön halkaisija on 11 m." })
  assert.doesNotThrow(() => assertReportExtractionResult(value, repairSite))
})

test("lähdeviitteen korjaus laajentaa mallin lyhentämän katkelman lähteen täsmälliseksi tekstiksi", () => {
  const pageText = "A Kivikko on sammaleinen, mikä tekee röykkiöstä epävarman. Pit. 6 m, lev. 4 m."
  const repairSite = { ...site, documents: [{ documentId: "doc-1", passages: [{ page: 7, text: pageText }] }] }
  const value = result("A ... mikä tekee röykkiöstä epävarman. Pit. 6 m, lev. 4 m.")
  assert.equal(repairReportSourceReferences(value, repairSite), true)
  const exactExcerpt = "mikä tekee röykkiöstä epävarman. Pit. 6 m, lev. 4 m"
  assert.equal(value.mounds[0].evidence[0], exactExcerpt)
  assert.equal(value.mounds[0].sourceReferences[0].evidence, exactExcerpt)
  assert.doesNotThrow(() => assertReportExtractionResult(value, repairSite))
})

test("evidence saa olla viitatun lähdekatkelman sisällöllisesti sama alikatkelma", () => {
  const value = result("Röykkiön halkaisija on 11 m.")
  value.mounds[0].sourceReferences[0].evidence = "Kohdekuvaus: Röykkiön halkaisija on 11 m."
  const extendedSite = { ...site, documents: [{ ...site.documents[0], passages: [{ page: 7, text: "Kohdekuvaus: Röykkiön halkaisija on 11 m." }] }] }
  assert.doesNotThrow(() => assertReportExtractionResult(value, extendedSite))
})

test("validoinnissa hylätty API-vastaus tallennetaan ja käytetään ilman uutta kutsua", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "report-candidate-test-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = {
    documentPassagesFile: path.join(directory, "9.jsonl"),
    reportLlmResponsesDirectory: path.join(directory, "responses"),
    reportMoundDimensionsFile: path.join(directory, "10.jsonl"),
    reportExtractionReportFile: path.join(directory, "10-report.json")
  }
  await fs.writeFile(paths.documentPassagesFile, `${JSON.stringify(site)}\n`)
  let calls = 0
  const invalid = result("Tätä katkelmaa ei ole lähteessä.")
  const client = { responses: { create: async () => { calls += 1; return { status: "completed", output_text: JSON.stringify(invalid) } } } }

  const first = await run({ siteIds: ["123"], paths, client })
  assert.equal(first.report.apiCalls, 1)
  assert.equal(first.report.failures[0].responseSaved, true)
  const second = await run({ siteIds: ["123"], paths, client })
  assert.equal(second.report.apiCalls, 0)
  assert.equal(second.report.reusedResponses, 1)
  assert.equal(calls, 1)
})

function result(evidence) {
  return {
    mjtunnus: "123", statedMoundCount: 1,
    mounds: [{
      sourceOrder: 1, lengthM: null, widthM: null,
      diameterM: { min: 11, max: 11, approximate: false }, heightM: null,
      shape: null, status: null, confidence: "high", needsReview: false,
      evidence: [evidence],
      sourceReferences: [{ documentId: "doc-1", page: 7, evidence }]
    }],
    notes: []
  }
}
