#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { pathToFileURL } from "node:url"

import { DATA_PATHS, DOCUMENT_CONFIG } from "./config.mjs"
import { ensureDirectory, fileExists, readJson, readJsonIfExists, sha256File, writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { createRequestRateLimiter } from "./lib/kyppi-download.mjs"
import { parseDocumentRecordPage } from "./lib/document-parser.mjs"

const execFileAsync = promisify(execFile)

export async function run({
  siteIds = [], limit, all = false, force = false,
  paths = DATA_PATHS, config = DOCUMENT_CONFIG, fetchImpl = globalThis.fetch,
  now = () => new Date(), sleep, extractPdfText = defaultExtractPdfText,
  onProgress = () => {}
} = {}) {
  validateSelection({ siteIds, limit, all })
  const index = await readJson(paths.documentIndexFile)
  const selectedRecords = selectRecords(index, { siteIds, limit, all })
  const previous = await readJsonIfExists(paths.documentDownloadManifestFile)
  const recordEntries = new Map((previous?.records ?? []).map((entry) => [entry.recordId, entry]))
  const documentEntries = new Map((previous?.documents ?? []).map((entry) => [entry.documentId, entry]))
  const waitForRequest = createRequestRateLimiter({ delayMs: config.requestDelayMs, ...(sleep ? { sleep } : {}) })
  const summary = { selectedRecords: selectedRecords.length, recordPagesDownloaded: 0, documentsDownloaded: 0, documentsSkipped: 0, failed: 0 }

  await Promise.all([ensureDirectory(paths.documentRecordPagesDirectory), ensureDirectory(paths.documentsDirectory), ensureDirectory(paths.documentTextsDirectory)])

  const progressEvery = Math.max(1, Math.ceil(selectedRecords.length / 20))
  for (const [recordIndex, record] of selectedRecords.entries()) {
    if (recordIndex === 0 || (recordIndex + 1) % progressEvery === 0 || recordIndex + 1 === selectedRecords.length) {
      onProgress(`[8] Aineistotietue ${recordIndex + 1}/${selectedRecords.length}: ${record.recordId}`)
    }
    const recordFile = path.join(paths.documentRecordPagesDirectory, `${safeName(record.recordId)}.html`)
    let html
    let recordFinalUrl = record.url
    try {
      const cached = recordEntries.get(record.recordId)
      if (!force && cached?.status === "success" && await validCachedFile(cached, recordFile)) {
        html = await fs.readFile(recordFile, "utf8")
        recordFinalUrl = cached.finalUrl
      } else {
        const response = await download(record.url, "text/html,application/xhtml+xml", { config, fetchImpl, waitForRequest })
        if (!/html/i.test(response.contentType)) throw new Error(`Aineistotietue ei ole HTML: ${response.contentType}`)
        await writeFileAtomic(recordFile, response.contents)
        html = new TextDecoder().decode(response.contents)
        recordFinalUrl = response.finalUrl
        recordEntries.set(record.recordId, sourceEntry(record.recordId, record.url, recordFile, paths.documentDownloadManifestFile, response, now))
        summary.recordPagesDownloaded += 1
      }

      const attachments = parseDocumentRecordPage(html, recordFinalUrl)
      const currentDocumentIds = new Set(attachments.map((attachment) => attachment.documentId))
      for (const [documentId, document] of documentEntries) {
        if (!document.recordIds?.includes(record.recordId) || currentDocumentIds.has(documentId)) continue
        const recordIds = document.recordIds.filter((id) => id !== record.recordId)
        if (recordIds.length === 0) documentEntries.delete(documentId)
        else documentEntries.set(documentId, { ...document, recordIds })
      }

      for (const attachment of attachments) {
        let existing = documentEntries.get(attachment.documentId)
        const recordIds = unique([...(existing?.recordIds ?? []), record.recordId])
        const siteIdsForDocument = unique([...(existing?.siteIds ?? []), ...record.siteIds])
        const documentTitle = preferredDocumentTitle(attachment.title, record.titles)
        const pdfFile = await availableDocumentFile({
          directory: paths.documentsDirectory,
          title: documentTitle,
          documentId: attachment.documentId,
          entries: documentEntries,
          manifestFile: paths.documentDownloadManifestFile,
          existing
        })
        const textFile = path.join(paths.documentTextsDirectory, `${attachment.documentId}.txt`)
        const cachedPdfFile = existing?.file
          ? path.resolve(path.dirname(paths.documentDownloadManifestFile), existing.file)
          : path.join(paths.documentsDirectory, `${attachment.documentId}.pdf`)
        if (existing?.status === "success" && await validCachedFile(existing, cachedPdfFile) && cachedPdfFile !== pdfFile) {
          await fs.rename(cachedPdfFile, pdfFile)
          existing = { ...existing, title: documentTitle, file: path.relative(path.dirname(paths.documentDownloadManifestFile), pdfFile) }
          documentEntries.set(attachment.documentId, existing)
        }
        if (!force && existing?.status === "success" && await validCachedFile(existing, pdfFile) && await fileExists(textFile)) {
          documentEntries.set(attachment.documentId, { ...existing, title: documentTitle, recordIds, siteIds: siteIdsForDocument })
          summary.documentsSkipped += 1
          continue
        }
        try {
          onProgress(`[8] Ladataan PDF: ${documentTitle}`)
          const response = await download(attachment.url, "application/pdf", { config, fetchImpl, waitForRequest })
          validatePdf(response.contents, response.contentType, config.maxPdfBytes)
          await writeFileAtomic(pdfFile, response.contents)
          onProgress(`[8] Poimitaan PDF:n teksti: ${documentTitle}`)
          await extractPdfText(pdfFile, textFile)
          documentEntries.set(attachment.documentId, {
            ...sourceEntry(attachment.documentId, attachment.url, pdfFile, paths.documentDownloadManifestFile, response, now),
            documentId: attachment.documentId, title: documentTitle, recordIds, siteIds: siteIdsForDocument,
            textFile: path.relative(path.dirname(paths.documentDownloadManifestFile), textFile)
          })
          summary.documentsDownloaded += 1
        } catch (error) {
          documentEntries.set(attachment.documentId, { documentId: attachment.documentId, status: "failed", sourceUrl: attachment.url, title: documentTitle, recordIds, siteIds: siteIdsForDocument, failedAt: now().toISOString(), error: error.message })
          summary.failed += 1
        }
      }
    } catch (error) {
      recordEntries.set(record.recordId, { recordId: record.recordId, status: "failed", sourceUrl: record.url, siteIds: record.siteIds, failedAt: now().toISOString(), error: error.message })
      summary.failed += 1
    }
    await persist()
  }
  await persist(now().toISOString())
  return readJson(paths.documentDownloadManifestFile)

  async function persist(finishedAt = null) {
    await writeJsonAtomic(paths.documentDownloadManifestFile, {
      schemaVersion: 1, generatedAt: now().toISOString(), finishedAt,
      selection: { siteIds, limit: limit ?? null, all, force }, summary,
      records: [...recordEntries.values()], documents: [...documentEntries.values()]
    })
  }
}

export function selectRecords(index, { siteIds = [], limit, all = false }) {
  if (!Array.isArray(index?.records)) throw new Error("Dokumentti-indeksistä puuttuu records-taulukko")
  if (siteIds.length) {
    const wanted = new Set(siteIds)
    return index.records.filter((record) => record.siteIds.some((id) => wanted.has(id)))
  }
  if (limit !== undefined) return index.records.slice(0, limit)
  return all ? index.records : []
}

async function download(url, accept, { config, fetchImpl, waitForRequest }) {
  await waitForRequest()
  const response = await fetchImpl(url, { headers: { Accept: accept, "User-Agent": config.userAgent }, redirect: "follow", signal: AbortSignal.timeout(config.requestTimeoutMs) })
  if (!response.ok) throw new Error(`Kyppi palautti HTTP-tilan ${response.status}`)
  const contents = Buffer.from(await response.arrayBuffer())
  return { contents, finalUrl: response.url || url, httpStatus: response.status, contentType: response.headers.get("content-type") ?? "", sha256: crypto.createHash("sha256").update(contents).digest("hex") }
}

export function validatePdf(contents, contentType, maxBytes) {
  if (contents.byteLength > maxBytes) throw new Error(`PDF ylittää enimmäiskoon ${maxBytes} tavua`)
  if (!contents.subarray(0, 5).equals(Buffer.from("%PDF-"))) throw new Error(`Liite ei ole PDF (${contentType || "sisältötyyppi puuttuu"})`)
}

async function validCachedFile(entry, file) { return await fileExists(file) && await sha256File(file) === entry.sha256 }
function safeName(value) { return value.replace(/[^a-zA-Z0-9._-]/g, "_") }
export function documentFileName(title) {
  const base = String(title ?? "raportti")
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, 180)
  return `${base || "raportti"}.pdf`
}
function preferredDocumentTitle(attachmentTitle, recordTitles = []) {
  const generic = /^(?:inventointi)?raportti$/iu.test(String(attachmentTitle ?? "").trim())
  return generic && recordTitles.find((title) => title?.trim())
    ? recordTitles.find((title) => title?.trim()).trim()
    : String(attachmentTitle ?? recordTitles[0] ?? "raportti").trim()
}
async function availableDocumentFile({ directory, title, documentId, entries, manifestFile, existing }) {
  const preferred = path.join(directory, documentFileName(title))
  const existingPath = existing?.file ? path.resolve(path.dirname(manifestFile), existing.file) : null
  if (existingPath === preferred) return preferred
  const usedByAnotherDocument = [...entries.entries()].some(([id, entry]) =>
    id !== documentId && entry.file && path.resolve(path.dirname(manifestFile), entry.file) === preferred
  )
  if (!usedByAnotherDocument && !await fileExists(preferred)) return preferred
  return path.join(directory, documentFileName(`${title} -- ${documentId.slice(0, 8)}`))
}
function unique(values) { return [...new Set(values)] }
function sourceEntry(id, sourceUrl, file, manifestFile, response, now) {
  return { recordId: id, status: "success", sourceUrl, finalUrl: response.finalUrl, httpStatus: response.httpStatus, fetchedAt: now().toISOString(), file: path.relative(path.dirname(manifestFile), file), contentType: response.contentType, byteLength: response.contents.byteLength, sha256: response.sha256 }
}
async function defaultExtractPdfText(pdfFile, textFile) { await execFileAsync("pdftotext", ["-layout", "-enc", "UTF-8", pdfFile, textFile]) }

export function parseArguments(args) {
  const options = { siteIds: [] }
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--all" || arg === "--force") options[arg.slice(2)] = true
    else if (arg === "--site" || arg === "--limit") {
      const value = args[++i]
      if (!/^\d+$/.test(value ?? "") || Number(value) < 1) throw new Error(`Valinnalla ${arg} on virheellinen arvo`)
      if (arg === "--site") options.siteIds.push(value); else options.limit = Number(value)
    } else throw new Error(`Tuntematon komentorivivalinta: ${arg}`)
  }
  return options
}
function validateSelection({ siteIds, limit, all }) {
  if (Number(siteIds.length > 0) + Number(limit !== undefined) + Number(all) !== 1) throw new Error("Anna täsmälleen yksi valinnoista --site, --limit tai --all")
}
async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) { console.log("Käyttö: node 8_download-source-documents.mjs (--site MJTUNNUS ... | --limit N | --all) [--force]"); return }
  const manifest = await run({ ...options, onProgress: console.log })
  console.log(`Valmis. PDF:iä ladattiin ${manifest.summary.documentsDownloaded}, välimuistista ${manifest.summary.documentsSkipped}, virheitä ${manifest.summary.failed}.`)
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
