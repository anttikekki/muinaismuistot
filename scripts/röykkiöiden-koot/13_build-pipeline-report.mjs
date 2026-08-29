#!/usr/bin/env node

import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { readJsonIfExists, writeFileAtomic, writeJsonAtomic } from "./lib/files.mjs"
import { createResultComparison } from "./lib/result-comparison.mjs"

const SOURCES = [
  ["step7", "Vaihe 7 · aineistolinkit", "documentIndexFile"],
  ["step8", "Vaihe 8 · PDF-lataukset", "documentDownloadManifestFile"],
  ["step9", "Vaihe 9 · lähdekatkelmat", "documentPassagesReportFile"],
  ["coverage", "Vaihe 9 · kattavuus", "documentCoverageReportFile"],
  ["step10", "Vaihe 10 · LLM-poiminta", "reportExtractionReportFile"],
  ["step11", "Vaihe 11 · validointi", "reportValidationReportFile"],
  ["step12", "Vaihe 12 · lopputulos", "finalReportBuildReportFile"]
]

export async function run({ paths = DATA_PATHS, now = () => new Date() } = {}) {
  const [inputs, descriptionResults, pdfResults] = await Promise.all([
    Promise.all(SOURCES.map(async ([key, , pathKey]) => [key, await readJsonIfExists(paths[pathKey])])).then(Object.fromEntries),
    readJsonLinesIfExists(paths.validatedResultsFile),
    readJsonLinesIfExists(paths.validatedReportResultsFile)
  ])
  const comparison = createResultComparison(descriptionResults, pdfResults)
  const report = createPipelineReport(inputs, now().toISOString(), comparison)
  await writeJsonAtomic(paths.pipelineReportFile, report)
  await writeFileAtomic(paths.pipelineReportHtmlFile, renderPipelineReportHtml(report))
  return report
}

export function createPipelineReport(inputs, generatedAt, comparison = null) {
  const missing = SOURCES.filter(([key]) => !inputs[key]).map(([, label]) => label)
  const step7 = inputs.step7
  const step8 = inputs.step8
  const step9 = inputs.step9
  const coverage = inputs.coverage
  const step10 = inputs.step10
  const step11 = inputs.step11
  const step12 = inputs.step12
  const warnings = []
  if (step7 && step9 && step7.sites?.length !== step9.selectedSites) warnings.push(`Vaiheessa 7 on ${step7.sites?.length ?? 0} kohdetta, mutta vaiheessa 9 ${step9.selectedSites}.`)
  if (coverage && step10 && coverage.counts?.ready_for_llm !== step10.selectedSites) warnings.push(`LLM-valmiita kohteita on ${coverage.counts?.ready_for_llm ?? 0}, mutta vaihe 10 valitsi ${step10.selectedSites}.`)
  if (step10 && step11 && step10.outputSites !== step11.totalSites) warnings.push(`Vaihe 10 tuotti ${step10.outputSites} kohdetta, mutta vaihe 11 käsitteli ${step11.totalSites}.`)
  if (step11 && step12 && step11.totalMounds !== step12.totalMounds) warnings.push(`Vaiheessa 11 on ${step11.totalMounds} röykkiötä, mutta vaiheessa 12 ${step12.totalMounds}.`)
  if (missing.length) warnings.push(`Puuttuvat raportit: ${missing.join(", ")}.`)

  const timestamps = SOURCES.flatMap(([key, label]) => inputs[key]?.generatedAt ? [{ key, label, generatedAt: inputs[key].generatedAt }] : [])
  for (let index = 1; index < timestamps.length; index += 1) {
    if (Date.parse(timestamps[index].generatedAt) < Date.parse(timestamps[index - 1].generatedAt)) {
      warnings.push(`${timestamps[index].label} on vanhempi kuin sitä edeltävä raportti.`)
    }
  }

  return {
    schemaVersion: 1,
    generatedAt,
    status: missing.length ? "incomplete" : warnings.length ? "warning" : "complete",
    warnings,
    comparison: comparison ? {
      ...comparison,
      siteLabels: Object.fromEntries((step7?.sites ?? []).map((site) => [site.mjtunnus, [site.kohdenimi, site.kunta].filter(Boolean).join(" · ") || site.mjtunnus]))
    } : null,
    stages: {
      documents: {
        selectedSites: step7?.sites?.length ?? null,
        linkedRecords: step7?.records?.length ?? null,
        selectedRecords: step8?.summary?.selectedRecords ?? null,
        recordPagesDownloaded: step8?.summary?.recordPagesDownloaded ?? null,
        documentsDownloaded: step8?.summary?.documentsDownloaded ?? null,
        documentsReused: step8?.summary?.documentsSkipped ?? null,
        downloadFailures: step8?.summary?.failed ?? null
      },
      passages: {
        sitesWithPassages: step9?.sitesWithPassages ?? null,
        sitesWithoutPassages: Number.isInteger(step9?.selectedSites) && Number.isInteger(step9?.sitesWithPassages) ? step9.selectedSites - step9.sitesWithPassages : null,
        documentsMatched: step9?.documentsMatched ?? null,
        documentsWithoutMatch: step9?.documentsWithoutMatch ?? null,
        pagesExtracted: step9?.pagesExtracted ?? null,
        coverage: coverage?.counts ?? null
      },
      extraction: {
        selectedSites: step10?.selectedSites ?? null,
        successfulSites: step10?.successfulSites ?? null,
        failedSites: step10?.failedSites ?? null,
        apiCalls: step10?.apiCalls ?? null,
        candidateResponsesReused: step10?.reusedResponses ?? null,
        cacheHits: step10?.cacheHits ?? null,
        model: step10?.model ?? null
      },
      validation: {
        totalSites: step11?.totalSites ?? null,
        acceptedSites: step11?.acceptedSites ?? null,
        reviewSites: step11?.reviewSites ?? null,
        invalidSites: step11?.invalidSites ?? null,
        totalMounds: step11?.totalMounds ?? null,
        issueCounts: step11?.issueCounts ?? null
      },
      publication: {
        publishedSites: step12?.publishedSites ?? null,
        publishedMounds: step12?.publishedMounds ?? null,
        automaticAcceptedMounds: step12?.automaticAcceptedMounds ?? null,
        humanAcceptedMounds: step12?.humanAcceptedMounds ?? null,
        pendingReviewMounds: step12?.pendingReviewMounds ?? null,
        permanentlySkippedMounds: step12?.permanentlySkippedMounds ?? null,
        invalidMounds: step12?.invalidMounds ?? null
      }
    },
    stageTimestamps: Object.fromEntries(timestamps.map(({ key, generatedAt: value }) => [key, value]))
  }
}

