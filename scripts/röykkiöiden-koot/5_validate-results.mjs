#!/usr/bin/env node

import fs from "node:fs/promises"
import crypto from "node:crypto"
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
  const reviewEntries = reviewSites.map((item) =>
    createReviewEntry(
      item,
      sitesById.get(item.mjtunnus),
      siteMetadata.get(item.mjtunnus)
    )
  )
  await writeFileAtomic(paths.validatedResultsFile, validated.length ? `${validated.map(JSON.stringify).join("\n")}\n` : "")
  await writeJsonAtomic(paths.reviewFile, {
    schemaVersion: 1,
    generatedAt,
    sites: reviewEntries
  })
  await writeFileAtomic(
    paths.reviewHtmlFile ?? path.join(path.dirname(paths.reviewFile), "5_review.html"),
    renderReviewHtml({ generatedAt, report, sites: reviewEntries })
  )
  await writeJsonAtomic(paths.validationReportFile, report)
  return { validated, reviewSites, report }
}

export function renderReviewHtml({ generatedAt, report, sites }) {
  const issueCodes = [...new Set(sites.flatMap((site) => site.issues.map((issue) => issue.code)))].sort()
  const filters = issueCodes.map((code) =>
    `<label><input class="type-filter" type="checkbox" value="${escapeHtml(code)}" checked> ${escapeHtml(code)}</label>`
  ).join("\n")
  const siteCards = sites.length
    ? sites.map(renderSiteCard).join("\n")
    : '<p class="empty">Ei tarkistettavia kohteita.</p>'
  return `<!doctype html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Röykkiötietojen tarkistus</title>
  <style>
    :root { color-scheme: light; font-family: system-ui, sans-serif; background: #f4f1ea; color: #25231f; }
    body { max-width: 1500px; margin: 0 auto; padding: 24px; }
    header { margin-bottom: 24px; }
    h1, h2, h3 { margin-top: 0; }
    .summary, .site { background: white; border: 1px solid #d8d2c5; border-radius: 10px; box-shadow: 0 2px 8px #0001; }
    .summary { display: flex; gap: 24px; flex-wrap: wrap; padding: 14px 18px; }
    .site { margin: 22px 0; padding: 20px; }
    .site-head { display: flex; justify-content: space-between; gap: 20px; align-items: start; }
    .meta, .muted { color: #625d53; }
    .issues { margin: 12px 0 18px; padding: 0; list-style: none; }
    .issue { background: #fff2cf; border-left: 5px solid #d58b00; margin: 6px 0; padding: 8px 10px; }
    .issue.error { background: #ffe2df; border-color: #bd2c20; }
    .issue.acknowledged { background: #edf0eb; border-color: #78806f; color: #625d53; }
    .issue button { margin-left: 10px; }
    .filters { background: white; border: 1px solid #d8d2c5; border-radius: 10px; padding: 14px 18px; margin-top: 14px; }
    .filter-types { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 10px; }
    button { cursor: pointer; padding: 5px 9px; }
    .columns { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 22px; }
    .description { white-space: pre-wrap; line-height: 1.55; background: #faf8f3; padding: 14px; border-radius: 6px; }
    .mound { border: 1px solid #ddd7ca; border-radius: 7px; padding: 12px; margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { text-align: left; vertical-align: top; padding: 5px 8px; border-bottom: 1px solid #eee9df; }
    th { width: 34%; color: #625d53; }
    blockquote { margin: 7px 0; padding: 8px 10px; border-left: 4px solid #8b8171; background: #f7f5f0; }
    a { color: #075a9c; }
    .notes { background: #edf4ff; padding: 10px 14px; border-radius: 6px; }
    @media (max-width: 900px) { .columns { grid-template-columns: 1fr; } .site-head { display: block; } }
  </style>
</head>
<body>
  <header>
    <h1>Röykkiötietojen tarkistus</h1>
    <p class="muted">Luotu ${escapeHtml(generatedAt)}</p>
    <div class="summary">
      <span><strong>${report.totalSites}</strong> kohdetta</span>
      <span><strong>${report.acceptedSites}</strong> hyväksytty</span>
      <span><strong>${report.reviewSites}</strong> tarkistettava</span>
      <span><strong>${report.invalidSites}</strong> virheellinen</span>
    </div>
    <div class="filters">
      <strong>Suodatus</strong>
      <label><input id="only-new" type="checkbox" checked> Näytä vain kuittaamattomat havainnot</label>
      <div class="filter-types">${filters || "Ei havaintotyyppejä"}</div>
    </div>
  </header>
  <main>${siteCards}</main>
  <script>
    const acknowledged = new Set()
    async function loadAcknowledgements() {
      try {
        const response = await fetch('/api/acknowledgements')
        if (!response.ok) throw new Error()
        const data = await response.json()
        for (const id of Object.keys(data.acknowledgements || {})) acknowledged.add(id)
      } catch {
        document.body.insertAdjacentHTML('afterbegin', '<p class="issue error">Kuittaukset toimivat vain komennolla npm run review käynnistetyssä näkymässä.</p>')
      }
      applyFilters()
    }
    async function toggleAcknowledgement(button) {
      const issue = button.closest('.issue')
      const id = issue.dataset.observationId
      const wasAcknowledged = acknowledged.has(id)
      const response = await fetch('/api/acknowledgements/' + encodeURIComponent(id), {
        method: wasAcknowledged ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!response.ok) return window.alert('Kuittauksen tallentaminen epäonnistui.')
      if (wasAcknowledged) acknowledged.delete(id); else acknowledged.add(id)
      applyFilters()
    }
    function applyFilters() {
      const selected = new Set([...document.querySelectorAll('.type-filter:checked')].map((item) => item.value))
      const onlyNew = document.querySelector('#only-new').checked
      for (const issue of document.querySelectorAll('.issue[data-observation-id]')) {
        const isAcknowledged = acknowledged.has(issue.dataset.observationId)
        issue.classList.toggle('acknowledged', isAcknowledged)
        issue.querySelector('button').textContent = isAcknowledged ? 'Palauta uudeksi' : 'Kuittaa'
        issue.hidden = !selected.has(issue.dataset.issueCode) || (onlyNew && isAcknowledged)
      }
      for (const site of document.querySelectorAll('.site')) {
        site.hidden = ![...site.querySelectorAll('.issue[data-observation-id]')].some((issue) => !issue.hidden)
      }
    }
    document.querySelectorAll('.type-filter, #only-new').forEach((input) => input.addEventListener('change', applyFilters))
    document.querySelectorAll('.acknowledge').forEach((button) => button.addEventListener('click', () => toggleAcknowledgement(button)))
    loadAcknowledgements()
  </script>
</body>
</html>
`
}

