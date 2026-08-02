#!/usr/bin/env node

import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS, KYPPI_CONFIG } from "./config.mjs"
import {
  ensureDirectory,
  fileExists,
  readJson,
  readJsonIfExists,
  sha256File,
  writeFileAtomic,
  writeJsonAtomic
} from "./lib/files.mjs"
import {
  createRequestRateLimiter,
  downloadKyppiPage
} from "./lib/kyppi-download.mjs"

export async function run({
  siteIds = [],
  limit,
  all = false,
  force = false,
  concurrency = KYPPI_CONFIG.concurrency,
  requestDelayMs = KYPPI_CONFIG.requestDelayMs,
  config = KYPPI_CONFIG,
  paths = DATA_PATHS,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  sleep
} = {}) {
  validateRunOptions({
    siteIds,
    limit,
    all,
    concurrency,
    requestDelayMs,
    config
  })

  const siteIndex = await readJson(paths.siteIndexFile)
  const selectedSites = selectSites(siteIndex, { siteIds, limit, all })
  const previousManifest = await readJsonIfExists(paths.downloadManifestFile)
  const entries = new Map(
    (previousManifest?.sites ?? []).map((entry) => [entry.mjtunnus, entry])
  )
  const startedAt = now().toISOString()
  const summary = {
    selected: selectedSites.length,
    downloaded: 0,
    skipped: 0,
    failed: 0
  }
  const rateLimiter = createRequestRateLimiter({
    delayMs: requestDelayMs,
    ...(sleep ? { sleep } : {})
  })

  await ensureDirectory(paths.kyppiPagesDirectory)

  let persistQueue = Promise.resolve()
  const persistManifest = ({ finishedAt = null } = {}) => {
    const manifest = createManifest({
      paths,
      startedAt,
      finishedAt,
      selection: { siteIds, limit: limit ?? null, all, force },
      concurrency,
      requestDelayMs,
      summary,
      entries
    })
    persistQueue = persistQueue.then(() =>
      writeJsonAtomic(paths.downloadManifestFile, manifest)
    )
    return persistQueue
  }

  let nextSiteIndex = 0
  async function worker() {
    while (true) {
      const currentIndex = nextSiteIndex
      nextSiteIndex += 1
      if (currentIndex >= selectedSites.length) return

      const site = selectedSites[currentIndex]
      const mjtunnus = site.properties.mjtunnus
      const sourceUrl = site.properties.url
      const outputFile = path.join(paths.kyppiPagesDirectory, `${mjtunnus}.html`)
      const previousEntry = entries.get(mjtunnus)

      if (
        !force &&
        (await isValidCachedPage({ previousEntry, outputFile, sourceUrl }))
      ) {
        summary.skipped += 1
        continue
      }

      try {
        const response = await downloadKyppiPage({
          sourceUrl,
          config,
          fetchImpl,
          waitForRequest: rateLimiter,
          ...(sleep ? { sleep } : {})
        })
        await writeFileAtomic(outputFile, response.contents)

        entries.set(mjtunnus, {
          mjtunnus,
          status: "success",
          sourceUrl,
          finalUrl: response.finalUrl,
          httpStatus: response.httpStatus,
          fetchedAt: now().toISOString(),
          attempts: response.attempts,
          file: path.relative(path.dirname(paths.downloadManifestFile), outputFile),
          contentType: response.contentType,
          byteLength: response.contents.byteLength,
          sha256: response.sha256
        })
        summary.downloaded += 1
      } catch (error) {
        entries.set(mjtunnus, {
          mjtunnus,
          status: "failed",
          sourceUrl,
          failedAt: now().toISOString(),
          attempts: error.attempts ?? null,
          httpStatus: error.httpStatus ?? null,
          error: error.message
        })
        summary.failed += 1
      }

      await persistManifest()
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  await persistQueue

  const finishedAt = now().toISOString()
  await persistManifest({ finishedAt })
  return readJson(paths.downloadManifestFile)
}

export function selectSites(siteIndex, { siteIds = [], limit, all = false }) {
  if (siteIndex?.type !== "FeatureCollection" || !Array.isArray(siteIndex.features)) {
    throw new Error("Vaiheen 1 kohdeluettelo ei ole GeoJSON FeatureCollection")
  }

  const sites = siteIndex.features.map((feature) => {
    const mjtunnus = String(feature?.properties?.mjtunnus ?? "")
    if (!/^\d+$/.test(mjtunnus)) {
      throw new Error("Kohdeluettelossa on virheellinen mjtunnus")
    }

    let url
    try {
      url = new URL(feature.properties.url)
    } catch {
      throw new Error(`Kohteella ${mjtunnus} on virheellinen URL`)
    }
    if (url.protocol !== "https:" || url.hostname !== "www.kyppi.fi") {
      throw new Error(`Kohteella ${mjtunnus} on muu kuin sallittu Kyppi-URL`)
    }

    return {
      ...feature,
      properties: { ...feature.properties, mjtunnus }
    }
  })

  if (siteIds.length > 0) {
    const sitesById = new Map(sites.map((site) => [site.properties.mjtunnus, site]))
    return siteIds.map((siteId) => {
      const site = sitesById.get(siteId)
      if (!site) throw new Error(`Kohdeluettelosta ei löydy mjtunnusta ${siteId}`)
      return site
    })
  }

  if (limit !== undefined) return sites.slice(0, limit)
  if (all) return sites
  return []
}

export function parseArguments(args) {
  const options = { siteIds: [] }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (argument === "--help" || argument === "-h") {
      options.help = true
      continue
    }
    if (argument === "--all" || argument === "--force") {
      options[argument === "--all" ? "all" : "force"] = true
      continue
    }
    if (
      argument === "--site" ||
      argument === "--limit" ||
      argument === "--concurrency" ||
      argument === "--delay-ms"
    ) {
      const rawValue = args[index + 1]
      if (rawValue === undefined) {
        throw new Error(`Valinnalta ${argument} puuttuu arvo`)
      }

      if (argument === "--site") {
        if (!/^\d+$/.test(rawValue)) {
          throw new Error("Valinnan --site arvon pitää olla numeerinen mjtunnus")
        }
        options.siteIds.push(rawValue)
      } else {
        const value = Number(rawValue)
        const minimum = argument === "--delay-ms" ? 0 : 1
        if (!Number.isInteger(value) || value < minimum) {
          throw new Error(`Valinnalla ${argument} on virheellinen kokonaislukuarvo`)
        }
        const optionName = {
          "--limit": "limit",
          "--concurrency": "concurrency",
          "--delay-ms": "requestDelayMs"
        }[argument]
        options[optionName] = value
      }
      index += 1
      continue
    }

    throw new Error(`Tuntematon komentorivivalinta: ${argument}`)
  }

  return options
}

function validateRunOptions({
  siteIds,
  limit,
  all,
  concurrency,
  requestDelayMs,
  config
}) {
  const selectorCount = Number(siteIds.length > 0) + Number(limit !== undefined) + Number(all)
  if (selectorCount !== 1) {
    throw new Error("Anna täsmälleen yksi valinnoista --site, --limit tai --all")
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
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("Rinnakkaisuuden pitää olla positiivinen kokonaisluku")
  }
  if (concurrency > config.maxConcurrency) {
    throw new Error(`Rinnakkaisuus saa olla enintään ${config.maxConcurrency}`)
  }
  if (
    !Number.isInteger(requestDelayMs) ||
    requestDelayMs < config.minRequestDelayMs
  ) {
    throw new Error(`Pyyntövälin pitää olla vähintään ${config.minRequestDelayMs} ms`)
  }
}

async function isValidCachedPage({ previousEntry, outputFile, sourceUrl }) {
  if (
    previousEntry?.status !== "success" ||
    previousEntry.sourceUrl !== sourceUrl ||
    !(await fileExists(outputFile))
  ) {
    return false
  }

  return (await sha256File(outputFile)) === previousEntry.sha256
}

function createManifest({
  paths,
  startedAt,
  finishedAt,
  selection,
  concurrency,
  requestDelayMs,
  summary,
  entries
}) {
  return {
    schemaVersion: 1,
    updatedAt: finishedAt ?? new Date().toISOString(),
    sourceIndex: path.relative(
      path.dirname(paths.downloadManifestFile),
      paths.siteIndexFile
    ),
    lastRun: {
      startedAt,
      finishedAt,
      selection,
      concurrency,
      requestDelayMs,
      ...summary
    },
    sites: [...entries.values()].sort((first, second) =>
      first.mjtunnus.localeCompare(second.mjtunnus, "fi", { numeric: true })
    )
  }
}

function printHelp() {
  console.log(`Käyttö: node 2_download-pages.mjs VALINTA [asetukset]

Lataa Kyppi-kohdesivut vaiheen 1 kohdeluettelon URL-osoitteista. Koko aineisto
ladataan vain nimenomaisella --all-valinnalla.

Valitse täsmälleen yksi:
  --site MJTUNNUS  Lataa yksi kohde; valinnan voi toistaa
  --limit N        Lataa kohdeluettelon N ensimmäistä kohdetta
  --all            Lataa koko kohdeluettelo

Asetukset:
  --force          Lataa myös onnistuneesti välimuistissa oleva sivu uudelleen
  --concurrency N  Rinnakkaisten latausten määrä (oletus 1, enintään 3)
  --delay-ms N     Pyyntöjen vähimmäisväli millisekunteina (oletus 1000)
  -h, --help       Näytä tämä ohje`)
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const manifest = await run(options)
  const runSummary = manifest.lastRun
  console.log(
    `Valmis. Ladattiin ${runSummary.downloaded}, ohitettiin ` +
      `${runSummary.skipped}, epäonnistui ${runSummary.failed}.`
  )
  console.log(`Manifesti: ${DATA_PATHS.downloadManifestFile}`)
  if (runSummary.failed > 0) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
