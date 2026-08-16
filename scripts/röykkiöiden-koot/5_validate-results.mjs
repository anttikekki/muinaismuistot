#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { assertMoundExtractionResult } from "./lib/schemas.mjs"

const MEASUREMENT_FIELDS = ["lengthM", "widthM", "diameterM", "heightM"]

export async function run({ paths = DATA_PATHS, now = () => new Date() } = {}) {
  const [sites, extractions, siteMetadata] = await Promise.all([
    readJsonLines(paths.parsedSiteContentFile),
    readJsonLines(paths.moundDimensionsFile),
    readSiteMetadata(paths.siteIndexFile)
  ])
  const sitesById = new Map(sites.map((site) => [site.mjtunnus, site]))
  const seen = new Set()
  const validated = extractions.map((extraction) => {
    const issues = []
    if (seen.has(extraction.mjtunnus)) add(issues, "duplicate_site", "Kohteen mjtunnus toistuu vaiheen 4 tuloksissa", true)
    seen.add(extraction.mjtunnus)
    const site = sitesById.get(extraction.mjtunnus)
    if (!site) add(issues, "unknown_site", "Kohdetta ei löydy vaiheen 3 aineistosta", true)
    validateExtraction(extraction, site, issues)
    return {
      ...extraction,
      validation: {
        status: issues.some((issue) => issue.severity === "error") ? "invalid" : issues.length ? "review" : "accepted",
        issues
      }
    }
  })

  const reviewSites = validated.filter((item) => item.validation.status !== "accepted")
  const generatedAt = now().toISOString()
  const report = {
    schemaVersion: 1,
    generatedAt,
    sourceFile: path.basename(paths.moundDimensionsFile),
    totalSites: validated.length,
    acceptedSites: validated.filter((item) => item.validation.status === "accepted").length,
    reviewSites: validated.filter((item) => item.validation.status === "review").length,
    invalidSites: validated.filter((item) => item.validation.status === "invalid").length,
    totalMounds: validated.reduce((sum, item) => sum + (item.mounds?.length ?? 0), 0),
    issueCounts: countIssues(validated)
  }
  await writeFileAtomic(paths.validatedResultsFile, validated.length ? `${validated.map(JSON.stringify).join("\n")}\n` : "")
  await writeJsonAtomic(paths.reviewFile, {
    schemaVersion: 1,
    generatedAt,
    sites: reviewSites.map((item) =>
      createReviewEntry(
        item,
        sitesById.get(item.mjtunnus),
        siteMetadata.get(item.mjtunnus)
      )
    )
  })
  await writeJsonAtomic(paths.validationReportFile, report)
  return { validated, reviewSites, report }
}

export function createReviewEntry(extraction, site, metadata) {
  return {
    mjtunnus: extraction.mjtunnus,
    name: metadata?.name ?? null,
    municipality: metadata?.municipality ?? null,
    sourceUrl: metadata?.url ?? site?.source?.finalUrl ?? site?.source?.sourceUrl ?? null,
    status: extraction.validation.status,
    issues: extraction.validation.issues,
    sourceData: site
      ? {
          description: site.description ?? null,
          parsing: site.parsing ?? null,
          source: site.source ?? null
        }
      : null,
    extractedData: {
      statedMoundCount: extraction.statedMoundCount ?? null,
      mounds: extraction.mounds ?? [],
      notes: extraction.notes ?? [],
      extraction: extraction.extraction ?? null
    }
  }
}

export function formatReviewList(reviewSites, sitesById, siteMetadata) {
  if (reviewSites.length === 0) return ["Ei tarkistettavia kohteita."]

  return reviewSites.map((item) => {
    const site = sitesById.get(item.mjtunnus)
    const metadata = siteMetadata.get(item.mjtunnus)
    const label = [metadata?.name, metadata?.municipality].filter(Boolean).join(", ")
    const issueCodes = [...new Set(item.validation.issues.map((issue) => issue.code))]
    const url = metadata?.url ?? site?.source?.finalUrl ?? site?.source?.sourceUrl
    return [
      item.mjtunnus,
      label || null,
      issueCodes.join(", "),
      url || null
    ].filter(Boolean).join(" | ")
  })
}

