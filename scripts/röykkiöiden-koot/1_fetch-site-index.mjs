#!/usr/bin/env node

import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS, WFS_CONFIG } from "./config.mjs"
import { ensureDirectory, writeJsonAtomic } from "./lib/files.mjs"
import { buildWfsUrl, fetchSiteIndex } from "./lib/kyppi.mjs"

export async function run({
  pageSize = WFS_CONFIG.pageSize,
  limit,
  config = WFS_CONFIG,
  paths = DATA_PATHS,
  fetchImpl = globalThis.fetch,
  now = () => new Date()
} = {}) {
  await Promise.all([
    ensureDirectory(paths.wfsPagesDirectory),
    ensureDirectory(paths.wfsFeaturesDirectory),
    ensureDirectory(path.dirname(paths.siteIndexFile)),
    ensureDirectory(path.dirname(paths.manifestFile))
  ])

  const generatedAt = now().toISOString()
  const rawPageFiles = []

  const result = await fetchSiteIndex({
    config,
    fetchImpl,
    pageSize,
    limit,
    onPage: async ({ collection, startIndex }) => {
      const pageFile = path.join(
        paths.wfsPagesDirectory,
        `${String(startIndex).padStart(8, "0")}.json`
      )
      await writeJsonAtomic(pageFile, collection)
      rawPageFiles.push(pageFile)

      await Promise.all(
        collection.features.map((feature) =>
          writeJsonAtomic(
            path.join(
              paths.wfsFeaturesDirectory,
              `${String(feature.properties.mjtunnus)}.geojson`
            ),
            feature
          )
        )
      )
    }
  })

  const queryUrl = buildWfsUrl({
    ...config,
    count: pageSize,
    startIndex: 0
  }).toString()
  const featureCollection = {
    type: "FeatureCollection",
    metadata: {
      generatedAt,
      source: config.endpoint,
      query: queryUrl,
      numberMatched: result.numberMatched,
      numberReturned: result.normalizedFeatures.length,
      limited: limit !== undefined
    },
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:EPSG::3067" }
    },
    features: result.normalizedFeatures
  }
  const manifest = {
    generatedAt,
    query: {
      endpoint: config.endpoint,
      version: config.version,
      typeNames: config.typeNames,
      outputFormat: config.outputFormat,
      cqlFilter: config.cqlFilter,
      pageSize,
      limit: limit ?? null
    },
    numberMatched: result.numberMatched,
    numberReturned: result.normalizedFeatures.length,
    pages: result.pages.map((page, index) => ({
      ...page,
      file: path.relative(path.dirname(paths.manifestFile), rawPageFiles[index])
    }))
  }

  await writeJsonAtomic(paths.siteIndexFile, featureCollection)
  await writeJsonAtomic(paths.manifestFile, manifest)

  return { featureCollection, manifest }
}

export function parseArguments(args) {
  const options = {}

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]

    if (argument === "--help" || argument === "-h") {
      options.help = true
      continue
    }

    if (argument === "--page-size" || argument === "--limit") {
      const rawValue = args[index + 1]
      if (rawValue === undefined) {
        throw new Error(`Valinnalta ${argument} puuttuu arvo`)
      }

      const value = Number(rawValue)
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`Valinnan ${argument} pitää olla positiivinen kokonaisluku`)
      }

      options[argument === "--page-size" ? "pageSize" : "limit"] = value
      index += 1
      continue
    }

    throw new Error(`Tuntematon komentorivivalinta: ${argument}`)
  }

  return options
}

function printHelp() {
  console.log(`Käyttö: node 1_fetch-site-index.mjs [valinnat]

Hakee Museoviraston WFS-palvelusta hautapaikat/hautaröykkiöt-kohteet.

Valinnat:
  --page-size N  WFS-sivun koko (oletus ${WFS_CONFIG.pageSize})
  --limit N      Hae vain N ensimmäistä kohdetta testiajoa varten
  -h, --help     Näytä tämä ohje`)
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const { manifest } = await run(options)
  console.log(
    `Valmis. Tallennettiin ${manifest.numberReturned}/${manifest.numberMatched} kohdetta.`
  )
  console.log(`Kohdeluettelo: ${DATA_PATHS.siteIndexFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
