#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises"
import { resolve } from "node:path"
import { runCommand, runJson } from "./lib/commands.mjs"
import { assertValid, formatValues, runValidation } from "./lib/diagnostics.mjs"
import { buildDirectory, mappingPath, vocabularyPath } from "./lib/project-paths.mjs"

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, stable(item)]))
  return value
}

export async function validatePmtiles(archive = resolve(buildDirectory, "museovirasto.pmtiles")) {
  assertValid((await stat(archive)).size > 0, `PMTiles archive is empty: ${archive}`)
  const [mapping, vocabulary] = await Promise.all([
    readFile(mappingPath, "utf8").then(JSON.parse), readFile(vocabularyPath, "utf8").then(JSON.parse),
  ])
  runCommand("pmtiles", ["verify", archive])
  const metadata = runJson("pmtiles", ["show", "--metadata", archive])
  const expectedLayers = mapping.physicalLayers.map(({ mvtSourceLayer }) => mvtSourceLayer).sort()
  const actualLayers = (metadata.vector_layers ?? []).map(({ id }) => id).sort()
  assertValid(JSON.stringify(actualLayers) === JSON.stringify(expectedLayers),
    `PMTiles source layers differ: expected=${formatValues(expectedLayers)} actual=${formatValues(actualLayers)}`)
  assertValid(Number(metadata.tilestats?.layerCount) === expectedLayers.length,
    `PMTiles tilestats layer count differs: expected=${expectedLayers.length} actual=${metadata.tilestats?.layerCount ?? "missing"}`)

  const expectedFields = Object.fromEntries(expectedLayers.map((layer) => [layer, {}]))
  expectedFields.archaeological_areas = { laji_key: "Number" }
  expectedFields.archaeological_points = { dating_mask: "Number", laji_key: "Number", subtype_codes: "String", type_mask: "Number" }
  const actualFields = Object.fromEntries((metadata.vector_layers ?? []).map(({ id, fields }) => [id, fields]))
  assertValid(JSON.stringify(stable(actualFields)) === JSON.stringify(stable(expectedFields)),
    `PMTiles compact field schema differs: expected=${JSON.stringify(stable(expectedFields))} actual=${JSON.stringify(stable(actualFields))}`)

  const decoded = runJson("tippecanoe-decode", [archive, "0", "0", "0"])
  const decodedByLayer = new Map((decoded.features ?? []).map((layer) => [layer.properties.layer, layer.features ?? []]))
  for (const stats of metadata.tilestats?.layers ?? []) {
    if (!stats.layer.endsWith("_areas")) continue
    const expectedCount = Number(stats.count) / 2
    const features = decodedByLayer.get(stats.layer) ?? []
    const geometryTypes = [...new Set(features.map(({ geometry }) => geometry?.type))].sort()
    assertValid(features.length === expectedCount && JSON.stringify(geometryTypes) === '["Point"]',
      `low-zoom centroid mismatch for ${stats.layer}: expected=${expectedCount} actual=${features.length} geometryTypes=${JSON.stringify(geometryTypes)}`)
  }

  const archaeologicalStats = (metadata.tilestats?.layers ?? []).filter(({ layer }) => ["archaeological_areas", "archaeological_points"].includes(layer))
  const invalidKinds = archaeologicalStats.flatMap(({ attributes = [] }) => attributes
    .filter(({ attribute }) => attribute === "laji_key")
    .flatMap(({ values = [] }) => values)
    .filter((value) => !Number.isInteger(value) || value < 1 || value > Object.keys(vocabulary.kinds).length))
  assertValid(invalidKinds.length === 0, `PMTiles contains invalid archaeological laji_key codes: ${JSON.stringify(invalidKinds)}`)

  for (const layer of mapping.physicalLayers.filter(({ geometryType }) => geometryType === "POINT")) {
    const expectedCount = Number((metadata.tilestats?.layers ?? []).find(({ layer: id }) => id === layer.mvtSourceLayer)?.count ?? -1)
    const actualCount = (decodedByLayer.get(layer.mvtSourceLayer) ?? []).length
    assertValid(actualCount === expectedCount,
      `point retention mismatch at zoom 0 for ${layer.id}: expected=${expectedCount} actual=${actualCount}`)
  }

  process.stdout.write([
    "PMTiles archive is structurally valid.", `Archive: ${archive}`, `Archive bytes: ${(await stat(archive)).size}`,
    `Source layers: ${actualLayers.length}`, "All point features retained at zoom 0: yes",
    "Compact field schema: valid", "All area layers represented by centroids at zoom 0: yes",
    `Layers: ${actualLayers.join(", ")}`, `PMTiles CLI: ${runCommand("pmtiles", ["version"]).trim()}`, "",
  ].join("\n"))
}

if (import.meta.url === `file://${process.argv[1]}`) runValidation(() => validatePmtiles(process.argv[2] ? resolve(process.argv[2]) : undefined))
