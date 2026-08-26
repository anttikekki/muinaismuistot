#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { runJson } from "./lib/commands.mjs"
import { assertValid, runValidation } from "./lib/diagnostics.mjs"
import { buildDirectory } from "./lib/project-paths.mjs"
import { countIdentitiesByLayer, parseIdentityTsv, setDifference } from "./lib/rules.mjs"

export async function validateIdentities({
  archive = resolve(buildDirectory, "museovirasto.pmtiles"),
  pmtilesInput = resolve(buildDirectory, "pmtiles-input-identities.tsv"),
  d1Input = resolve(buildDirectory, "feature-details-identities.tsv"),
  d1Report = resolve(buildDirectory, "feature-details-report.json"),
} = {}) {
  const [pmtilesInputText, d1InputText, d1ReportText] = await Promise.all([
    readFile(pmtilesInput, "utf8"), readFile(d1Input, "utf8"), readFile(d1Report, "utf8"),
  ])
  const pmtilesInputs = parseIdentityTsv(pmtilesInputText)
  const d1Identities = parseIdentityTsv(d1InputText)
  const missingFromD1Inputs = setDifference(pmtilesInputs, d1Identities)
  const missingFromPmtilesInputs = setDifference(d1Identities, pmtilesInputs)
  assertValid(missingFromD1Inputs.length === 0 && missingFromPmtilesInputs.length === 0,
    `PMTiles and D1 build input identities differ; missing from D1=${missingFromD1Inputs.slice(0, 20).join(", ") || "none"}; missing from PMTiles=${missingFromPmtilesInputs.slice(0, 20).join(", ") || "none"}`)

  const d1BuildReport = JSON.parse(d1ReportText)
  assertValid(d1Identities.size === Number(d1BuildReport.d1Rows),
    `D1 identity count differs from build report: identities=${d1Identities.size} report=${d1BuildReport.d1Rows}`)

  const decoded = runJson("tippecanoe-decode", [archive, "0", "0", "0"])
  const zoomZeroRows = []
  for (const layer of decoded.features ?? []) {
    for (const feature of layer.features ?? []) zoomZeroRows.push(`${layer.properties.layer}\t${feature.id}`)
  }
  const zoomZeroIdentities = parseIdentityTsv(`${zoomZeroRows.join("\n")}\n`)
  const missingZoomZeroFromD1 = setDifference(zoomZeroIdentities, d1Identities)
  assertValid(missingZoomZeroFromD1.length === 0,
    `PMTiles zoom 0 contains identities missing from D1: ${missingZoomZeroFromD1.slice(0, 20).join(", ")}`)

  const output = resolve(buildDirectory, "pmtiles-d1-identity-report.json")
  const report = {
    schemaVersion: 2, status: "ok", pmtilesBuildInputIdentities: pmtilesInputs.size,
    d1Identities: d1Identities.size, buildInputIdentityDifference: 0,
    pmtilesZoomZeroIdentities: zoomZeroIdentities.size, pmtilesIdentitiesMissingFromD1: 0,
    layers: { pmtilesZoomZero: countIdentitiesByLayer(zoomZeroIdentities), d1: countIdentitiesByLayer(d1Identities) },
  }
  await mkdir(buildDirectory, { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  process.stdout.write(`PMTiles build inputs and D1 identities match: ${pmtilesInputs.size}\nEvery zoom 0 PMTiles identity has a D1 row: ${zoomZeroIdentities.size}\nReport: ${output}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) runValidation(() => validateIdentities({
  archive: process.argv[2] ? resolve(process.argv[2]) : undefined,
  pmtilesInput: process.argv[3] ? resolve(process.argv[3]) : undefined,
  d1Input: process.argv[4] ? resolve(process.argv[4]) : undefined,
  d1Report: process.argv[5] ? resolve(process.argv[5]) : undefined,
}))