export function renderPipelineReportHtml(report) {
  const sections = [
    ["Aineistolinkit ja PDF:t", report.stages.documents, { selectedSites: "Valitut kohteet", linkedRecords: "Linkitetyt tietueet", selectedRecords: "Ladattavat tietueet", recordPagesDownloaded: "Ladatut tietuesivut", documentsDownloaded: "Ladatut PDF:t", documentsReused: "Uudelleenkäytetyt PDF:t", downloadFailures: "Latausvirheet" }],
    ["Lähdekatkelmat", report.stages.passages, { sitesWithPassages: "Kohteita katkelmilla", sitesWithoutPassages: "Kohteita ilman katkelmia", documentsMatched: "Täsmänneet dokumentit", documentsWithoutMatch: "Dokumentit ilman osumaa", pagesExtracted: "Poimitut sivut" }],
    ["LLM-poiminta", report.stages.extraction, { selectedSites: "Valitut kohteet", successfulSites: "Onnistuneet", failedSites: "Virheet", apiCalls: "API-kutsut", candidateResponsesReused: "Tallennetut vastaukset", cacheHits: "Välimuistiosumat", model: "Malli" }],
    ["Validointi", report.stages.validation, { totalSites: "Kohteita", acceptedSites: "Automaattisesti hyväksytyt kohteet", reviewSites: "Tarkistettavat kohteet", invalidSites: "Virheelliset kohteet", totalMounds: "Röykkiöitä" }],
    ["Lopputulos", report.stages.publication, { publishedSites: "Julkaistut kohteet", publishedMounds: "Julkaistut röykkiöt", automaticAcceptedMounds: "Automaattisesti hyväksytyt röykkiöt", humanAcceptedMounds: "Käsin hyväksytyt röykkiöt", pendingReviewMounds: "Odottaa tarkistusta", permanentlySkippedMounds: "Pysyvästi ohitetut", invalidMounds: "Virheelliset" }]
  ]
  const cards = sections.map(([title, values, labels]) => `<section><h2>${esc(title)}</h2><dl>${Object.entries(labels).map(([key, label]) => `<div><dt>${esc(label)}</dt><dd>${display(values[key])}</dd></div>`).join("")}</dl></section>`).join("")
  const coverage = report.stages.passages.coverage ? `<section><h2>Kattavuusluokat</h2><dl>${Object.entries(report.stages.passages.coverage).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${display(value)}</dd></div>`).join("")}</dl></section>` : ""
  const issues = report.stages.validation.issueCounts ? `<section><h2>Tarkistushavainnot</h2><dl>${Object.entries(report.stages.validation.issueCounts).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${display(value)}</dd></div>`).join("")}</dl></section>` : ""
  const comparison = renderComparison(report.comparison)
  const warnings = report.warnings.length ? `<div class="warnings"><h2>Huomiot</h2><ul>${report.warnings.map((warning) => `<li>${esc(warning)}</li>`).join("")}</ul></div>` : `<p class="ok">Kaikki vaiheet löytyvät ja lukumäärät ovat keskenään johdonmukaiset.</p>`
  return `<!doctype html><html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Raporttiputken koeajo</title><style>
body{font-family:system-ui;max-width:1150px;margin:auto;padding:24px;background:#f4f1ea;color:#25231f}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px}section,.warnings,.ok{background:white;border:1px solid #d8d2c5;border-radius:10px;padding:18px}.warnings{border-left:6px solid #c77d00}.ok{border-left:6px solid #397b42}h2{margin-top:0}dl{margin:0}dl div{display:flex;justify-content:space-between;gap:16px;border-top:1px solid #eee;padding:8px 0}dt{color:#625d53}dd{font-weight:700;margin:0;text-align:right}.meta{color:#625d53}.comparison{margin-top:18px}.comparison-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}.comparison table{border-collapse:collapse;width:100%;margin:10px 0}.comparison th,.comparison td{border:1px solid #ddd;padding:8px;text-align:left}.comparison td:last-child{text-align:right;font-weight:700}.site-list{line-height:1.8}.site-list a{white-space:nowrap}.explanation{color:#625d53}
</style></head><body><h1>Raporttiputken koeajo</h1><p class="meta">Tila: ${esc(report.status)} · koottu ${esc(formatDate(report.generatedAt))}</p>${warnings}<div class="grid">${cards}${coverage}${issues}</div>${comparison}</body></html>`
}

