#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs/promises"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { calculateDerivedMeasurements } from "./6_build-database.mjs"
import { readJsonIfExists, writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"

export const REPORT_DATABASE_SCHEMA_VERSION = 1
const MEASUREMENT_FIELDS = ["lengthM", "widthM", "diameterM", "heightM"]

export async function run({ paths = DATA_PATHS, now = () => new Date() } = {}) {
  const [siteIndex, validated, passages, kyppiSites, reviewState] = await Promise.all([
    readJson(paths.siteIndexFile),
    readJsonLines(paths.validatedReportResultsFile),
    readJsonLines(paths.documentPassagesFile),
    readJsonLinesIfExists(paths.parsedSiteContentFile),
    readReviewState(paths.reportReviewAcknowledgementsFile)
  ])
  if (siteIndex?.type !== "FeatureCollection" || !Array.isArray(siteIndex.features)) {
    throw new Error("Vaiheen 1 kohdeluettelo ei ole GeoJSON FeatureCollection")
  }

  const sourceSites = new Map(siteIndex.features.map((feature) => [String(feature.properties?.mjtunnus ?? ""), feature]))
  const passageSites = new Map(passages.map((site) => [site.mjtunnus, site]))
  const kyppiSitesById = new Map(kyppiSites.map((site) => [site.mjtunnus, site]))
  const records = []
  const excluded = { pending_review: 0, permanently_skipped: 0, invalid: 0 }
  let automaticAcceptedMounds = 0
  let humanAcceptedMounds = 0

  for (const site of validated) {
    const source = sourceSites.get(site.mjtunnus)
    if (!source) throw new Error(`Kohdetta ${site.mjtunnus} ei löydy WFS-aineistosta`)
    validateGeometry(source.geometry, site.mjtunnus)
    const passageSite = passageSites.get(site.mjtunnus)

    for (const mound of site.mounds) {
      const relevantIssues = (site.validation?.issues ?? []).filter((issue) => issue.mound == null || issue.mound === mound.sourceOrder)
      const decision = reviewState.moundDecisions?.[`${site.mjtunnus}:${mound.sourceOrder}`]
      if (decision?.status === "permanently_skipped") {
        excluded.permanently_skipped += 1
        continue
      }
      if (relevantIssues.some((issue) => issue.severity === "error")) {
        excluded.invalid += 1
        continue
      }
      const unacknowledged = relevantIssues.filter((issue) => !reviewState.acknowledgements?.[observationId(site.mjtunnus, issue)])
      if (unacknowledged.length > 0) {
        excluded.pending_review += 1
        continue
      }

      const acceptance = relevantIssues.length > 0 ? "human_reviewed" : "automatic"
      if (acceptance === "human_reviewed") humanAcceptedMounds += 1
      else automaticAcceptedMounds += 1
      records.push(createRecord({ site, mound, source, passageSite, kyppiSite: kyppiSitesById.get(site.mjtunnus), acceptance, relevantIssues }))
    }
  }

  const generatedAt = now().toISOString()
  const collection = {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: REPORT_DATABASE_SCHEMA_VERSION,
      generatedAt,
      coordinateReferenceSystem: "EPSG:3067",
      source: "Museoviraston inventointi- ja tutkimusraportit",
      moundFeatures: records.length
    },
    crs: siteIndex.crs ?? { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::3067" } },
    features: records.map(recordToFeature)
  }
  const report = {
    schemaVersion: 1,
    generatedAt,
    totalSites: validated.length,
    totalMounds: validated.reduce((sum, site) => sum + site.mounds.length, 0),
    publishedSites: new Set(records.map((record) => record.mjtunnus)).size,
    publishedMounds: records.length,
    automaticAcceptedMounds,
    humanAcceptedMounds,
    pendingReviewMounds: excluded.pending_review,
    permanentlySkippedMounds: excluded.permanently_skipped,
    invalidMounds: excluded.invalid
  }

  await writeFileAtomic(paths.finalReportMoundsFile, records.map(JSON.stringify).join("\n") + (records.length ? "\n" : ""))
  await writeJsonAtomic(paths.finalReportMoundsGeoJsonFile, collection)
  await writeJsonAtomic(paths.finalReportBuildReportFile, report)
  return { records, collection, report }
}

function createRecord({ site, mound, source, passageSite, kyppiSite, acceptance, relevantIssues }) {
  const properties = source.properties ?? {}
  const documents = new Map((passageSite?.documents ?? []).map((document) => [document.documentId, document]))
  const sourceReferences = mound.sourceReferences.map((reference) => {
    const document = documents.get(reference.documentId)
    return {
      documentId: reference.documentId,
      title: document?.title ?? null,
      sourceUrl: document?.sourceUrl ?? null,
      sourceYear: document?.sourceYear ?? null,
      page: reference.page,
      evidence: reference.evidence
    }
  })
  return {
    schemaVersion: REPORT_DATABASE_SCHEMA_VERSION,
    id: `${site.mjtunnus}-${mound.sourceOrder}`,
    mjtunnus: site.mjtunnus,
    sourceOrder: mound.sourceOrder,
    name: properties.kohdenimi ?? null,
    municipality: properties.kunta ?? null,
    siteUrl: properties.url ?? null,
    geometry: structuredClone(source.geometry),
    measurements: Object.fromEntries(MEASUREMENT_FIELDS.map((field) => [field, mound[field]])),
    derivedMeasurements: calculateDerivedMeasurements(mound),
    shape: mound.shape,
    status: mound.status,
    confidence: mound.confidence,
    notes: site.notes ?? [],
    acceptance,
    acknowledgedIssues: relevantIssues.map((issue) => ({ code: issue.code, severity: issue.severity, message: issue.message })),
    sourceReferences,
    kyppiDescription: kyppiSite ? { text: kyppiSite.description ?? null, sourceUrl: kyppiSite.source?.sourceUrl ?? null, fetchedAt: kyppiSite.source?.fetchedAt ?? null, role: "supporting_context_not_measurement_source" } : null,
    extraction: site.extraction ?? null
  }
}

function recordToFeature(record) {
  const { geometry, ...properties } = record
  return { type: "Feature", id: record.id, geometry: structuredClone(geometry), properties }
}

function observationId(mjtunnus, issue) {
  return crypto.createHash("sha256").update(JSON.stringify({
    mjtunnus, code: issue.code, message: issue.message, mound: issue.mound ?? null
  })).digest("hex")
}

async function readReviewState(file) {
  return (await readJsonIfExists(file)) ?? { acknowledgements: {}, moundDecisions: {} }
}

async function readJson(file) { return JSON.parse(await fs.readFile(file, "utf8")) }
async function readJsonLines(file) { return (await fs.readFile(file, "utf8")).split(/\r?\n/).filter((line) => line.trim()).map(JSON.parse) }
async function readJsonLinesIfExists(file) { if (!file) return []; try { return await readJsonLines(file) } catch (error) { if (error.code === "ENOENT") return []; throw error } }

function validateGeometry(geometry, mjtunnus) {
  if (geometry?.type !== "Point" || !Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2 || !geometry.coordinates.slice(0, 2).every(Number.isFinite)) {
    throw new Error(`Kohteen ${mjtunnus} geometria ei ole kelvollinen piste`)
  }
}

async function main() {
  const { report } = await run()
  console.log(`Valmis. Julkaistu ${report.publishedMounds}, odottaa tarkistusta ${report.pendingReviewMounds}, pysyvästi ohitettu ${report.permanentlySkippedMounds}, virheellisiä ${report.invalidMounds}.`)
  console.log(`GeoJSON: ${DATA_PATHS.finalReportMoundsGeoJsonFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
