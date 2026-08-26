#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { quoteSqlIdentifier, runJson } from "./lib/commands.mjs"
import { assertValid, runValidation } from "./lib/diagnostics.mjs"
import { buildConfigPath, buildDirectory, mappingPath, sourceDirectory } from "./lib/project-paths.mjs"
import { normalizeGeometryType, validateGeometryFamily } from "./lib/rules.mjs"

async function exists(path) {
  try { return (await stat(path)).isFile() } catch { return false }
}

function layerFromOgr(document, layerId) {
  const layer = document.layers?.[0]
  assertValid(layer, `ogrinfo returned no layer metadata for ${layerId}`)
  return layer
}

function observedGeometryTypes(sourceFile, sourceLayer, geometryColumn) {
  const table = quoteSqlIdentifier(sourceLayer)
  const geometry = quoteSqlIdentifier(geometryColumn)
  const document = runJson("ogrinfo", ["-ro", "-json", "-features", "-dialect", "SQLite", "-sql",
    `SELECT GeometryType(${geometry}) AS geometry_type, COUNT(*) AS feature_count FROM ${table} WHERE ${geometry} IS NOT NULL GROUP BY GeometryType(${geometry})`, sourceFile])
  return (document.layers?.[0]?.features ?? []).map(({ properties }) => ({
    geometryType: normalizeGeometryType(properties.geometry_type),
    count: Number(properties.feature_count),
  }))
}

export async function validateSourceData(dataDirectory = sourceDirectory) {
  const mapping = JSON.parse(await readFile(mappingPath, "utf8"))
  const config = JSON.parse(await readFile(buildConfigPath, "utf8"))
  const configById = new Map(config.layers.map((layer) => [layer.id, layer]))
  const reports = []

  for (const layer of mapping.physicalLayers) {
    const sourceFile = resolve(dataDirectory, layer.geoPackageFile)
    assertValid(await exists(sourceFile), `missing source GeoPackage for ${layer.id}: ${sourceFile}`)
    const buildLayer = configById.get(layer.id)
    assertValid(buildLayer, `missing build configuration for ${layer.id}`)

    const metadata = layerFromOgr(runJson("ogrinfo", ["-ro", "-so", "-json", sourceFile, layer.geoPackageLayer]), layer.id)
    const geometryField = metadata.geometryFields?.[0]
    const total = Number(metadata.featureCount ?? 0)
    const declaredGeometry = normalizeGeometryType(geometryField?.type)
    const authority = geometryField?.coordinateSystem?.projjson?.id
    assertValid(total > 0, `source layer is empty: ${layer.id}`)
    assertValid(authority?.authority === "EPSG" && Number(authority.code) === 3067,
      `coordinate system changed in ${layer.id}: expected EPSG:3067, got ${authority?.authority ?? "missing"}:${authority?.code ?? "missing"}`)

    let observed = []
    if (declaredGeometry !== normalizeGeometryType(layer.geometryType)) {
      observed = observedGeometryTypes(sourceFile, layer.geoPackageLayer, geometryField?.name ?? "geom")
    }
    try {
      validateGeometryFamily(layer.geometryType, declaredGeometry, observed)
    } catch (error) {
      throw new Error(`geometry mismatch in ${layer.id}: ${error.message}`)
    }

    const table = quoteSqlIdentifier(layer.geoPackageLayer)
    const geometry = quoteSqlIdentifier(geometryField?.name ?? "geom")
    const countsDocument = runJson("ogrinfo", ["-ro", "-json", "-features", "-dialect", "SQLite", "-sql",
      `SELECT COUNT(*) AS total_count, SUM(CASE WHEN ${geometry} IS NULL THEN 1 ELSE 0 END) AS null_count, SUM(CASE WHEN ${geometry} IS NOT NULL AND ST_IsValid(${geometry}) = 0 THEN 1 ELSE 0 END) AS invalid_count FROM ${table}`, sourceFile])
    const counts = countsDocument.layers?.[0]?.features?.[0]?.properties ?? {}
    const nullCount = Number(counts.null_count ?? 0)
    const invalidCount = Number(counts.invalid_count ?? 0)
    const allowedNull = Number(buildLayer.excludedNullGeometries ?? 0)
    assertValid(nullCount === allowedNull, `unexpected null geometries in ${layer.id}: expected=${allowedNull} actual=${nullCount}`)
    assertValid(invalidCount === 0, `invalid geometries in ${layer.id}: ${invalidCount}`)
    reports.push({ id: layer.id, rows: total, declaredGeometry, observedGeometryTypes: observed, nullGeometries: nullCount, invalidGeometries: invalidCount, crs: "EPSG:3067" })
  }

  await mkdir(buildDirectory, { recursive: true })
  const output = resolve(buildDirectory, "source-validation-report.json")
  await writeFile(output, `${JSON.stringify({ schemaVersion: 1, status: "ok", layers: reports }, null, 2)}\n`)
  process.stdout.write(`Source data is valid: ${reports.length} non-empty EPSG:3067 layers with expected geometry types.\nReport: ${output}\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) runValidation(() => validateSourceData(process.argv[2] ? resolve(process.argv[2]) : sourceDirectory))
