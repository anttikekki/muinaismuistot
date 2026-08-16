#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"

export const DATABASE_SCHEMA_VERSION = 1
const MEASUREMENT_FIELDS = ["lengthM", "widthM", "diameterM", "heightM"]

export async function run({ paths = DATA_PATHS, now = () => new Date() } = {}) {
  const [siteIndex, validated] = await Promise.all([
    readJson(paths.siteIndexFile),
    readJsonLines(paths.validatedResultsFile)
  ])
  if (siteIndex?.type !== "FeatureCollection" || !Array.isArray(siteIndex.features)) {
    throw new Error("Vaiheen 1 kohdeluettelo ei ole GeoJSON FeatureCollection")
  }

  const sourceSites = new Map(siteIndex.features.map((feature) => [
    String(feature.properties?.mjtunnus ?? ""),
    feature
  ]))
  const publishable = validated.filter((site) =>
    ["accepted", "review"].includes(site.validation?.status)
  )
  const features = []
  const featureIds = new Set()

  for (const site of publishable) {
    const source = sourceSites.get(site.mjtunnus)
    if (!source) throw new Error(`Kohdetta ${site.mjtunnus} ei löydy WFS-aineistosta`)
    validateGeometry(source.geometry, site.mjtunnus)

    for (const mound of site.mounds) {
      const id = `${site.mjtunnus}-${mound.sourceOrder}`
      if (featureIds.has(id)) throw new Error(`Feature-tunnus ${id} toistuu`)
      featureIds.add(id)
      features.push(createMoundFeature({ id, source, site, mound }))
    }
  }

  const expectedFeatureCount = publishable.reduce((sum, site) => sum + site.mounds.length, 0)
  if (features.length !== expectedFeatureCount) {
    throw new Error(`Featurejen määrä ${features.length} ei vastaa röykkiöiden määrää ${expectedFeatureCount}`)
  }

  const generatedAt = now().toISOString()
  const collection = {
    type: "FeatureCollection",
    metadata: {
      schemaVersion: DATABASE_SCHEMA_VERSION,
      generatedAt,
      coordinateReferenceSystem: "EPSG:3067",
      sourceSites: publishable.length,
      moundFeatures: features.length
    },
    crs: siteIndex.crs ?? {
      type: "name",
      properties: { name: "urn:ogc:def:crs:EPSG::3067" }
    },
    features
  }
  const report = {
    schemaVersion: 1,
    generatedAt,
    totalValidatedSites: validated.length,
    publishedSites: publishable.length,
    publishedReviewSites: publishable.filter((site) => site.validation.status === "review").length,
    excludedInvalidSites: validated.filter((site) => site.validation?.status === "invalid").length,
    publishedMounds: features.length,
    outputFile: path.basename(paths.moundsDatabaseFile)
  }

  await writeJsonAtomic(paths.moundsDatabaseFile, collection)
  await writeFileAtomic(
    paths.moundsDatabaseHtmlFile ?? path.join(path.dirname(paths.moundsDatabaseFile), "6_mounds.html"),
    renderDatabaseHtml(collection)
  )
  await writeJsonAtomic(paths.databaseBuildReportFile, report)
  return { collection, report }
}