export function validateExtraction(extraction, site, issues = []) {
  try { assertMoundExtractionResult(extraction, extraction.mjtunnus) }
  catch (error) { add(issues, "schema_invalid", error.message, true); return issues }
  if (!site) return issues
  if (!site.description) add(issues, "description_missing", "Kohteen kuvaus puuttuu")
  if (site.parsing?.needsReview) add(issues, "source_parsing_review", "Vaiheen 3 jäsennys vaatii tarkistuksen")
  if (extraction.statedMoundCount !== null && extraction.statedMoundCount !== extraction.mounds.length) {
    add(issues, "mound_count_mismatch", `Ilmoitettu määrä ${extraction.statedMoundCount}, poimittu ${extraction.mounds.length}`)
  }
  const sourceText = normalize(site.description ?? "")
  for (const mound of extraction.mounds) {
    if (mound.needsReview || mound.confidence === "low") add(issues, "model_review", `Röykkiö ${mound.sourceOrder} vaatii mallin mukaan tarkistuksen`)
    if (MEASUREMENT_FIELDS.every((field) => mound[field] === null)) add(issues, "measurements_missing", `Röykkiöltä ${mound.sourceOrder} puuttuvat kaikki mitat`)
    for (const field of MEASUREMENT_FIELDS) {
      const measurement = mound[field]
      if (!measurement) continue
      const maximum = field === "heightM" ? 20 : 100
      if (measurement.min <= 0 || measurement.max <= 0) add(issues, "non_positive_measurement", `Röykkiön ${mound.sourceOrder} ${field} ei ole positiivinen`, true)
      if (measurement.max > maximum) add(issues, "unrealistic_measurement", `Röykkiön ${mound.sourceOrder} ${field}=${measurement.max} m vaikuttaa epärealistiselta`)
    }
    if (!mound.evidence.length) add(issues, "evidence_missing", `Röykkiöltä ${mound.sourceOrder} puuttuu lähdetuki`)
    for (const evidence of mound.evidence) {
      if (!sourceText.includes(normalize(evidence))) add(issues, "evidence_not_in_source", `Röykkiön ${mound.sourceOrder} lähdekatkelmaa ei löydy alkuperäistekstistä`)
    }
  }
  return issues
}

function add(issues, code, message, error = false) {
  if (!issues.some((issue) => issue.code === code && issue.message === message)) issues.push({ code, severity: error ? "error" : "warning", message })
}
function normalize(value) { return value.toLocaleLowerCase("fi").replace(/\s+/g, " ").trim() }
function countIssues(items) {
  return Object.fromEntries([...items.flatMap((item) => item.validation.issues).reduce((counts, issue) => counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1), new Map())].sort())
}
async function readJsonLines(file) {
  const contents = await fs.readFile(file, "utf8")
  return contents.split(/\r?\n/).filter((line) => line.trim()).map((line, index) => {
    try { return JSON.parse(line) } catch (error) { throw new Error(`${file}: virheellinen JSON rivillä ${index + 1}: ${error.message}`) }
  })
}

async function readSiteMetadata(file) {
  if (!file) return new Map()
  try {
    const featureCollection = JSON.parse(await fs.readFile(file, "utf8"))
    return new Map((featureCollection.features ?? []).map((feature) => {
      const properties = feature.properties ?? {}
      return [properties.mjtunnus, {
        name: properties.kohdenimi ?? null,
        municipality: properties.kunta ?? null,
        url: properties.url ?? null
      }]
    }))
  } catch (error) {
    if (error.code === "ENOENT") return new Map()
    throw error
  }
}

async function main() {
  const { report, reviewSites } = await run()
  console.log(`Valmis. Hyväksytty ${report.acceptedSites}, tarkistettavia ${report.reviewSites}, virheellisiä ${report.invalidSites}.`)
  if (reviewSites.length > 0) {
    const sites = await readJsonLines(DATA_PATHS.parsedSiteContentFile)
    const sitesById = new Map(sites.map((site) => [site.mjtunnus, site]))
    const siteMetadata = await readSiteMetadata(DATA_PATHS.siteIndexFile)
    console.log("\nTarkistettavat kohteet (mjtunnus | nimi, kunta | syyt | linkki):")
    for (const line of formatReviewList(reviewSites, sitesById, siteMetadata)) {
      console.log(`- ${line}`)
    }
  }
  console.log(`Tulos: ${DATA_PATHS.validatedResultsFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1 })
}