function renderComparison(comparison) {
  if (!comparison) return ""
  const summary = {
    pdfSites: "PDF-analysoidut kohteet",
    comparableSites: "Vertailukelpoiset kohteet",
    missingDescriptionSites: "Description-tulos puuttuu",
    sameMoundCountSites: "Sama röykkiömäärä",
    differentMoundCountSites: "Eri röykkiömäärä",
    sameMeasurementSites: "Kaikki mitat yhtenevät",
    differentMeasurementSites: "Mitta-arvoissa eroja",
    unpairedMeasurementSites: "Mitat jätetty parittamatta",
    differentApproximationSites: "Arvioituusmerkinnöissä eroja",
    sameStatusSites: "Sama tarkistustila",
    differentStatusSites: "Eri tarkistustila"
  }
  const summaryCard = `<div><h3>Yhteenveto</h3><dl>${Object.entries(summary).map(([key, label]) => `<div><dt>${esc(label)}</dt><dd>${display(comparison[key])}</dd></div>`).join("")}</dl></div>`
  const matrixRows = Object.entries(comparison.statusMatrix ?? {}).sort().map(([key, count]) => {
    const [description, pdf] = key.split("|")
    return `<tr><td>${esc(statusLabel(description))}</td><td>${esc(statusLabel(pdf))}</td><td>${display(count)}</td></tr>`
  }).join("")
  const matrix = `<div><h3>Tarkistustilojen vertailu</h3><table><thead><tr><th>Description</th><th>PDF</th><th>Kohteita</th></tr></thead><tbody>${matrixRows || "<tr><td colspan=\"3\">Ei vertailutietoja.</td></tr>"}</tbody></table><p class="explanation">Tilat ovat automaattisen validoinnin tuloksia ennen käsin tehtyjä kuittauksia.</p></div>`
  const lists = `<div><h3>Poikkeavat kohteet</h3>${siteList("Röykkiömäärä eroaa", comparison.lists?.moundCountDifference, comparison.siteLabels)}${siteList("Mitta-arvot eroavat", comparison.lists?.measurementDifference, comparison.siteLabels)}${siteList("Arvioituusmerkintä eroaa", comparison.lists?.approximationDifference, comparison.siteLabels)}${siteList("Tarkistustila eroaa", comparison.lists?.statusDifference, comparison.siteLabels)}</div>`
  return `<section class="comparison"><h2>Description- ja PDF-päätelmien vertailu</h2><p class="explanation">Mittoja verrataan röykkiökohtaisesti vain silloin, kun molemmat menetelmät ilmoittavat saman röykkiömäärän. Avaa kohde tarkistusnäkymässä nähdäksesi rinnakkaiset päätelmät.</p><div class="comparison-grid">${summaryCard}${matrix}${lists}</div></section>`
}

function siteList(label, ids = [], labels = {}) {
  const links = ids.map((id) => `<a href="../intermediate/11_report-review.html#site-${encodeURIComponent(id)}">${esc(labels[id] ? `${labels[id]} (${id})` : id)}</a>`).join(", ")
  return `<h4>${esc(label)} (${ids.length})</h4><p class="site-list">${links || "Ei kohteita."}</p>`
}

function statusLabel(status) { return ({ accepted: "hyväksytty", review: "tarkistettava", invalid: "virheellinen" })[status] ?? status ?? "ei tulosta" }
async function readJsonLinesIfExists(file) {
  if (!file) return []
  try {
    const fs = await import("node:fs/promises")
    return (await fs.readFile(file, "utf8")).split(/\r?\n/).filter((line) => line.trim()).map(JSON.parse)
  } catch (error) { if (error.code === "ENOENT") return []; throw error }
}

function display(value) { return value == null ? "–" : esc(value) }
function formatDate(value) { return new Intl.DateTimeFormat("fi-FI", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(value)) }
function esc(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]) }

async function main() {
  const report = await run()
  console.log(`Valmis. Tila ${report.status}, huomioita ${report.warnings.length}.`)
  console.log(`Koeajoraportti: ${DATA_PATHS.pipelineReportHtmlFile}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