function renderSiteCard(site) {
  const title = [site.name, site.municipality].filter(Boolean).join(", ") || "Nimetön kohde"
  const link = site.sourceUrl
    ? `<a href="${escapeHtml(site.sourceUrl)}" target="_blank" rel="noreferrer">Avaa Kyppi-sivu</a>`
    : "Lähdelinkki puuttuu"
  const issues = site.issues.map((issue) =>
    `<li class="issue ${issue.severity === "error" ? "error" : ""}" data-observation-id="${escapeHtml(issue.observationId)}" data-issue-code="${escapeHtml(issue.code)}"><strong>${escapeHtml(issue.code)}</strong>: ${escapeHtml(issue.message)} <button type="button" class="acknowledge">Kuittaa</button></li>`
  ).join("")
  const mounds = site.extractedData.mounds.map(renderMound).join("") || "<p>Ei poimittuja röykkiöitä.</p>"
  const notes = site.extractedData.notes.length
    ? `<div class="notes"><strong>Mallin muistiinpanot</strong><ul>${site.extractedData.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul></div>`
    : ""
  return `<article class="site">
    <div class="site-head">
      <div><h2>${escapeHtml(title)}</h2><div class="meta">mjtunnus ${escapeHtml(site.mjtunnus)} · ilmoitettu määrä ${escapeHtml(displayValue(site.extractedData.statedMoundCount))} · poimittu ${site.extractedData.mounds.length}</div></div>
      <div>${link}</div>
    </div>
    <ul class="issues">${issues}</ul>
    <div class="columns">
      <section><h3>Alkuperäinen kuvaus</h3><div class="description">${escapeHtml(site.sourceData?.description ?? "Kuvaus puuttuu")}</div></section>
      <section><h3>Poimittu tulos</h3>${notes}${mounds}</section>
    </div>
  </article>`
}

function renderMound(mound) {
  const evidence = mound.evidence.length
    ? mound.evidence.map((item) => `<blockquote>${escapeHtml(item)}</blockquote>`).join("")
    : '<p class="muted">Ei lähdekatkelmia.</p>'
  return `<div class="mound">
    <h3>Röykkiö ${mound.sourceOrder}</h3>
    <table>
      <tr><th>Pituus</th><td>${formatMeasurement(mound.lengthM)}</td></tr>
      <tr><th>Leveys</th><td>${formatMeasurement(mound.widthM)}</td></tr>
      <tr><th>Halkaisija</th><td>${formatMeasurement(mound.diameterM)}</td></tr>
      <tr><th>Korkeus</th><td>${formatMeasurement(mound.heightM)}</td></tr>
      <tr><th>Muoto</th><td>${escapeHtml(displayValue(mound.shape))}</td></tr>
      <tr><th>Tila</th><td>${escapeHtml(displayValue(mound.status))}</td></tr>
      <tr><th>Varmuus</th><td>${escapeHtml(mound.confidence)}</td></tr>
      <tr><th>Mallin tarkistuspyyntö</th><td>${mound.needsReview ? "kyllä" : "ei"}</td></tr>
    </table>
    <h3>Lähdekatkelmat</h3>${evidence}
  </div>`
}

function formatMeasurement(measurement) {
  if (!measurement) return "–"
  const value = measurement.min === measurement.max
    ? measurement.min
    : `${measurement.min}–${measurement.max}`
  return `${measurement.approximate ? "noin " : ""}${escapeHtml(value)} m`
}

function displayValue(value) { return value === null || value === undefined || value === "" ? "–" : String(value) }
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character])
}

export function createReviewEntry(extraction, site, metadata) {
  const resultFingerprint = crypto.createHash("sha256").update(JSON.stringify({
    statedMoundCount: extraction.statedMoundCount,
    mounds: extraction.mounds,
    notes: extraction.notes
  })).digest("hex")
  return {
    mjtunnus: extraction.mjtunnus,
    name: metadata?.name ?? null,
    municipality: metadata?.municipality ?? null,
    sourceUrl: metadata?.url ?? site?.source?.finalUrl ?? site?.source?.sourceUrl ?? null,
    status: extraction.validation.status,
    issues: extraction.validation.issues.map((issue) => ({
      ...issue,
      observationId: crypto.createHash("sha256").update(JSON.stringify({
        mjtunnus: extraction.mjtunnus,
        code: issue.code,
        message: issue.message,
        resultFingerprint
      })).digest("hex")
    })),
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
  console.log(`Tarkistusnäkymä: ${DATA_PATHS.reviewHtmlFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1 })
}