export function renderDatabaseHtml(collection) {
  const rows = collection.features.map((feature) => {
    const item = feature.properties
    return `<tr>
      <td data-sort="${escapeHtml(item.name ?? "")}">${linkValue(item.name, item.sourceUrl)}</td>
      <td data-sort="${escapeHtml(item.municipality ?? "")}">${escapeHtml(item.municipality ?? "–")}</td>
      <td data-sort="${item.mjtunnus}">${escapeHtml(item.mjtunnus)}</td>
      <td data-sort="${item.sourceOrder}">${item.sourceOrder}</td>
      <td data-sort="${escapeHtml(item.validationStatus)}">${escapeHtml(item.validationStatus)}</td>
      ${measurementCell(item.lengthM)}
      ${measurementCell(item.widthM)}
      ${measurementCell(item.diameterM)}
      ${measurementCell(item.heightM)}
      ${measurementCell(item.areaM2)}
      ${measurementCell(item.volumeM3)}
    </tr>`
  }).join("\n")
  return `<!doctype html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Röykkiöiden mitat</title>
  <style>
    :root { font-family: system-ui, sans-serif; color: #25231f; background: #f4f1ea; }
    body { margin: 0; padding: 24px; }
    h1 { margin: 0 0 6px; }
    .controls { display: flex; gap: 18px; align-items: end; flex-wrap: wrap; margin: 20px 0; }
    label { display: grid; gap: 5px; }
    input { min-width: 280px; padding: 8px 10px; font: inherit; }
    .table-wrap { overflow: auto; max-height: calc(100vh - 190px); background: white; border: 1px solid #d8d2c5; }
    table { border-collapse: collapse; width: 100%; white-space: nowrap; }
    th { position: sticky; top: 0; z-index: 1; padding: 0; background: #ece7dc; border-bottom: 2px solid #aaa294; }
    th button { width: 100%; border: 0; background: transparent; padding: 10px 12px; font: inherit; font-weight: 700; text-align: left; cursor: pointer; }
    th button:hover { background: #ddd6c7; }
    td { padding: 8px 12px; border-bottom: 1px solid #ece8df; }
    tbody tr:nth-child(even) { background: #faf8f3; }
    tbody tr:hover { background: #fff1c9; }
    td:nth-child(n+4) { text-align: right; font-variant-numeric: tabular-nums; }
    .muted { color: #625d53; }
    a { color: #075a9c; }
  </style>
</head>
<body>
  <h1>Röykkiöiden mitat</h1>
  <div class="muted">${collection.features.length} röykkiötä · luotu ${escapeHtml(collection.metadata.generatedAt)} · järjestä klikkaamalla sarakeotsikkoa</div>
  <div class="controls">
    <label>Hae nimellä, kunnalla tai tunnuksella<input id="search" type="search" placeholder="Kirjoita hakusana…"></label>
    <span id="visible-count">${collection.features.length} riviä</span>
  </div>
  <div class="table-wrap">
    <table>
      <thead><tr>
        ${header("Nimi", "text")}${header("Kunta", "text")}${header("mjtunnus", "text")}${header("Nro", "number")}${header("Validointi", "text")}
        ${header("Pituus (m)", "number")}${header("Leveys (m)", "number")}${header("Halkaisija (m)", "number")}${header("Korkeus (m)", "number")}
        ${header("Pinta-ala (m²)", "number")}${header("Tilavuus (m³)", "number")}
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <script>
    const tbody = document.querySelector('tbody')
    const buttons = [...document.querySelectorAll('th button')]
    let sortColumn = -1
    let sortDirection = 1
    function sortRows(column, type) {
      sortDirection = sortColumn === column ? -sortDirection : (type === 'number' ? -1 : 1)
      sortColumn = column
      const rows = [...tbody.rows]
      rows.sort((a, b) => {
        const left = a.cells[column].dataset.sort
        const right = b.cells[column].dataset.sort
        const leftMissing = left === ''
        const rightMissing = right === ''
        if (leftMissing !== rightMissing) return leftMissing ? 1 : -1
        if (leftMissing) return 0
        const comparison = type === 'number'
          ? Number(left) - Number(right)
          : left.localeCompare(right, 'fi', { numeric: true, sensitivity: 'base' })
        return comparison * sortDirection
      })
      tbody.append(...rows)
      buttons.forEach((button, index) => button.textContent = button.dataset.label + (index === column ? (sortDirection === 1 ? ' ▲' : ' ▼') : ''))
    }
    buttons.forEach((button, column) => button.addEventListener('click', () => sortRows(column, button.dataset.type)))
    document.querySelector('#search').addEventListener('input', (event) => {
      const query = event.target.value.toLocaleLowerCase('fi').trim()
      let visible = 0
      for (const row of tbody.rows) {
        row.hidden = query && ![row.cells[0], row.cells[1], row.cells[2], row.cells[4]].some((cell) => cell.textContent.toLocaleLowerCase('fi').includes(query))
        if (!row.hidden) visible += 1
      }
      document.querySelector('#visible-count').textContent = visible + ' riviä'
    })
  </script>
</body>
</html>
`
}

function header(label, type) {
  return `<th><button type="button" data-label="${escapeHtml(label)}" data-type="${type}">${escapeHtml(label)}</button></th>`
}

function measurementCell(measurement) {
  if (!measurement) return '<td data-sort="">–</td>'
  const display = measurement.min === measurement.max
    ? formatNumber(measurement.min)
    : `${formatNumber(measurement.min)}–${formatNumber(measurement.max)}`
  return `<td data-sort="${measurement.max}">${measurement.approximate ? "≈ " : ""}${display}</td>`
}

