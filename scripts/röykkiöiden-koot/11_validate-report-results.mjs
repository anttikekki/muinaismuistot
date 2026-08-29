#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { DATA_PATHS } from "./config.mjs"
import { writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { assertReportExtractionResult } from "./lib/report-llm.mjs"
import { compareSiteResults } from "./lib/result-comparison.mjs"

const MEASUREMENTS = ["lengthM", "widthM", "diameterM", "heightM"]

export async function run({ paths = DATA_PATHS, now = () => new Date() } = {}) {
  const [sites, extractions, kyppiSites, descriptionResults] = await Promise.all([readJsonLines(paths.documentPassagesFile), readJsonLines(paths.reportMoundDimensionsFile), readJsonLinesIfExists(paths.parsedSiteContentFile), readJsonLinesIfExists(paths.validatedResultsFile)])
  const sitesById = new Map(sites.map((site) => [site.mjtunnus, site]))
  const kyppiSitesById = new Map(kyppiSites.map((site) => [site.mjtunnus, site]))
  const descriptionResultsById = new Map(descriptionResults.map((site) => [site.mjtunnus, site]))
  const validated = extractions.map((extraction) => {
    const issues = validateReportExtraction(extraction, sitesById.get(extraction.mjtunnus))
    return { ...extraction, validation: { status: issues.some((issue) => issue.severity === "error") ? "invalid" : issues.length ? "review" : "accepted", issues } }
  })
  const reviewSites = validated.filter((site) => site.validation.status !== "accepted")
  const generatedAt = now().toISOString()
  const review = { schemaVersion: 4, generatedAt, sites: validated.map((site) => createReviewSite(site, sitesById.get(site.mjtunnus), kyppiSitesById.get(site.mjtunnus), descriptionResultsById.get(site.mjtunnus))) }
  const report = {
    schemaVersion: 1, generatedAt, totalSites: validated.length,
    acceptedSites: validated.filter((site) => site.validation.status === "accepted").length,
    reviewSites: validated.filter((site) => site.validation.status === "review").length,
    invalidSites: validated.filter((site) => site.validation.status === "invalid").length,
    totalMounds: validated.reduce((sum, site) => sum + site.mounds.length, 0),
    issueCounts: countIssues(validated)
  }
  await writeFileAtomic(paths.validatedReportResultsFile, validated.map(JSON.stringify).join("\n") + (validated.length ? "\n" : ""))
  await writeJsonAtomic(paths.reportReviewFile, review)
  await writeFileAtomic(paths.reportReviewHtmlFile, renderReviewHtml(review, report))
  await writeJsonAtomic(paths.reportValidationReportFile, report)
  return { validated, reviewSites, report }
}

export function validateReportExtraction(extraction, site, issues = []) {
  if (!site) { add(issues, "source_site_missing", "Kohdetta ei löydy vaiheen 9 aineistosta", true); return issues }
  try { assertReportExtractionResult(extraction, site) } catch (error) { add(issues, "source_validation_failed", error.message, true); return issues }
  const documentsById = new Map(site.documents.map((document) => [document.documentId, document]))
  if (extraction.statedMoundCount !== null && extraction.statedMoundCount !== extraction.mounds.length) add(issues, "mound_count_mismatch", `Ilmoitettu määrä ${extraction.statedMoundCount}, poimittu ${extraction.mounds.length}`)
  for (const mound of extraction.mounds) {
    const label = `Röykkiö ${mound.sourceOrder}`
    if (mound.needsReview || mound.confidence === "low") add(issues, "model_review", `${label} vaatii mallin mukaan tarkistuksen`, false, mound.sourceOrder)
    for (const field of MEASUREMENTS) {
      const value = mound[field]
      if (!value) continue
      const maximum = field === "heightM" ? 20 : 100
      if (value.min <= 0 || value.max <= 0) add(issues, "non_positive_measurement", `${label}: ${field} ei ole positiivinen`, true, mound.sourceOrder)
      if (value.max > maximum) add(issues, "unrealistic_measurement", `${label}: ${field}=${value.max} m vaikuttaa epärealistiselta`, false, mound.sourceOrder)
    }
    const evidence = mound.sourceReferences.map((reference) => reference.evidence).join(" ")
    for (const reference of mound.sourceReferences) {
      const document = documentsById.get(reference.documentId)
      if (Number.isInteger(site.latestSourceYear) && document?.isLatestSource !== true) {
        add(issues, "outdated_source_used", `${label}: mittatieto käyttää vuoden ${document?.sourceYear ?? "tuntematonta"} aineistoa, vaikka uusin tutkimusvuosi on ${site.latestSourceYear}`, true, mound.sourceOrder)
      }
      const passage = document?.passages.find((item) => item.page === reference.page)
      if (passage?.quality?.needsReview) {
        add(issues, "referenced_text_quality", `${label}: viitatun PDF-sivun ${reference.page} tekstin laatu vaatii tarkistuksen`, false, mound.sourceOrder)
      }
    }
    if (mound.heightM === null && mentionsHeight(evidence)) add(issues, "height_omitted", `${label}: lähdekatkelmassa mainitaan korkeus, mutta heightM puuttuu`, false, mound.sourceOrder)
    if (mound.diameterM === null && mentionsDiameter(evidence)) add(issues, "diameter_omitted", `${label}: lähdekatkelmassa mainitaan halkaisija, mutta diameterM puuttuu`, false, mound.sourceOrder)
    if ((mound.lengthM === null || mound.widthM === null) && mentionsDimensions(evidence)) add(issues, "dimensions_omitted", `${label}: lähdekatkelmassa mainitaan AxB-koko, mutta pituus tai leveys puuttuu`, false, mound.sourceOrder)
  }
  return issues
}

function mentionsHeight(text) { return /\b(?:korkeus|korkuinen)\b[^.!?]{0,50}(?:\d|metri|sentti)/iu.test(text) }
function mentionsDiameter(text) { return /\b(?:halkaisija|läpimitta)\b[^.!?]{0,50}(?:\d|metri|sentti)/iu.test(text) }
function mentionsDimensions(text) {
  return /(?:röykkiön\s+koko|röykkiö[^.!?]{0,30}jonka\s+koko|sen\s+koko|se\s+on\s+kooltaan)[^.!?]{0,40}\d+(?:[,.]\d+)?\s*[x×]\s*\d+(?:[,.]\d+)?\s*(?:m|metri)/iu.test(text)
}

function createReviewSite(extraction, source, kyppiSite, descriptionResult) {
  return {
    mjtunnus: extraction.mjtunnus, kohdenimi: source?.kohdenimi ?? null, kunta: source?.kunta ?? null,
    status: extraction.validation.status,
    issues: extraction.validation.issues.map((issue) => ({ ...issue, observationId: observationId(extraction.mjtunnus, issue) })),
    notes: extraction.notes, mounds: extraction.mounds, sourceDocuments: createSourceDocumentSummary(source),
    comparison: compareSiteResults(descriptionResult, extraction),
    kyppiDescription: kyppiSite ? { text: kyppiSite.description ?? null, sourceUrl: kyppiSite.source?.sourceUrl ?? null, fetchedAt: kyppiSite.source?.fetchedAt ?? null, needsReview: kyppiSite.parsing?.needsReview ?? false, warnings: kyppiSite.parsing?.warnings ?? [] } : null,
    documents: Object.fromEntries((source?.documents ?? []).map((document) => [document.documentId, { title: document.title, sourceUrl: document.sourceUrl }]))
  }
}
export function createSourceDocumentSummary(source) {
  if (!source) return []
  const selectedPages = new Set(source.readiness?.pages ?? [])
  const latestYear = source.latestSourceYear
  const matched = (source.documents ?? []).map((document) => {
    const selected = [...selectedPages].some((page) => page.startsWith(`${document.documentId}:`))
    let selectionReason
    if (selected) selectionReason = `Valittu: uusin tunnettu tutkimusvuosi ${latestYear}, ja PDF:stä löytyi käyttökelpoisia kohdesivuja.`
    else if (Number.isInteger(latestYear) && document.sourceYear !== latestYear) selectionReason = `Ei valittu: aineisto on vuodelta ${document.sourceYear ?? "tuntematon"}, mutta uusin kohteelle löytynyt tutkimusvuosi on ${latestYear}.`
    else selectionReason = "Ei valittu: PDF:stä ei löytynyt LLM-poimintaan soveltuvaa hyvälaatuista kohdesivua."
    return {
      documentId: document.documentId, title: document.title, sourceUrl: document.sourceUrl,
      sourceYear: document.sourceYear ?? null, selected, status: "matched", selectionReason,
      pages: (document.passages ?? []).map((passage) => ({
        page: passage.page,
        text: passage.text,
        matchedBy: passage.matchedBy ?? [],
        usedForLlm: selectedPages.has(`${document.documentId}:${passage.page}`),
        needsReview: passage.quality?.needsReview ?? false
      }))
    }
  })
  const unmatched = (source.unmatchedDocuments ?? []).map((document) => ({
    documentId: document.documentId, title: document.title, sourceUrl: document.sourceUrl,
    sourceYear: document.sourceYear ?? null, selected: false, status: "unmatched",
    selectionReason: "Ei valittu: PDF-tekstistä ei löytynyt kohteen nimeä tai muinaisjäännöstunnusta."
  }))
  const failed = (source.failedDocuments ?? []).map((document) => ({
    documentId: document.documentId, title: document.title, sourceUrl: document.sourceUrl,
    sourceYear: document.sourceYear ?? null, selected: false, status: "failed",
    selectionReason: `Ei valittu: PDF:n lataus tai tekstin irrotus epäonnistui${document.error ? ` (${document.error})` : ""}.`
  }))
  return [...matched, ...unmatched, ...failed]
}
function observationId(mjtunnus, issue) { return crypto.createHash("sha256").update(JSON.stringify({ mjtunnus, code: issue.code, message: issue.message, mound: issue.mound ?? null })).digest("hex") }
function add(issues, code, message, error = false, mound = null) { if (!issues.some((item) => item.code === code && item.message === message)) issues.push({ code, severity: error ? "error" : "warning", message, mound }) }
function countIssues(items) { const counts = new Map(); for (const issue of items.flatMap((item) => item.validation.issues)) counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1); return Object.fromEntries([...counts].sort()) }
async function readJsonLines(file) { return (await fs.readFile(file, "utf8")).split(/\r?\n/).filter((line) => line.trim()).map(JSON.parse) }
async function readJsonLinesIfExists(file) { if (!file) return []; try { return await readJsonLines(file) } catch (error) { if (error.code === "ENOENT") return []; throw error } }

