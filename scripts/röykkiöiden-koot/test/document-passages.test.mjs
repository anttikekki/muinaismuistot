import assert from "node:assert/strict"
import test from "node:test"
import { assessTextQuality, extractSitePassages } from "../lib/document-passages.mjs"
import { classifyReadiness, createCoverageReport, inferDocumentYear } from "../9_extract-document-passages.mjs"

test("extractSitePassages ankkuroi kohdejakson tunnukseen eikä ota sisällysluetteloa", () => {
  const text = [
    "Sisällysluettelo Keskimäki 13",
    "Edeltävä sivu ilman osumaa mutta hyödyllisenä kontekstina.",
    "Keskimäki 531010025. Röykkiön halkaisija on 10 metriä.",
    "Kohteen kuvaus jatkuu tällä sivulla ja korkeus on 0,5 metriä.",
    "Muu kohde."
  ].join("\f")
  const passages = extractSitePassages(text, { mjtunnus: "531010025", kohdenimi: "Keskimäki" })
  assert.deepEqual(passages.map((passage) => passage.page), [3, 4])
  assert.ok(passages.find((passage) => passage.page === 3).matchedBy.includes("mjtunnus"))
  assert.ok(passages.find((passage) => passage.page === 4).matchedBy.includes("konteksti"))
})

test("pelkkä kohdenimiosuma ei tuo mukaan samannimisiä muita kohteita", () => {
  const text = [
    "Sisällysluettelo: Björkboda, Björkbodan ruukki ja Björkboda Bruksgård",
    "Björkbodan ruukki 40010020. Historiallinen teollisuuskohde.",
    "Björkboda 40010022. Kohteessa on kolme röykkiötä.",
    "Kohteen 40010022 kuvaus jatkuu tällä sivulla.",
    "Björkboda Bruksgård 40010023. Kartanoalue."
  ].join("\f")
  const passages = extractSitePassages(text, { mjtunnus: "40010022", kohdenimi: "Björkboda" })
  assert.deepEqual(passages.map((passage) => passage.page), [3, 4])
  assert.ok(passages.every((passage) => !passage.text.includes("ruukki") && !passage.text.includes("Bruksgård")))
})

test("tunnistus hyväksyy Museoviraston välilyönnein ryhmitellyn tunnuksen", () => {
  const passages = extractSitePassages("Rajaniemi 009 01 0003. Röykkiön kuvaus.", { mjtunnus: "9010003", kohdenimi: "Rajaniemi" })
  assert.equal(passages.length, 1)
  assert.deepEqual(passages[0].matchedBy, ["mjtunnus"])
})

test("aineiston vuosi päätellään PDF:n ja siihen liittyvien tietueiden nimistä", () => {
  const records = new Map([
    ["129.1", { titles: ["Kunnan inventointi; 2001"] }],
    ["113.2", { titles: ["Uudempi inventointi 2009"] }]
  ])
  assert.equal(inferDocumentYear({ title: "Inventointiraportti", recordIds: ["129.1", "113.2"] }, records, 2026), 2009)
  assert.equal(inferDocumentYear({ title: "Raportti", recordIds: [] }, records, 2026), null)
})

test("kattavuusraportti luokittelee LLM-valmiin ja PDF:ttömän kohteen", () => {
  const ready = classifyReadiness({
    site: { recordIds: ["129.1"] }, linkedDocuments: [{}], failedDocuments: [], latestSourceYear: 2009,
    documents: [{ sourceYear: 2009, documentId: "doc", passages: [{ page: 2, text: "Keskimäen röykkiön koko on 5 x 6 m.", matchedBy: ["mjtunnus"], quality: { needsReview: false } }] }]
  })
  const missing = classifyReadiness({ site: { recordIds: [] }, linkedDocuments: [], failedDocuments: [], documents: [], latestSourceYear: null })
  assert.equal(ready.status, "ready_for_llm")
  assert.equal(missing.status, "no_pdf_documents")
  const report = createCoverageReport([
    { mjtunnus: "1", kohdenimi: "Valmis", kunta: "A", latestSourceYear: 2009, readiness: ready },
    { mjtunnus: "2", kohdenimi: "Puuttuu", kunta: "B", latestSourceYear: null, readiness: missing }
  ], "2026-08-30T12:00:00Z")
  assert.deepEqual(report.counts, { ready_for_llm: 1, no_pdf_documents: 1, site_not_found: 0, year_missing: 0, ocr_required: 0 })
})

test("assessTextQuality merkitsee tyhjän tai rikkoutuneen sivun tarkistettavaksi", () => {
  assert.equal(assessTextQuality("123 �").needsReview, true)
  assert.equal(assessTextQuality("Tämä on pitkä ja selkeä tekstisivu, jossa on riittävästi tavallisia kirjaimia luotettavaa käsittelyä varten.".repeat(2)).needsReview, false)
})
