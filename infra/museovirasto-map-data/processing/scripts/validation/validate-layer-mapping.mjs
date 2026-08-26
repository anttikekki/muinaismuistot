#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises"
import { resolve } from "node:path"
import { quoteSqlIdentifier, runCommand, runJson } from "./lib/commands.mjs"
import { assertValid, formatValues, runValidation } from "./lib/diagnostics.mjs"
import { buildConfigPath, mappingPath, repositoryDirectory, sourceDirectory } from "./lib/project-paths.mjs"
import { duplicateValues, normalizeGeometryType, validateGeometryFamily } from "./lib/rules.mjs"

async function fileExists(path) {
  try { return (await stat(path)).isFile() } catch { return false }
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right)
}

export async function validateLayerMapping(dataDirectory = sourceDirectory, selectedMappingPath = mappingPath) {
  const [mapping, config] = await Promise.all([
    readFile(selectedMappingPath, "utf8").then(JSON.parse), readFile(buildConfigPath, "utf8").then(JSON.parse),
  ])
  assertValid(mapping.physicalLayers?.length === 12, `expected 12 physical layers, got ${mapping.physicalLayers?.length ?? 0}`)
  assertValid(mapping.logicalLayers?.length === 26, `expected 26 logical layers, got ${mapping.logicalLayers?.length ?? 0}`)
  for (const [label, values] of [
    ["physical layer IDs", mapping.physicalLayers.map(({ id }) => id)],
    ["MVT source layers", mapping.physicalLayers.map(({ mvtSourceLayer }) => mvtSourceLayer)],
    ["logical layer IDs", mapping.logicalLayers.map(({ id }) => id)],
  ]) {
    const duplicates = duplicateValues(values)
    assertValid(duplicates.length === 0, `duplicate ${label}: ${duplicates.join(", ")}`)
  }

  for (const layer of mapping.physicalLayers) {
    const sourceFile = resolve(dataDirectory, layer.geoPackageFile)
    assertValid(await fileExists(sourceFile), `missing GeoPackage for ${layer.id}: ${sourceFile}`)
    const geometryRows = runJson("sqlite3", ["-json", sourceFile,
      `SELECT column_name, geometry_type_name FROM gpkg_geometry_columns WHERE table_name = '${layer.geoPackageLayer.replaceAll("'", "''")}';`])
    const geometryMetadata = geometryRows[0]
    assertValid(geometryMetadata, `layer ${layer.geoPackageLayer} not found in ${layer.geoPackageFile}`)
    const declaredGeometry = normalizeGeometryType(geometryMetadata.geometry_type_name)
    let observed = []
    if (declaredGeometry !== normalizeGeometryType(layer.geometryType)) {
      const table = quoteSqlIdentifier(layer.geoPackageLayer)
      const geometry = quoteSqlIdentifier(geometryMetadata.column_name)
      const report = runJson("ogrinfo", ["-json", "-features", "-q", "-dialect", "SQLite", sourceFile, "-sql",
        `SELECT GeometryType(${geometry}) AS geometry_type, COUNT(*) AS feature_count FROM ${table} WHERE ${geometry} IS NOT NULL GROUP BY GeometryType(${geometry})`])
      observed = (report.layers?.[0]?.features ?? []).map(({ properties }) => ({ geometryType: properties.geometry_type, count: Number(properties.feature_count) }))
    }
    try { validateGeometryFamily(layer.geometryType, declaredGeometry, observed) } catch (error) { throw new Error(`geometry mismatch for ${layer.id}: ${error.message}`) }

    const requiredFields = [...layer.logicalIdFields, ...(layer.parentIdFields ?? []), layer.featureIdentity.rowIdField,
      ...Object.values(layer.derivedFields ?? {}).map(({ sourceField }) => sourceField)]
    const columns = runJson("sqlite3", ["-json", sourceFile, `SELECT name FROM pragma_table_info('${layer.geoPackageLayer.replaceAll("'", "''")}');`])
    const columnNames = new Set(columns.map(({ name }) => name.toLowerCase()))
    for (const field of requiredFields) assertValid(columnNames.has(field.toLowerCase()), `field ${field} missing from ${layer.geoPackageFile}/${layer.geoPackageLayer}`)

    for (const [derivedName, derived] of Object.entries(layer.derivedFields ?? {})) {
      const field = quoteSqlIdentifier(derived.sourceField)
      const table = quoteSqlIdentifier(layer.geoPackageLayer)
      const rows = runJson("sqlite3", ["-json", sourceFile,
        `SELECT DISTINCT lower(trim(${field})) AS value FROM ${table} WHERE nullif(trim(${field}), '') IS NOT NULL ORDER BY value;`])
      const actual = rows.map(({ value }) => value)
      const expected = Object.keys(derived.values).sort()
      assertValid(sameJson(actual, expected), `observed values for ${layer.id}/${derivedName} differ: expected=${formatValues(expected)} actual=${formatValues(actual)}`)
    }
  }

  const physicalBySource = new Map(mapping.physicalLayers.map((layer) => [layer.mvtSourceLayer, layer]))
  for (const logical of mapping.logicalLayers) {
    const physical = physicalBySource.get(logical.sourceLayer)
    assertValid(physical, `logical layer ${logical.id} references unknown source ${logical.sourceLayer}`)
    if (logical.filter) {
      const values = physical.derivedFields?.[logical.filter.field]?.values ?? {}
      assertValid(Object.values(values).filter((value) => value === logical.filter.equals).length === 1,
        `filter ${logical.filter.field}=${logical.filter.equals} for ${logical.id} is not defined exactly once`)
    }
  }
  for (const physical of mapping.physicalLayers) assertValid(mapping.logicalLayers.some(({ sourceLayer }) => sourceLayer === physical.mvtSourceLayer), `physical source ${physical.mvtSourceLayer} has no logical layer`)

  const uiTypesPath = resolve(repositoryDirectory, "src/common/layers.types.ts")
  if (await fileExists(uiTypesPath)) {
    const enumBlock = (await readFile(uiTypesPath, "utf8")).match(/export enum MuseovirastoLayer \{[\s\S]*?^\}/m)?.[0] ?? ""
    const uiIds = [...enumBlock.matchAll(/=\s*"([^"]+)"/g)].map((match) => match[1]).sort()
    const mappingIds = mapping.logicalLayers.map(({ id }) => id).sort()
    assertValid(sameJson(uiIds, mappingIds), `logical layer IDs differ from MuseovirastoLayer enum: mapping=${formatValues(mappingIds)} ui=${formatValues(uiIds)}`)
  }

  const compact = (layers) => layers.map(({ id, geoPackageFile, geoPackageLayer }) => ({ id, geoPackageFile, geoPackageLayer })).sort((a, b) => a.id.localeCompare(b.id))
  assertValid(sameJson(compact(config.layers), compact(mapping.physicalLayers)), "build configuration differs from layer mapping")
  const profiles = new Set(["none", "logical-filter", "archaeological-filters"])
  for (const layer of config.layers) {
    assertValid(profiles.has(layer.transformProfile) && typeof (layer.lowZoomCentroid ?? false) === "boolean" &&
      typeof layer.sql === "string" && layer.sql.includes("registry_id") && layer.sql.includes("geom"), `incomplete build configuration for ${layer.id}`)
  }
  assertValid(Number.isFinite(config.tiling.minimumZoom) && Number.isFinite(config.tiling.maximumZoom) &&
    config.tiling.lowZoomCentroidMaximumZoom + 1 === config.tiling.polygonMinimumZoom &&
    config.tiling.featureLimit === false && config.tiling.tileSizeLimit === false && config.tiling.tinyPolygonReduction === false &&
    config.budgets.maximumArchiveBytes > 0 && config.budgets.maximumZoomZeroTileBytes > 0, "invalid tiling rules or budgets")

  process.stdout.write(`Layer mapping is valid: ${mapping.physicalLayers.length} physical layers and ${mapping.logicalLayers.length} logical layers.\nBuild configuration is complete and matches the layer mapping.\n`)
}

if (import.meta.url === `file://${process.argv[1]}`) runValidation(() => validateLayerMapping(
  process.argv[2] ? resolve(process.argv[2]) : sourceDirectory,
  process.argv[3] ? resolve(process.argv[3]) : mappingPath,
))
