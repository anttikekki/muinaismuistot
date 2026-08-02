#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { readJson, writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { parseKyppiPage } from "./lib/kyppi-parser.mjs"

export async function run({
  siteIds = [],
  limit,
  paths = DATA_PATHS,
  now = () => new Date()
} = {}) {
  validateOptions({ siteIds, limit })

  const downloadManifest = await readJson(paths.downloadManifestFile)
  const selectedEntries = selectDownloadedEntries(downloadManifest, {
    siteIds,
    limit
  })
  const parsedSites = []

  for (const entry of selectedEntries) {
    const sourceFile = path.resolve(
      path.dirname(paths.downloadManifestFile),
      entry.file
    )
    const contents = await fs.readFile(sourceFile)
    const actualSha256 = crypto.createHash("sha256").update(contents).digest("hex")
    if (actualSha256 !== entry.sha256) {
      throw new Error(`Kyppi-sivun ${entry.mjtunnus} SHA-256-tiiviste ei täsmää`)
    }

    const parsed = parseKyppiPage(decodeHtml(contents, entry.contentType), {
      expectedMjtunnus: entry.mjtunnus
    })
    parsed.source = {
      file: entry.file,
      sourceUrl: entry.sourceUrl,
      finalUrl: entry.finalUrl,
      fetchedAt: entry.fetchedAt,
      contentType: entry.contentType,
      sha256: entry.sha256
    }
    parsedSites.push(parsed)
  }

  const generatedAt = now().toISOString()
  const jsonLines = parsedSites.map((site) => JSON.stringify(site)).join("\n")
  await writeFileAtomic(
    paths.parsedSiteContentFile,
    jsonLines.length > 0 ? `${jsonLines}\n` : ""
  )

  const report = {
    schemaVersion: 1,
    generatedAt,
    sourceManifest: path.relative(
      path.dirname(paths.parseReportFile),
      paths.downloadManifestFile
    ),
    selection: {
      siteIds,
      limit: limit ?? null
    },
    parsedSites: parsedSites.length,
    sitesWithDescription: parsedSites.filter((site) => site.description).length,
    subSites: parsedSites.reduce((sum, site) => sum + site.subSites.length, 0),
    sitesNeedingReview: parsedSites.filter((site) => site.parsing.needsReview).length,
    warnings: parsedSites.reduce(
      (sum, site) => sum + site.parsing.warnings.length,
      0
    )
  }
  await writeJsonAtomic(paths.parseReportFile, report)

  return { parsedSites, report }
}

export function selectDownloadedEntries(manifest, { siteIds = [], limit }) {
  if (!Array.isArray(manifest?.sites)) {
    throw new Error("Vaiheen 2 manifestista puuttuu sites-taulukko")
  }

  const successfulEntries = manifest.sites.filter((entry) => entry.status === "success")
  if (siteIds.length > 0) {
    const entriesById = new Map(
      successfulEntries.map((entry) => [entry.mjtunnus, entry])
    )
    return siteIds.map((siteId) => {
      const entry = entriesById.get(siteId)
      if (!entry) {
        throw new Error(`Onnistuneesti ladattua kohdetta ${siteId} ei löydy`)
      }
      return entry
    })
  }

  return limit === undefined
    ? successfulEntries
    : successfulEntries.slice(0, limit)
}

export function parseArguments(args) {
  const options = { siteIds: [] }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--help" || argument === "-h") {
      options.help = true
      continue
    }
    if (argument === "--site" || argument === "--limit") {
      const rawValue = args[index + 1]
      if (rawValue === undefined) {
        throw new Error(`Valinnalta ${argument} puuttuu arvo`)
      }
      if (!/^\d+$/.test(rawValue) || Number(rawValue) < 1) {
        throw new Error(`Valinnalla ${argument} on virheellinen arvo`)
      }

      if (argument === "--site") options.siteIds.push(rawValue)
      else options.limit = Number(rawValue)
      index += 1
      continue
    }
    throw new Error(`Tuntematon komentorivivalinta: ${argument}`)
  }

  return options
}

function validateOptions({ siteIds, limit }) {
  if (siteIds.length > 0 && limit !== undefined) {
    throw new Error("Valintoja --site ja --limit ei voi käyttää yhdessä")
  }
  if (new Set(siteIds).size !== siteIds.length) {
    throw new Error("Sama --site-arvo annettiin useammin kuin kerran")
  }
}

function decodeHtml(contents, contentType = "") {
  const charset = /charset\s*=\s*["']?([^;"'\s]+)/i.exec(contentType)?.[1]
  try {
    return new TextDecoder(charset || "utf-8").decode(contents)
  } catch {
    return new TextDecoder("utf-8").decode(contents)
  }
}

function printHelp() {
  console.log(`Käyttö: node 3_extract-page-content.mjs [valinnat]

Jäsentää vaiheen 2 onnistuneesti lataamat Kyppi-sivut JSONL-tiedostoksi.
Ilman valintoja käsitellään kaikki manifestin onnistuneet lataukset.

Valinnat:
  --site MJTUNNUS  Käsittele yksi kohde; valinnan voi toistaa
  --limit N        Käsittele N ensimmäistä onnistunutta latausta
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
    `Valmis. Jäsennettiin ${report.parsedSites} kohdetta ja ` +
      `${report.subSites} alakohdetta; tarkistettavia kohteita ` +
      `${report.sitesNeedingReview}.`
  )
  console.log(`Tulos: ${DATA_PATHS.parsedSiteContentFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
