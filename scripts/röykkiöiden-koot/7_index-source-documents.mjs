#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { readJson, writeJsonAtomic } from "./lib/files.mjs"
import { parseKyppiPage } from "./lib/kyppi-parser.mjs"

export async function run({ siteIds = [], limit, paths = DATA_PATHS, now = () => new Date() } = {}) {
  const manifest = await readJson(paths.downloadManifestFile)
  const siteIndex = await readJson(paths.siteIndexFile)
  const siteMetadata = new Map(siteIndex.features.map((feature) => [
    String(feature.properties.mjtunnus),
    { kohdenimi: feature.properties.kohdenimi ?? null, kunta: feature.properties.kunta ?? null }
  ]))
  const entries = selectEntries(manifest, { siteIds, limit })
  const sites = []
  const records = new Map()

  for (const entry of entries) {
    const sourceFile = path.resolve(path.dirname(paths.downloadManifestFile), entry.file)
    const contents = await fs.readFile(sourceFile)
    const sha256 = crypto.createHash("sha256").update(contents).digest("hex")
    if (sha256 !== entry.sha256) throw new Error(`Kyppi-sivun ${entry.mjtunnus} SHA-256-tiiviste ei täsmää`)
    const parsed = parseKyppiPage(new TextDecoder().decode(contents), { expectedMjtunnus: entry.mjtunnus })
    sites.push({
      mjtunnus: entry.mjtunnus,
      ...(siteMetadata.get(entry.mjtunnus) ?? { kohdenimi: null, kunta: null }),
      recordIds: parsed.materialLinks.map((link) => link.recordId)
    })
    for (const link of parsed.materialLinks) {
      const record = records.get(link.recordId) ?? { recordId: link.recordId, url: link.url, titles: [], siteIds: [] }
      if (link.title && !record.titles.includes(link.title)) record.titles.push(link.title)
      if (!record.siteIds.includes(entry.mjtunnus)) record.siteIds.push(entry.mjtunnus)
      records.set(link.recordId, record)
    }
  }

  const result = {
    schemaVersion: 1,
    generatedAt: now().toISOString(),
    sourceManifest: path.relative(path.dirname(paths.documentIndexFile), paths.downloadManifestFile),
    selection: { siteIds, limit: limit ?? null },
    sites,
    records: [...records.values()]
  }
  await writeJsonAtomic(paths.documentIndexFile, result)
  return result
}

export function selectEntries(manifest, { siteIds = [], limit }) {
  const entries = (manifest?.sites ?? []).filter((entry) => entry.status === "success")
  if (siteIds.length) {
    const byId = new Map(entries.map((entry) => [entry.mjtunnus, entry]))
    return siteIds.map((id) => {
      const entry = byId.get(id)
      if (!entry) throw new Error(`Onnistuneesti ladattua kohdetta ${id} ei löydy`)
      return entry
    })
  }
  return limit === undefined ? entries : entries.slice(0, limit)
}

export function parseArguments(args) {
  const options = { siteIds: [] }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === "--help" || argument === "-h") options.help = true
    else if (argument === "--site" || argument === "--limit") {
      const value = args[++index]
      if (!/^\d+$/.test(value ?? "") || Number(value) < 1) throw new Error(`Valinnalla ${argument} on virheellinen arvo`)
      if (argument === "--site") options.siteIds.push(value)
      else options.limit = Number(value)
    } else throw new Error(`Tuntematon komentorivivalinta: ${argument}`)
  }
  if (options.siteIds.length && options.limit !== undefined) throw new Error("Valintoja --site ja --limit ei voi käyttää yhdessä")
  return options
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    console.log("Käyttö: node 7_index-source-documents.mjs [--site MJTUNNUS ... | --limit N]")
    return
  }
  const result = await run(options)
  console.log(`Valmis. ${result.sites.length} kohdetta, ${result.records.length} yksilöllistä aineistotietuetta.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
