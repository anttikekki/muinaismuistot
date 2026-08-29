#!/usr/bin/env node

import { spawn } from "node:child_process"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { readJsonIfExists, writeJsonAtomic } from "./lib/files.mjs"

export function parseArguments(args) {
  const options = { siteIds: [], noLlm: false, all: false }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--help" || argument === "-h") options.help = true
    else if (argument === "--no-llm") options.noLlm = true
    else if (argument === "--all") options.all = true
    else if (argument === "--site" || argument === "--limit") {
      const value = args[++index]
      if (!/^\d+$/.test(value ?? "") || Number(value) < 1) throw new Error(`Valinnalla ${argument} on virheellinen arvo`)
      if (argument === "--site") options.siteIds.push(value)
      else options.limit = Number(value)
    } else throw new Error(`Tuntematon komentorivivalinta: ${argument}`)
  }
  if (options.help) return options
  const selectors = Number(options.siteIds.length > 0) + Number(options.limit !== undefined) + Number(options.all)
  if (selectors !== 1) throw new Error("Anna täsmälleen yksi rajaus: --site, --limit tai --all")
  if (new Set(options.siteIds).size !== options.siteIds.length) throw new Error("Sama --site-arvo annettiin useammin kuin kerran")
  return options
}

export async function run({ options, paths = DATA_PATHS, runCommand = executeNodeScript, log = console.log } = {}) {
  const selectorArguments = options.all
    ? []
    : options.siteIds.length
      ? options.siteIds.flatMap((id) => ["--site", id])
      : ["--limit", String(options.limit)]
  const previousIndex = await readJsonIfExists(paths.documentIndexFile)

  await stage(log, "7/13 Aineistolinkkien indeksointi", () => runCommand("7_index-source-documents.mjs", selectorArguments))
  if (previousIndex && !options.all) {
    const currentIndex = await readJsonIfExists(paths.documentIndexFile)
    await writeJsonAtomic(paths.documentIndexFile, mergeDocumentIndexes(previousIndex, currentIndex))
    log("Aiemmat kohteet yhdistettiin uuteen batchiin.")
  }
  await stage(log, "8/13 PDF-tiedostojen lataus", () => runCommand("8_download-source-documents.mjs", ["--all"]))
  await stage(log, "9/13 Kohdekatkelmien ja kattavuuden poiminta", () => runCommand("9_extract-document-passages.mjs", []))

  const coverage = await readJsonIfExists(paths.documentCoverageReportFile)
  const ready = coverage?.counts?.ready_for_llm ?? 0
  log(`LLM-valmiita kohteita ${ready}. API-kutsuja tarvitaan enintään ${ready}; välimuistit pienentävät määrää.`)
  if (options.noLlm) {
    log("--no-llm: maksullinen poiminta ja sitä seuraavat vaiheet ohitettiin.")
    log(`Kattavuusraportti: ${paths.documentCoverageReportFile}`)
    return { coverage, stoppedAfter: 9 }
  }

  await stage(log, "10/13 LLM-poiminta", () => runCommand("10_extract-report-mound-dimensions.mjs", ["--ready"]))
  await stage(log, "11/13 Validointi ja auditointinäkymä", () => runCommand("11_validate-report-results.mjs", []))
  await stage(log, "12/13 Lopullisen aineiston koostaminen", () => runCommand("12_build-report-database.mjs", []))
  await stage(log, "13/13 Koeajoraportin koostaminen", () => runCommand("13_build-pipeline-report.mjs", []))

  const [extraction, publication] = await Promise.all([
    readJsonIfExists(paths.reportExtractionReportFile),
    readJsonIfExists(paths.finalReportBuildReportFile)
  ])
  log("")
  log("Batch valmis.")
  log(`Kohteita: ${coverage?.totalSites ?? "–"}`)
  log(`LLM-valmiita: ${ready}`)
  log(`API-kutsuja: ${extraction?.apiCalls ?? "–"}`)
  log(`Välimuistiosumia: ${extraction?.cacheHits ?? "–"}`)
  log(`Julkaistuja röykkiöitä: ${publication?.publishedMounds ?? "–"}`)
  log(`Odottaa tarkistusta: ${publication?.pendingReviewMounds ?? "–"}`)
  log(`Pysyvästi ohitettu: ${publication?.permanentlySkippedMounds ?? "–"}`)
  log("Tarkistusnäkymä: npm run review:reports")
  log(`Koeajoraportti: ${paths.pipelineReportHtmlFile}`)
  return { coverage, extraction, publication, stoppedAfter: 13 }
}

export function mergeDocumentIndexes(previous, current) {
  if (!current) return previous
  const sites = new Map((previous.sites ?? []).map((site) => [site.mjtunnus, site]))
  for (const site of current.sites ?? []) sites.set(site.mjtunnus, site)
  const records = new Map((previous.records ?? []).map((record) => [record.recordId, structuredClone(record)]))
  for (const record of current.records ?? []) {
    const existing = records.get(record.recordId)
    records.set(record.recordId, existing ? {
      ...existing, ...record,
      titles: unique([...(existing.titles ?? []), ...(record.titles ?? [])]),
      siteIds: unique([...(existing.siteIds ?? []), ...(record.siteIds ?? [])])
    } : record)
  }
  return {
    ...current,
    selection: { ...current.selection, cumulative: true },
    sites: [...sites.values()],
    records: [...records.values()]
  }
}

async function stage(log, label, action) {
  log(`\n=== ${label} ===`)
  await action()
}

function executeNodeScript(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { stdio: "inherit" })
    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${script} epäonnistui${signal ? ` signaaliin ${signal}` : ` paluukoodilla ${code}`}`))
    })
  })
}

function unique(values) { return [...new Set(values)] }

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    console.log("Käyttö: npm run batch -- (--site MJTUNNUS ... | --limit N | --all) [--no-llm]")
    return
  }
  await run({ options })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
