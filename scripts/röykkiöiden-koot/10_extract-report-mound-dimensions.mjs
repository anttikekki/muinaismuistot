#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { DATA_PATHS, OPENAI_CONFIG } from "./config.mjs"
import { ensureDirectory, readJsonIfExists, writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { createOpenAIClient } from "./lib/llm.mjs"
import { REPORT_EXTRACTION_PROMPT_VERSION, REPORT_EXTRACTION_SCHEMA_VERSION, assertReportExtractionResult, buildReportExtractionCacheKey, extractReportMoundDimensions, repairReportSourceReferences } from "./lib/report-llm.mjs"

export async function run({ siteIds = [], limit, all = false, ready = false, force = false, model = OPENAI_CONFIG.model, paths = DATA_PATHS, client, now = () => new Date(), onProgress = () => {} } = {}) {
  validateOptions({ siteIds, limit, all, ready, model })
  const sites = await readJsonLines(paths.documentPassagesFile)
  const selected = selectSites(sites, { siteIds, limit, all, ready }).filter((site) => site.documents.length > 0)
  const completed = []
  const failures = []
  let reusedResponses = 0
  let openAIClient = client
  await ensureDirectory(paths.reportLlmResponsesDirectory)

  for (const [siteIndex, site] of selected.entries()) {
    const progress = `[10] Kohde ${siteIndex + 1}/${selected.length}: ${site.mjtunnus}`
    const files = cachePaths(paths.reportLlmResponsesDirectory, site, model)
    const cached = force ? undefined : await readValidCache(files.success, site, model)
    if (cached) {
      await fs.rm(files.error, { force: true })
      completed.push({ record: cached, cached: true })
      onProgress(`${progress} – välimuistista`)
      continue
    }
    let candidate = force ? undefined : await readCandidate(files.candidate, site, model)
    let apiCalled = false
    try {
      if (!candidate) {
        if (!openAIClient) openAIClient = createOpenAIClient()
        apiCalled = true
        onProgress(`${progress} – API-kutsu käynnissä`)
        const extraction = await extractReportMoundDimensions({ client: openAIClient, site, model })
        candidate = { cacheFormatVersion: 1, cacheKey: files.key, createdAt: now().toISOString(), request: requestMetadata(site, model), result: extraction.result }
        await writeJsonAtomic(files.candidate, candidate)
      } else {
        reusedResponses += 1
        onProgress(`${progress} – validoidaan tallennettu vastaus`)
      }
      if (repairReportSourceReferences(candidate.result, site)) await writeJsonAtomic(files.candidate, candidate)
      assertReportExtractionResult(candidate.result, site)
      const record = candidate
      await writeJsonAtomic(files.success, record)
      await fs.rm(files.error, { force: true })
      completed.push({ record, cached: false, apiCalled })
      onProgress(`${progress} – valmis`)
    } catch (error) {
      const failure = { cacheFormatVersion: 1, cacheKey: files.key, failedAt: now().toISOString(), responseSaved: Boolean(candidate), request: requestMetadata(site, model), error: { name: error.name, message: error.message, status: error.status ?? null, requestId: error.request_id ?? null } }
      await writeJsonAtomic(files.error, failure)
      failures.push({ mjtunnus: site.mjtunnus, apiCalled, responseSaved: failure.responseSaved, ...failure.error })
      onProgress(`${progress} – virhe: ${error.message}`)
    }
  }

  const output = []
  for (const site of sites) {
    const cached = await readValidCache(cachePaths(paths.reportLlmResponsesDirectory, site, model).success, site, model)
    if (cached) output.push({ ...cached.result, extraction: { source: "research-reports", createdAt: cached.createdAt, model, promptVersion: REPORT_EXTRACTION_PROMPT_VERSION, resultSchemaVersion: REPORT_EXTRACTION_SCHEMA_VERSION } })
  }
  await writeFileAtomic(paths.reportMoundDimensionsFile, output.map(JSON.stringify).join("\n") + (output.length ? "\n" : ""))
  const apiCalls = completed.filter((item) => item.apiCalled).length + failures.filter((failure) => failure.apiCalled).length
  const report = { schemaVersion: 1, generatedAt: now().toISOString(), selection: { siteIds, limit: limit ?? null, all, ready, force }, model, promptVersion: REPORT_EXTRACTION_PROMPT_VERSION, outputSchemaVersion: REPORT_EXTRACTION_SCHEMA_VERSION, selectedSites: selected.length, apiCalls, reusedResponses, cacheHits: completed.filter((item) => item.cached).length, successfulSites: completed.length, failedSites: failures.length, outputSites: output.length, failures }
  await writeJsonAtomic(paths.reportExtractionReportFile, report)
  return { output, report }
}

export function selectSites(sites, { siteIds = [], limit, all = false, ready = false }) {
  if (siteIds.length) { const byId = new Map(sites.map((site) => [site.mjtunnus, site])); return siteIds.map((id) => { const site = byId.get(id); if (!site) throw new Error(`Vaiheen 9 tuloksesta ei löydy kohdetta ${id}`); return site }) }
  if (limit !== undefined) return sites.slice(0, limit)
  if (ready) return sites.filter((site) => site.readiness?.status === "ready_for_llm")
  return all ? sites : []
}

function validateOptions({ siteIds, limit, all, ready, model }) {
  if (Number(siteIds.length > 0) + Number(limit !== undefined) + Number(all) + Number(ready) !== 1) throw new Error("Anna täsmälleen yksi valinnoista --site, --limit, --ready tai --all")
  if (new Set(siteIds).size !== siteIds.length) throw new Error("Sama --site-arvo annettiin useammin kuin kerran")
  if (!model?.trim()) throw new Error("OpenAI-mallin nimi puuttuu")
}
function cachePaths(directory, site, model) {
  const key = buildReportExtractionCacheKey({ site, model })
  const dir = path.join(directory, `prompt-v${REPORT_EXTRACTION_PROMPT_VERSION}-schema-v${REPORT_EXTRACTION_SCHEMA_VERSION}`, encodeURIComponent(model))
  return { key, candidate: path.join(dir, `${site.mjtunnus}.candidate.json`), success: path.join(dir, `${site.mjtunnus}.json`), error: path.join(dir, `${site.mjtunnus}.error.json`) }
}
async function readCandidate(file, site, model) {
  const record = await readJsonIfExists(file)
  if (!record || record.cacheKey !== buildReportExtractionCacheKey({ site, model }) || record.request?.model !== model) return undefined
  return record
}
async function readValidCache(file, site, model) {
  const record = await readJsonIfExists(file)
  if (!record || record.cacheKey !== buildReportExtractionCacheKey({ site, model })) return undefined
  assertReportExtractionResult(record.result, site)
  return record
}
function requestMetadata(site, model) { return { mjtunnus: site.mjtunnus, model, promptVersion: REPORT_EXTRACTION_PROMPT_VERSION, resultSchemaVersion: REPORT_EXTRACTION_SCHEMA_VERSION } }
async function readJsonLines(file) { return (await fs.readFile(file, "utf8")).split("\n").filter((line) => line.trim()).map(JSON.parse) }

export function parseArguments(args) {
  const options = { siteIds: [] }
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === "--help" || arg === "-h") options.help = true
    else if (arg === "--all" || arg === "--ready" || arg === "--force") options[arg.slice(2)] = true
    else if (["--site", "--limit", "--model"].includes(arg)) {
      const value = args[++i]
      if (!value) throw new Error(`Valinnalta ${arg} puuttuu arvo`)
      if (arg === "--site") { if (!/^\d+$/.test(value)) throw new Error("Valinnan --site arvon pitää olla numeerinen"); options.siteIds.push(value) }
      else if (arg === "--limit") { if (!/^\d+$/.test(value) || Number(value) < 1) throw new Error("Valinnan --limit arvo on virheellinen"); options.limit = Number(value) }
      else options.model = value
    } else throw new Error(`Tuntematon komentorivivalinta: ${arg}`)
  }
  return options
}
async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) { console.log("Käyttö: node 10_extract-report-mound-dimensions.mjs (--site MJTUNNUS ... | --limit N | --ready | --all) [--force] [--model MODEL]"); return }
  const { report } = await run({ ...options, onProgress: console.log })
  console.log(`Valmis. API-kutsuja ${report.apiCalls}, validoitavia tallennettuja vastauksia ${report.reusedResponses}, välimuistiosumia ${report.cacheHits}, onnistuneita ${report.successfulSites}, virheitä ${report.failedSites}.`)
  if (report.failedSites) process.exitCode = 1
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