export function renderReviewHtml(review, report) {
  const cards = review.sites.map((site) => {
    const issues = site.issues.map((issue) =>
      `<li class="issue ${issue.severity}" data-observation-id="${issue.observationId}" data-mound="${issue.mound ?? ""}" data-severity="${esc(issue.severity)}"><strong>${esc(issue.code)}</strong>: ${esc(issue.message)} <button>Kuittaa</button></li>`
    ).join("")
    const mounds = site.mounds.map((mound) => {
      const sources = mound.sourceReferences.map((ref) => {
        const doc = site.documents[ref.documentId]
        const source = doc?.sourceUrl
          ? `<a href="${esc(doc.sourceUrl)}" target="_blank" rel="noreferrer">${esc(doc.title ?? ref.documentId)}</a>`
          : esc(doc?.title ?? ref.documentId)
        return `<blockquote>${esc(ref.evidence)}<footer>${source}, PDF-sivu ${ref.page}</footer></blockquote>`
      }).join("")
      return `<section class="mound" data-mound="${mound.sourceOrder}"><h3>Röykkiö ${mound.sourceOrder} <span class="status-badge"></span></h3><p class="publication-status"></p><button class="skip-mound">Ohita röykkiö pysyvästi</button><p class="skip-label" hidden><strong>Pysyvästi ohitettu:</strong> ratkaisematon ristiriita</p><p>${esc(formatMeasurements(mound))}</p>${sources}</section>`
    }).join("")
    const sourceDocuments = (site.sourceDocuments ?? []).map((document) => `<tr class="${document.selected ? "selected-document" : ""}"><td>${document.sourceUrl ? `<a href="${esc(document.sourceUrl)}" target="_blank" rel="noreferrer">${esc(document.title ?? document.documentId)}</a>` : esc(document.title ?? document.documentId)}</td><td>${esc(document.sourceYear ?? "Tuntematon")}</td><td>${document.selected ? "Valittu" : "Ei valittu"}</td><td>${esc(document.selectionReason)}</td></tr>`).join("")
    const documentsSection = `<details class="source-documents"><summary>Kohteelle löytyneet PDF-aineistot (${site.sourceDocuments?.length ?? 0})</summary>${sourceDocuments ? `<div class="table-wrap"><table><thead><tr><th>PDF</th><th>Vuosi</th><th>Käyttö</th><th>Valintaperuste</th></tr></thead><tbody>${sourceDocuments}</tbody></table></div>` : "<p>PDF-aineistoja ei löytynyt.</p>"}</details>`
    const pdfTexts = (site.sourceDocuments ?? []).filter((document) => document.pages?.length).map((document) => {
      const pages = document.pages.map((page) => `<section class="pdf-page ${page.usedForLlm ? "llm-page" : "context-page"}"><h4>PDF-sivu ${page.page} <span>${page.usedForLlm ? "Annettu LLM:lle" : "Tarkistuskonteksti"}</span>${page.needsReview ? " <span>Tekstin laatu vaatii tarkistuksen</span>" : ""}</h4><div class="pdf-page-text">${esc(page.text)}</div></section>`).join("")
      const title = esc(document.title ?? document.documentId)
      return `<details class="pdf-document-text"><summary>${title} · ${esc(document.sourceYear ?? "vuosi tuntematon")} · ${document.pages.length} sivua</summary>${pages}</details>`
    }).join("")
    const pdfTextSection = `<details class="pdf-texts"><summary>PDF:istä poimittu kohteen koko tekstikonteksti</summary><p class="source-role">Mukana ovat kaikki vaiheessa 9 kohteelle poimitut sivut. Vihreällä merkityt sivut annettiin LLM:lle; muut ovat manuaalista tarkistusta tukevaa ympäröivää kontekstia.</p>${pdfTexts || "<p>Kohteeseen osunutta PDF-tekstiä ei löytynyt.</p>"}</details>`
    const kyppiDescription = site.kyppiDescription?.text ? `<details class="kyppi-description"><summary>Kyppi.fi-kohdesivun kuvausteksti (vertailuaineisto)</summary><p class="source-role">Tätä tekstiä ei käytetty PDF-pohjaisten mittojen varsinaisena lähteenä.</p><div class="description-text">${esc(site.kyppiDescription.text)}</div>${site.kyppiDescription.sourceUrl ? `<p><a href="${esc(site.kyppiDescription.sourceUrl)}" target="_blank" rel="noreferrer">Avaa kohdesivu Kyppi.fi:ssä</a></p>` : ""}${site.kyppiDescription.needsReview ? `<p class="notice">Kuvaustekstin poiminta vaatii tarkistuksen: ${esc(site.kyppiDescription.warnings.join(", "))}</p>` : ""}</details>` : `<p class="notice">Kyppi.fi-kohdesivun kuvaustekstiä ei löytynyt.</p>`
    const issuesSection = issues ? `<section class="review-issues"><h3>Tarkistushavainnot</h3><ul>${issues}</ul></section>` : ""
    const comparisonSection = renderComparison(site.comparison)
    const comparison = site.comparison ?? {}
    return `<article id="site-${esc(site.mjtunnus)}" class="site" data-mjtunnus="${esc(site.mjtunnus)}" data-count-difference="${Boolean(comparison.moundCountDifference)}" data-measurement-difference="${Boolean(comparison.measurementDifference)}" data-approximation-difference="${Boolean(comparison.approximationDifference)}" data-status-difference="${Boolean(comparison.statusDifference)}"><h2>${esc(site.kohdenimi ?? site.mjtunnus)}</h2><p>${esc(site.kunta ?? "")} · ${esc(site.mjtunnus)}</p>${comparisonSection}${kyppiDescription}${documentsSection}${pdfTextSection}${issuesSection}${site.notes.length ? `<p><strong>Huomiot:</strong> ${site.notes.map(esc).join(" ")}</p>` : ""}${mounds}</article>`
  }).join("")
  return `<!doctype html><html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Raporttitulosten tarkistus</title><style>
body{font-family:system-ui;max-width:1100px;margin:auto;padding:24px;background:#f4f1ea;color:#25231f}.summary,.filters,.site{background:white;border:1px solid #d8d2c5;border-radius:10px;padding:18px;margin:18px 0}.summary{display:flex;gap:24px;flex-wrap:wrap}.filters label{margin-right:18px}.comparison-filters{margin-top:14px;padding-top:12px;border-top:1px solid #ddd}.notice{background:#fff2cf;border-left:5px solid #d58b00;padding:10px}.review-issues{margin:18px 0;padding:14px;border:2px solid #d6a640;border-radius:8px;background:#fffaf0}.review-issues h3{margin:0 0 8px}.review-issues ul{margin:0;padding-left:24px}.issue{background:#fff2cf;margin:6px 0;padding:8px}.issue.error{background:#ffe2df}.issue.ack{opacity:.55}.mound.skipped{background:#eee;border-color:#777}.skip-label{background:#ddd;padding:8px}blockquote{background:#faf8f3;border-left:4px solid #8b8171;padding:10px}footer{margin-top:6px;color:#625d53}button{cursor:pointer}.mound{border-top:1px solid #ddd;padding:12px}.status-badge,.pdf-page h4 span,.comparison-badge{font-size:.72em;padding:3px 7px;border-radius:12px;background:#e7e3da}.comparison-badge.difference{background:#fff2cf}.publication-status{font-weight:600}.comparison-panel{border:1px solid #b9c7d8;border-radius:8px;background:#f6f9fc;padding:14px;margin:14px 0}.comparison-panel h3{margin-top:0}.comparison-summary{display:flex;gap:8px;flex-wrap:wrap}.comparison-table{border-collapse:collapse;width:100%;margin-top:10px}.comparison-table th,.comparison-table td{border:1px solid #ccd5df;padding:7px;text-align:left;vertical-align:top}.comparison-table .different{background:#fff2cf}.comparison-columns{display:grid;grid-template-columns:1fr 1fr;gap:12px}.source-documents,.kyppi-description,.pdf-texts,.pdf-document-text{margin:14px 0}.source-documents summary,.kyppi-description summary,.pdf-texts summary,.pdf-document-text summary{cursor:pointer;font-weight:700}.source-role{color:#625d53;font-style:italic}.description-text,.pdf-page-text{white-space:pre-wrap;background:#faf8f3;border-left:4px solid #8b8171;padding:12px}.pdf-page{margin:12px 0}.pdf-page h4{margin-bottom:6px}.pdf-page.llm-page .pdf-page-text{background:#edf7ed;border-left-color:#398247}.table-wrap{overflow-x:auto;margin-top:10px}.source-documents table{border-collapse:collapse;width:100%;font-size:.92rem}.source-documents th,.source-documents td{text-align:left;vertical-align:top;border:1px solid #ddd;padding:8px}.source-documents th{background:#eee}.source-documents .selected-document{background:#e8f4e8}@media(max-width:700px){.comparison-columns{grid-template-columns:1fr}}
</style></head><body><h1>Raporttipohjaisten röykkiötietojen auditointi</h1><div id="server-notice"></div><div class="summary"><span><strong id="automatic-count">0</strong> automaattisesti hyväksytty</span><span><strong id="human-count">0</strong> käsin hyväksytty</span><span><strong id="pending-count">0</strong> odottaa tarkistusta</span><span><strong id="skipped-count">0</strong> pysyvästi ohitettu</span><span><strong id="invalid-count">0</strong> virheellinen</span></div><div class="filters"><strong>Näytettävät röykkiöiden tilat:</strong><br><label><input class="status-filter" type="checkbox" value="automatic" checked> Automaattisesti hyväksytty</label><label><input class="status-filter" type="checkbox" value="human_reviewed" checked> Käsin hyväksytty</label><label><input class="status-filter" type="checkbox" value="pending" checked> Odottaa tarkistusta</label><label><input class="status-filter" type="checkbox" value="skipped" checked> Pysyvästi ohitettu</label><label><input class="status-filter" type="checkbox" value="invalid" checked> Virheellinen</label><div class="comparison-filters"><strong>Näytä vain kohteet, joissa:</strong><br><label><input class="comparison-filter" type="checkbox" value="count"> Röykkiömäärä eroaa</label><label><input class="comparison-filter" type="checkbox" value="measurement"> Mitta-arvot eroavat</label><label><input class="comparison-filter" type="checkbox" value="approximation"> Arvioituusmerkintä eroaa</label><label><input class="comparison-filter" type="checkbox" value="status"> Tarkistustila eroaa</label></div></div>${cards || "<p>Ei käsiteltyjä kohteita.</p>"}<script>
const ack=new Set(),skipped=new Set();
const moundKey=(site,mound)=>site.dataset.mjtunnus+':'+mound;
async function load(){try{const r=await fetch('/api/acknowledgements');if(!r.ok)throw new Error();const x=await r.json();Object.keys(x.acknowledgements||{}).forEach(id=>ack.add(id));Object.entries(x.moundDecisions||{}).filter(([,d])=>d.status==='permanently_skipped').forEach(([id])=>skipped.add(id))}catch{document.querySelector('#server-notice').innerHTML='<p class="notice">Tämä on staattinen esikatselu. Käynnistä <code>npm run review:reports</code>, jotta muutokset tallentuvat.</p>';document.querySelectorAll('button').forEach(button=>button.disabled=true)}draw()}
const relevantIssues=mound=>[...mound.closest('.site').querySelectorAll('.issue')].filter(issue=>!issue.dataset.mound||issue.dataset.mound===mound.dataset.mound);
function moundStatus(mound){if(skipped.has(moundKey(mound.closest('.site'),mound.dataset.mound)))return'skipped';const issues=relevantIssues(mound);if(issues.some(issue=>issue.dataset.severity==='error'))return'invalid';if(issues.some(issue=>!ack.has(issue.dataset.observationId)))return'pending';return issues.length?'human_reviewed':'automatic'}
const statusLabel={automatic:'Automaattisesti hyväksytty',human_reviewed:'Käsin hyväksytty',pending:'Odottaa tarkistusta',skipped:'Pysyvästi ohitettu',invalid:'Virheellinen'};
function draw(){document.querySelectorAll('.issue').forEach(issue=>{const yes=ack.has(issue.dataset.observationId);issue.classList.toggle('ack',yes);issue.querySelector('button').textContent=yes?'Palauta':'Kuittaa'});const counts={automatic:0,human_reviewed:0,pending:0,skipped:0,invalid:0};document.querySelectorAll('.mound').forEach(mound=>{const status=moundStatus(mound),yes=status==='skipped';counts[status]++;mound.dataset.status=status;mound.classList.toggle('skipped',yes);mound.querySelector('.status-badge').textContent=statusLabel[status];mound.querySelector('.publication-status').textContent=(status==='automatic'||status==='human_reviewed')?'Mukana lopullisessa aineistossa.':'Ei mukana lopullisessa aineistossa: '+statusLabel[status].toLocaleLowerCase('fi')+'.';mound.querySelector('.skip-mound').textContent=yes?'Palauta röykkiö tarkistettavaksi':'Ohita röykkiö pysyvästi';mound.querySelector('.skip-label').hidden=!yes});document.querySelector('#automatic-count').textContent=counts.automatic;document.querySelector('#human-count').textContent=counts.human_reviewed;document.querySelector('#pending-count').textContent=counts.pending;document.querySelector('#skipped-count').textContent=counts.skipped;document.querySelector('#invalid-count').textContent=counts.invalid;const selected=new Set([...document.querySelectorAll('.status-filter:checked')].map(input=>input.value));const comparisonFilters=[...document.querySelectorAll('.comparison-filter:checked')].map(input=>input.value);document.querySelectorAll('.site').forEach(site=>{const statusMatches=[...site.querySelectorAll('.mound')].some(mound=>selected.has(mound.dataset.status));const comparisonMatches=!comparisonFilters.length||comparisonFilters.some(filter=>site.dataset[filter+'Difference']==='true');site.hidden=!(statusMatches&&comparisonMatches)})}
document.querySelectorAll('.status-filter,.comparison-filter').forEach(input=>input.addEventListener('change',draw));document.querySelectorAll('.issue button').forEach(button=>button.onclick=async()=>{const issue=button.closest('.issue'),id=issue.dataset.observationId,yes=ack.has(id),r=await fetch('/api/acknowledgements/'+id,{method:yes?'DELETE':'POST'});if(r.ok){yes?ack.delete(id):ack.add(id);draw()}});document.querySelectorAll('.skip-mound').forEach(button=>button.onclick=async()=>{const mound=button.closest('.mound'),site=mound.closest('.site'),order=mound.dataset.mound,key=moundKey(site,order),yes=skipped.has(key),r=await fetch('/api/mound-decisions/'+site.dataset.mjtunnus+'/'+order,{method:yes?'DELETE':'POST'});if(r.ok){yes?skipped.delete(key):skipped.add(key);draw()}});load();
</script></body></html>`
}
function formatMeasurements(mound, showApproximate = false) { return MEASUREMENTS.filter((field) => mound[field]).map((field) => `${field}: ${showApproximate && mound[field].approximate ? "noin " : ""}${mound[field].min}${mound[field].max !== mound[field].min ? `–${mound[field].max}` : ""} m`).join(" · ") || "Ei mittoja" }
function renderComparison(comparison) {
  if (!comparison?.descriptionAvailable) return `<section class="comparison-panel"><h3>Description- ja PDF-päätelmien vertailu</h3><p>Description-pohjaista validoitua tulosta ei löytynyt.</p></section>`
  const badge = (text, difference) => `<span class="comparison-badge ${difference ? "difference" : ""}">${esc(text)}</span>`
  let details
  if (!comparison.moundsPairable) {
    const list = (mounds) => mounds.length ? `<ol>${mounds.map((mound) => `<li>${esc(formatMeasurements(mound))}</li>`).join("")}</ol>` : "<p>Ei röykkiöitä.</p>"
    const reason = comparison.moundCountDifference ? "Röykkiömäärät eroavat" : "Poimittujen röykkiöiden lukumäärä ei vastaa ilmoitettua määrää"
    details = `<p class="notice">${reason}, joten yksittäisiä röykkiöitä ei ole paritettu automaattisesti.</p><div class="comparison-columns"><div><h4>Description-päätelmä</h4>${list(comparison.descriptionMounds)}</div><div><h4>PDF-päätelmä</h4>${list(comparison.pdfMounds)}</div></div>`
  } else {
    const rows = comparison.pairedMounds.map((pair) => `<tr><td>Röykkiö ${pair.sourceOrder}</td><td>${esc(formatMeasurements(pair.description, true))}</td><td>${esc(formatMeasurements(pair.pdf, true))}</td><td class="${pair.differingFields.length ? "different" : ""}">${pair.differingFields.length ? esc(pair.differingFields.join(", ")) : "Ei eroja"}</td><td class="${pair.approximationDifferingFields.length ? "different" : ""}">${pair.approximationDifferingFields.length ? esc(pair.approximationDifferingFields.join(", ")) : "Ei eroja"}</td></tr>`).join("")
    details = `<div class="table-wrap"><table class="comparison-table"><thead><tr><th></th><th>Description</th><th>PDF</th><th>Eroavat mitta-arvot</th><th>Eroava arvioituusmerkintä</th></tr></thead><tbody>${rows}</tbody></table></div>`
  }
  const issues = (label, values) => values.length ? `<p><strong>${esc(label)}:</strong> ${values.map((issue) => esc(issue.code)).join(", ")}</p>` : ""
  return `<section class="comparison-panel"><h3>Description- ja PDF-päätelmien vertailu</h3><div class="comparison-summary">${badge(`Description: ${statusLabelFi(comparison.descriptionStatus)}`, false)}${badge(`PDF: ${statusLabelFi(comparison.pdfStatus)}`, comparison.statusDifference)}${badge(`Röykkiömäärä ${comparison.descriptionCount} / ${comparison.pdfCount}`, comparison.moundCountDifference)}${badge(comparison.measurementDifference ? "Mitta-arvoissa eroja" : comparison.measurementDifference === false ? "Mitta-arvot yhtenevät" : "Mittoja ei paritettu", comparison.measurementDifference === true)}${comparison.approximationDifference ? badge("Arvioituusmerkinnöissä eroja", true) : ""}</div>${issues("Description-tarkistushavainnot", comparison.descriptionIssues)}${issues("PDF-tarkistushavainnot", comparison.pdfIssues)}${details}</section>`
}
function statusLabelFi(status) { return ({ accepted: "hyväksytty", review: "tarkistettava", invalid: "virheellinen" })[status] ?? "ei tulosta" }
function esc(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]) }

async function main() {
  const { report } = await run()
  console.log(`Valmis. Hyväksytty ${report.acceptedSites}, tarkistettavia ${report.reviewSites}, virheellisiä ${report.invalidSites}.`)
  console.log(`Staattinen esikatselu: ${DATA_PATHS.reportReviewHtmlFile}`)
  console.log("Tallentava tarkistusnäkymä: npm run review:reports")
  console.log("Avaa palvelimen käynnistyttyä http://127.0.0.1:4173")
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