function formatNumber(value) {
  return new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 3 }).format(value)
}

function linkValue(value, url) {
  const label = escapeHtml(value ?? "–")
  return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${label}</a>` : label
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character])
}

export function createMoundFeature({ id, source, site, mound }) {
  const properties = source.properties ?? {}
  const { areaM2, volumeM3 } = calculateDerivedMeasurements(mound)
  return {
    type: "Feature",
    id,
    geometry: structuredClone(source.geometry),
    properties: {
      id,
      mjtunnus: site.mjtunnus,
      sourceOrder: mound.sourceOrder,
      wfsFeatureId: source.id ?? null,
      name: properties.kohdenimi ?? null,
      municipality: properties.kunta ?? null,
      sourceUrl: properties.url ?? null,
      siteType: properties.Laji ?? null,
      types: properties.tyyppi ?? [],
      subtypes: properties.alatyyppi ?? [],
      datings: properties.ajoitus ?? [],
      lengthM: mound.lengthM,
      widthM: mound.widthM,
      diameterM: mound.diameterM,
      heightM: mound.heightM,
      areaM2,
      volumeM3,
      shape: mound.shape,
      status: mound.status,
      confidence: mound.confidence,
      missingMeasurements: MEASUREMENT_FIELDS.filter((field) => mound[field] === null),
      validationStatus: site.validation.status,
      validationIssues: site.validation.issues.map((issue) => issue.code),
      databaseSchemaVersion: DATABASE_SCHEMA_VERSION,
      analyzedAt: site.extraction?.createdAt ?? null,
      model: site.extraction?.model ?? null,
      promptVersion: site.extraction?.promptVersion ?? null,
      resultSchemaVersion: site.extraction?.resultSchemaVersion ?? null
    }
  }
}

export function calculateDerivedMeasurements(mound) {
  const footprint = calculateFootprint(mound)
  if (!footprint) return { areaM2: null, volumeM3: null }

  const areaM2 = {
    min: round(footprint.min),
    max: round(footprint.max),
    approximate: footprint.approximate,
    method: footprint.method
  }
  const volumeM3 = mound.heightM
    ? {
        min: round((2 / 3) * footprint.min * mound.heightM.min),
        max: round((2 / 3) * footprint.max * mound.heightM.max),
        approximate: footprint.approximate || mound.heightM.approximate,
        method: "half_ellipsoid"
      }
    : null
  return { areaM2, volumeM3 }
}

function calculateFootprint(mound) {
  if (mound.lengthM && mound.widthM) {
    return {
      min: Math.PI * mound.lengthM.min * mound.widthM.min / 4,
      max: Math.PI * mound.lengthM.max * mound.widthM.max / 4,
      approximate: mound.lengthM.approximate || mound.widthM.approximate,
      method: "ellipse"
    }
  }
  if (mound.diameterM) {
    return {
      min: Math.PI * mound.diameterM.min ** 2 / 4,
      max: Math.PI * mound.diameterM.max ** 2 / 4,
      approximate: mound.diameterM.approximate,
      method: "circle"
    }
  }
  return null
}

function round(value) {
  return Number(value.toFixed(3))
}

function validateGeometry(geometry, mjtunnus) {
  if (
    geometry?.type !== "Point" ||
    !Array.isArray(geometry.coordinates) ||
    geometry.coordinates.length < 2 ||
    !geometry.coordinates.slice(0, 2).every(Number.isFinite)
  ) {
    throw new Error(`Kohteen ${mjtunnus} geometria ei ole kelvollinen piste`)
  }
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"))
}

async function readJsonLines(file) {
  const contents = await fs.readFile(file, "utf8")
  return contents.split(/\r?\n/).filter((line) => line.trim()).map((line, index) => {
    try { return JSON.parse(line) }
    catch (error) { throw new Error(`${file}: virheellinen JSON rivillä ${index + 1}: ${error.message}`) }
  })
}

async function main() {
  const { report } = await run()
  console.log(`Valmis. Julkaistiin ${report.publishedMounds} röykkiötä ${report.publishedSites} kohteesta, joista ${report.publishedReviewSites} vaatii tarkistusta.`)
  console.log(`Tulos: ${DATA_PATHS.moundsDatabaseFile}`)
  console.log(`Tarkistusnäkymä: ${DATA_PATHS.moundsDatabaseHtmlFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1 })
}
