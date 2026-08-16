#!/usr/bin/env node

import crypto from "node:crypto"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS, OPENAI_CONFIG } from "./config.mjs"
import {
  ensureDirectory,
  fileExists,
  readJsonIfExists,
  writeFileAtomic,
  writeJsonAtomic
} from "./lib/files.mjs"
import {
  buildExtractionCacheKey,
  buildModelInput,
  createOpenAIClient,
  extractMoundDimensions,
  MOUND_EXTRACTION_PROMPT_VERSION
} from "./lib/llm.mjs"
import {
  assertMoundExtractionResult,
  MOUND_EXTRACTION_SCHEMA_VERSION
} from "./lib/schemas.mjs"

export async function run({
  siteIds = [],
  limit,
  all = false,
  retryFailed = false,
  force = false,
  model = OPENAI_CONFIG.model,
  concurrency = OPENAI_CONFIG.concurrency,
  paths = DATA_PATHS,
  client,
  now = () => new Date()
} = {}) {
  validateOptions({
    siteIds,
    limit,
    all,
    retryFailed,
    force,
    model,
    concurrency
  })

  const allSites = await readJsonLines(paths.parsedSiteContentFile)
  const selectedSites = await selectSites(allSites, {
    siteIds,
    limit,
    all,
    retryFailed,
    model,
    responsesDirectory: paths.llmResponsesDirectory
  })
  await ensureDirectory(paths.llmResponsesDirectory)

  const completed = []
  const pending = []
  for (const [index, site] of selectedSites.entries()) {
    const cache = cachePaths(paths.llmResponsesDirectory, site, model)
    const cached = force ? undefined : await readValidCache(cache.success, site, model)
    if (cached) completed.push({ index, record: cached, cached: true })
    else pending.push({ index, site, cache })
  }

  let openAIClient = client
  if (pending.length > 0 && !openAIClient) openAIClient = createOpenAIClient()

  const failures = []
  let nextIndex = 0
  async function worker() {
    while (true) {
      const workIndex = nextIndex
      nextIndex += 1
      if (workIndex >= pending.length) return

      const work = pending[workIndex]
      try {
        const extraction = await extractMoundDimensions({
          client: openAIClient,
          site: work.site,
          model
        })
        const createdAt = now().toISOString()
        const record = createCacheRecord({
          site: work.site,
          model,
          cacheKey: work.cache.key,
          createdAt,
          extraction
        })
        await writeJsonAtomic(work.cache.success, record)
        completed.push({ index: work.index, record, cached: false })
      } catch (error) {
        const failure = {
          schemaVersion: 1,
          cacheKey: work.cache.key,
          failedAt: now().toISOString(),
          request: requestMetadata(work.site, model),
          error: {
            name: error.name,
            message: error.message,
            status: error.status ?? null,
            requestId: error.request_id ?? null
          }
        }
        await writeJsonAtomic(work.cache.error, failure)
        failures.push({ mjtunnus: work.site.mjtunnus, ...failure.error })
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  completed.sort((first, second) => first.index - second.index)

  const outputRecords = []
  for (const site of allSites) {
    const cache = cachePaths(paths.llmResponsesDirectory, site, model)
    const record = await readValidCache(cache.success, site, model)
    if (record) outputRecords.push(record)
  }
  const output = outputRecords.map((record) => ({
    ...record.result,
    extraction: {
      cacheKey: record.cacheKey,
      createdAt: record.createdAt,
      model: record.request.model,
      promptVersion: record.request.promptVersion,
      schemaVersion: record.request.schemaVersion,
      response: record.response
    }
  }))
  const jsonLines = output.map((result) => JSON.stringify(result)).join("\n")
  await writeFileAtomic(
    paths.moundDimensionsFile,
    jsonLines.length > 0 ? `${jsonLines}\n` : ""
  )

  const apiCallRecords = completed.filter((item) => !item.cached)
  const report = {
    schemaVersion: 1,
    generatedAt: now().toISOString(),
    sourceFile: path.relative(
      path.dirname(paths.extractionReportFile),
      paths.parsedSiteContentFile
    ),
    selection: {
      siteIds,
      limit: limit ?? null,
      all,
      retryFailed,
      force
    },
    model,
    promptVersion: MOUND_EXTRACTION_PROMPT_VERSION,
    outputSchemaVersion: MOUND_EXTRACTION_SCHEMA_VERSION,
    selectedSites: selectedSites.length,
    apiCalls: apiCallRecords.length + failures.length,
    cacheHits: completed.filter((item) => item.cached).length,
    successfulSites: completed.length,
    failedSites: failures.length,
    outputSites: output.length,
    failures
  }
  await writeJsonAtomic(paths.extractionReportFile, report)

  return { output, report }
}

export function parseArguments(args) {
  const options = { siteIds: [] }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--help" || argument === "-h") {
      options.help = true
      continue
    }
    if (["--all", "--retry-failed", "--force"].includes(argument)) {
      const optionName = {
        "--all": "all",
        "--retry-failed": "retryFailed",
        "--force": "force"
      }[argument]
      options[optionName] = true
      continue
    }
    if (["--site", "--limit", "--model", "--concurrency"].includes(argument)) {
      const rawValue = args[index + 1]
      if (rawValue === undefined) {
        throw new Error(`Valinnalta ${argument} puuttuu arvo`)
      }

      if (argument === "--site") {
        if (!/^\d+$/.test(rawValue)) {
          throw new Error("Valinnan --site arvon pitää olla numeerinen mjtunnus")
        }
        options.siteIds.push(rawValue)
      } else if (argument === "--model") {
        if (!rawValue.trim()) throw new Error("Valinnan --model arvo on tyhjä")
        options.model = rawValue
      } else {
        const value = Number(rawValue)
        if (!Number.isInteger(value) || value < 1) {
          throw new Error(`Valinnalla ${argument} on virheellinen arvo`)
        }
        options[argument === "--limit" ? "limit" : "concurrency"] = value
      }
      index += 1
      continue
    }
    throw new Error(`Tuntematon komentorivivalinta: ${argument}`)
  }

  return options
}

export async function selectSites(
  sites,
  { siteIds, limit, all, retryFailed, model, responsesDirectory }
) {
  if (siteIds.length > 0) {
    const sitesById = new Map(sites.map((site) => [site.mjtunnus, site]))
    return siteIds.map((siteId) => {
      const site = sitesById.get(siteId)
      if (!site) throw new Error(`Vaiheen 3 tuloksesta ei löydy mjtunnusta ${siteId}`)
      return site
    })
  }
  if (limit !== undefined) return sites.slice(0, limit)
  if (all) return sites
  if (retryFailed) {
    const failedSites = []
    for (const site of sites) {
      const cache = cachePaths(responsesDirectory, site, model)
      if ((await fileExists(cache.error)) && !(await fileExists(cache.success))) {
        failedSites.push(site)
      }
    }
    return failedSites
  }
  return []
}

function validateOptions({
  siteIds,
  limit,
  all,
  retryFailed,
  force,
  model,
  concurrency
}) {
  const selectorCount =
    Number(siteIds.length > 0) +
    Number(limit !== undefined) +
    Number(all) +
    Number(retryFailed)
  if (selectorCount !== 1) {
    throw new Error(
      "Anna täsmälleen yksi valinnoista --site, --limit, --all tai --retry-failed"
    )
  }
  if (new Set(siteIds).size !== siteIds.length) {
    throw new Error("Sama --site-arvo annettiin useammin kuin kerran")
  }
  if (siteIds.some((siteId) => !/^\d+$/.test(siteId))) {
    throw new Error("Jokaisen --site-arvon pitää olla numeerinen mjtunnus")
  }
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("Rajan pitää olla positiivinen kokonaisluku")
  }
  if (force && retryFailed) {
    throw new Error("Valintoja --force ja --retry-failed ei voi käyttää yhdessä")
  }
  if (typeof model !== "string" || !model.trim()) {
    throw new Error("OpenAI-mallin nimi puuttuu")
  }
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("Rinnakkaisuuden pitää olla positiivinen kokonaisluku")
  }
  if (concurrency > OPENAI_CONFIG.maxConcurrency) {
    throw new Error(`Rinnakkaisuus saa olla enintään ${OPENAI_CONFIG.maxConcurrency}`)
  }
}

