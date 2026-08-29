#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { DATA_PATHS } from "./config.mjs"
import { readJson, writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { extractSitePassages } from "./lib/document-passages.mjs"

export async function run({ siteIds = [], limit, paths = DATA_PATHS, now = () => new Date(), onProgress = () => {} } = {}) {
  const index = await readJson(paths.documentIndexFile)
  const manifest = await readJson(paths.documentDownloadManifestFile)
  const sites = selectSites(index.sites, { siteIds, limit })
  const allDocuments = manifest.documents ?? []
  const successfulDocuments = allDocuments.filter((document) => document.status === "success")
  const recordsById = new Map((index.records ?? []).map((record) => [record.recordId, record]))
  const results = []

  const progressEvery = Math.max(1, Math.ceil(sites.length / 20))
  for (const [siteIndex, site] of sites.entries()) {
    const documents = []
    const linkedDocuments = successfulDocuments.filter((item) => item.siteIds.includes(site.mjtunnus))
    const failedDocuments = allDocuments.filter((item) => item.status !== "success" && item.siteIds?.includes(site.mjtunnus))
    const unmatchedDocuments = []
    for (const document of linkedDocuments) {
      const textFile = path.resolve(path.dirname(paths.documentDownloadManifestFile), document.textFile)
      const passages = extractSitePassages(await fs.readFile(textFile, "utf8"), site)
      const sourceYear = inferDocumentYear(document, recordsById)
      if (passages.length) documents.push({
        documentId: document.documentId,
        title: document.title,
        sourceUrl: document.sourceUrl,
        textFile: document.textFile,
        sourceYear,
        passages
      })
      else unmatchedDocuments.push({ documentId: document.documentId, title: document.title, sourceUrl: document.sourceUrl, sourceYear })
    }
    const knownYears = documents.map((document) => document.sourceYear).filter(Number.isInteger)
    const latestSourceYear = knownYears.length ? Math.max(...knownYears) : null
    for (const document of documents) {
      document.isLatestSource = latestSourceYear === null || document.sourceYear === latestSourceYear
    }
    const warnings = []
    if (!site.kohdenimi) warnings.push("kohteen_nimi_puuttuu")
    if (!documents.length) warnings.push("kohdekatkelmaa_ei_löytynyt")
    if (unmatchedDocuments.length) warnings.push("aineistoja_ilman_kohdeosumaa")
    if (documents.some((document) => document.passages.some((passage) => passage.quality.needsReview))) warnings.push("tekstin_laatu_vaatii_tarkistuksen")
    const readiness = classifyReadiness({ site, linkedDocuments, failedDocuments, documents, latestSourceYear })
    results.push({ schemaVersion: 4, mjtunnus: site.mjtunnus, kohdenimi: site.kohdenimi, kunta: site.kunta, latestSourceYear, documents, unmatchedDocuments, failedDocuments: failedDocuments.map((document) => ({ documentId: document.documentId, title: document.title, sourceUrl: document.sourceUrl, sourceYear: inferDocumentYear(document, recordsById), error: document.error ?? null })), readiness, needsReview: warnings.length > 0, warnings })
    if (siteIndex === 0 || (siteIndex + 1) % progressEvery === 0 || siteIndex + 1 === sites.length) {
      const passageCount = documents.reduce((sum, document) => sum + document.passages.length, 0)
      onProgress(`[9] Kohde ${siteIndex + 1}/${sites.length}: ${site.mjtunnus} – ${documents.length} osuvaa PDF:ää, ${passageCount} sivua (${readiness.status})`)
    }
  }

  await writeFileAtomic(paths.documentPassagesFile, results.map(JSON.stringify).join("\n") + (results.length ? "\n" : ""))
  const report = {
    schemaVersion: 1, generatedAt: now().toISOString(), selectedSites: results.length,
    sitesWithPassages: results.filter((site) => site.documents.length).length,
    sitesNeedingReview: results.filter((site) => site.needsReview).length,
    documentsMatched: results.reduce((sum, site) => sum + site.documents.length, 0),
    documentsWithoutMatch: results.reduce((sum, site) => sum + site.unmatchedDocuments.length, 0),
    pagesExtracted: results.reduce((sum, site) => sum + site.documents.reduce((subtotal, document) => subtotal + document.passages.length, 0), 0)
  }
  await writeJsonAtomic(paths.documentPassagesReportFile, report)
  const coverage = createCoverageReport(results, now().toISOString())
  await writeJsonAtomic(paths.documentCoverageReportFile, coverage)
  return { results, report, coverage }
}

export function classifyReadiness({ site, linkedDocuments, failedDocuments, documents, latestSourceYear }) {
  if (linkedDocuments.length === 0) {
    return {
      status: "no_pdf_documents",
      reasons: failedDocuments.length
        ? [`${failedDocuments.length} PDF-latausta epäonnistui`]
        : [site.recordIds?.length ? "Aineistotietueista ei löytynyt onnistuneesti ladattua PDF:ää" : "Kohteella ei ole aineistotietueita"]
    }
  }
  if (documents.length === 0) return { status: "site_not_found", reasons: ["Kohteen nimeä tai mjtunnusta ei löytynyt PDF-teksteistä"] }
  if (!Number.isInteger(latestSourceYear)) return { status: "year_missing", reasons: ["Yhdenkään kohdeosuman sisältävän aineiston vuotta ei voitu päätellä"] }
  const latestDocuments = documents.filter((document) => document.sourceYear === latestSourceYear)
  const usefulPages = latestDocuments.flatMap((document) => document.passages.filter(isUsefulPassage).map((passage) => `${document.documentId}:${passage.page}`))
  if (!usefulPages.length) {
    const candidatePages = latestDocuments.flatMap((document) => document.passages.filter((passage) => passage.matchedBy.some((reason) => reason !== "konteksti")).map((passage) => `${document.documentId}:${passage.page}`))
    return { status: "ocr_required", reasons: ["Uusimman vuoden aineistosta ei löytynyt hyvälaatuista, röykkiöitä käsittelevää suoraa kohdeosumaa"], pages: candidatePages }
  }
  return { status: "ready_for_llm", reasons: [`Uusin tutkimusvuosi ${latestSourceYear}; ${latestDocuments.length} käyttökelpoista dokumenttia ja ${usefulPages.length} käyttökelpoista kohdesivua`], pages: usefulPages }
}

function isUsefulPassage(passage) {
  return !passage.quality.needsReview &&
    passage.matchedBy.some((reason) => reason !== "konteksti") &&
    /röykki|hauta|kiviraken/iu.test(passage.text)
}

export function createCoverageReport(results, generatedAt) {
  const statuses = ["ready_for_llm", "no_pdf_documents", "site_not_found", "year_missing", "ocr_required"]
  const categories = Object.fromEntries(statuses.map((status) => [status, []]))
  for (const site of results) {
    categories[site.readiness.status].push({ mjtunnus: site.mjtunnus, kohdenimi: site.kohdenimi, kunta: site.kunta, latestSourceYear: site.latestSourceYear, reasons: site.readiness.reasons, ...(site.readiness.pages ? { pages: site.readiness.pages } : {}) })
  }
  return {
    schemaVersion: 1, generatedAt, totalSites: results.length,
    counts: Object.fromEntries(statuses.map((status) => [status, categories[status].length])),
    categories
  }
}

export function inferDocumentYear(document, recordsById, currentYear = new Date().getFullYear()) {
  const values = [document.title, ...(document.recordIds ?? []).flatMap((id) => recordsById.get(id)?.titles ?? [])]
  const years = values.flatMap((value) => [...String(value ?? "").matchAll(/\b(1[5-9]\d{2}|20\d{2})\b/g)].map((match) => Number(match[1]))).filter((year) => year <= currentYear)
  return years.length ? Math.max(...years) : null
}

export function selectSites(sites, { siteIds = [], limit }) {
  if (!Array.isArray(sites)) throw new Error("Dokumentti-indeksistä puuttuu sites-taulukko")
  if (siteIds.length) {
    const byId = new Map(sites.map((site) => [site.mjtunnus, site]))
    return siteIds.map((id) => { const site = byId.get(id); if (!site) throw new Error(`Dokumentti-indeksistä ei löydy kohdetta ${id}`); return site })
  }
  return limit === undefined ? sites : sites.slice(0, limit)
}

export function parseArguments(args) {
  const options = { siteIds: [] }
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--site" || arg === "--limit") {
      const value = args[++i]
      if (!/^\d+$/.test(value ?? "") || Number(value) < 1) throw new Error(`Valinnalla ${arg} on virheellinen arvo`)
      if (arg === "--site") options.siteIds.push(value); else options.limit = Number(value)
    } else throw new Error(`Tuntematon komentorivivalinta: ${arg}`)
  }
  if (options.siteIds.length && options.limit !== undefined) throw new Error("Valintoja --site ja --limit ei voi käyttää yhdessä")
  return options
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) { console.log("Käyttö: node 9_extract-document-passages.mjs [--site MJTUNNUS ... | --limit N]"); return }
  const { report } = await run({ ...options, onProgress: console.log })
  console.log(`Valmis. ${report.sitesWithPassages}/${report.selectedSites} kohteelle löytyi katkelmia, sivuja ${report.pagesExtracted}.`)
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