function cachePaths(directory, site, model) {
  const key = buildExtractionCacheKey({ site, model })
  const baseName = `${site.mjtunnus}-${key}`
  return {
    key,
    success: path.join(directory, `${baseName}.json`),
    error: path.join(directory, `${baseName}.error.json`)
  }
}

async function readValidCache(file, site, model) {
  const record = await readJsonIfExists(file)
  if (!record) return undefined
  if (
    record.cacheKey !== buildExtractionCacheKey({ site, model }) ||
    record.request?.model !== model ||
    record.request?.promptVersion !== MOUND_EXTRACTION_PROMPT_VERSION ||
    record.request?.schemaVersion !== MOUND_EXTRACTION_SCHEMA_VERSION
  ) {
    return undefined
  }
  assertMoundExtractionResult(record.result, site.mjtunnus)
  return record
}

function createCacheRecord({ site, model, cacheKey, createdAt, extraction }) {
  return {
    schemaVersion: 1,
    cacheKey,
    createdAt,
    request: requestMetadata(site, model),
    response: extraction.response,
    result: extraction.result
  }
}

function requestMetadata(site, model) {
  const input = buildModelInput(site)
  return {
    mjtunnus: site.mjtunnus,
    model,
    promptVersion: MOUND_EXTRACTION_PROMPT_VERSION,
    schemaVersion: MOUND_EXTRACTION_SCHEMA_VERSION,
    inputSha256: crypto
      .createHash("sha256")
      .update(JSON.stringify(input))
      .digest("hex")
  }
}

async function readJsonLines(file) {
  const { readFile } = await import("node:fs/promises")
  const contents = await readFile(file, "utf8")
  return contents
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line))
}

function printHelp() {
  console.log(`Käyttö: node 4_extract-mound-dimensions.mjs VALINTA [asetukset]

Poimii röykkiöiden mitat OpenAI Responses API:n avulla. Komento voi aiheuttaa
API-kustannuksia ja vaatii OPENAI_API_KEY-ympäristömuuttujan, ellei kaikkia
valittuja tuloksia löydy jo välimuistista.

Valitse täsmälleen yksi:
  --site MJTUNNUS  Käsittele yksi kohde; valinnan voi toistaa
  --limit N        Käsittele N ensimmäistä kohdetta
  --all            Käsittele kaikki vaiheen 3 kohteet
  --retry-failed   Käsittele vain nykyisellä mallilla epäonnistuneet kohteet

Asetukset:
  --force          Ohita välimuisti ja tee API-kutsu uudelleen
  --model MODEL    OpenAI-malli (oletus ${OPENAI_CONFIG.model})
  --concurrency N  Rinnakkaiset API-kutsut (oletus 1, enintään 3)
  -h, --help       Näytä tämä ohje`)
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const { report } = await run(options)
  console.log(
    `Valmis. API-kutsuja ${report.apiCalls}, välimuistiosumia ` +
      `${report.cacheHits}, onnistuneita ${report.successfulSites}, ` +
      `epäonnistuneita ${report.failedSites}.`
  )
  console.log(`Tulos: ${DATA_PATHS.moundDimensionsFile}`)
  if (report.failedSites > 0) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
