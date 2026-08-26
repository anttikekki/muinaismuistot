#!/usr/bin/env node

import { readFile } from "node:fs/promises"

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`
}

function fieldExpression(field, vocabulary) {
  const sources = field.sources ?? [field.source]
  if (sources.some((source) => typeof source !== "string")) {
    throw new Error(`invalid sources for ${field.target}`)
  }
  const source = quoteIdentifier(sources[0])
  let expression
  switch (field.transform ?? "none") {
    case "none": expression = source; break
    case "text": expression = `CAST(${source} AS TEXT)`; break
    case "trim": expression = `trim(${source})`; break
    case "join": {
      if (sources.length < 2) throw new Error(`join requires multiple sources for ${field.target}`)
      const values = sources.map((value) => `NULLIF(trim(CAST(${quoteIdentifier(value)} AS TEXT)), '')`)
      expression = values.map((value, index) => {
        const previousValueExists = values.slice(0, index).map((previous) => `${previous} IS NOT NULL`).join(" OR ")
        const separator = index === 0
          ? ""
          : `CASE WHEN (${previousValueExists}) AND ${value} IS NOT NULL THEN ', ' ELSE '' END || `
        return `${separator}COALESCE(${value}, '')`
      }).join(" || ")
      break
    }
    case "kind": {
      const values = Object.entries(vocabulary.kindSourceValues ?? {})
      if (values.length === 0) throw new Error("filter vocabulary has no kindSourceValues")
      const cases = values.map(([input, output]) => `WHEN ${sqlString(input)} THEN ${sqlString(output)}`).join(" ")
      expression = `CASE trim(lower(${source})) ${cases} ELSE 'unknown' END`
      break
    }
    default: throw new Error(`unknown field transform ${field.transform} for ${field.target}`)
  }
  return `${expression} AS ${quoteIdentifier(field.target)}`
}

export function buildLayerSql(physicalLayer, buildLayer, vocabulary, { centroid = false } = {}) {
  const fields = [
    `${quoteIdentifier(physicalLayer.featureIdentity.rowIdField)} AS "gpkg_fid"`,
    `${quoteIdentifier(physicalLayer.featureIdentity.rowIdField)} AS "source_fid"`,
    ...buildLayer.fields.map((field) => fieldExpression(field, vocabulary)),
    centroid ? `ST_Centroid("geom") AS "geom"` : `"geom"`,
  ]
  const where = Number(physicalLayer.excludedNullGeometries ?? 0) > 0 ? ` WHERE "geom" IS NOT NULL` : ""
  return `SELECT ${fields.join(", ")} FROM ${quoteIdentifier(physicalLayer.geoPackageLayer)}${where}`
}

export function createBuildPlan(mapping, config, vocabulary) {
  const kindOutputs = [...new Set(Object.values(vocabulary.kindSourceValues ?? {}))].sort()
  const kinds = [...(vocabulary.kinds ?? [])].sort()
  if (JSON.stringify(kindOutputs) !== JSON.stringify(kinds)) {
    throw new Error("kindSourceValues outputs differ from the kinds vocabulary")
  }
  const physicalById = new Map(mapping.physicalLayers.map((layer) => [layer.id, layer]))
  const buildById = new Map(config.layers.map((layer) => [layer.id, layer]))
  if (physicalById.size !== buildById.size || [...physicalById.keys()].some((id) => !buildById.has(id))) {
    throw new Error("build layer IDs differ from physical layer mapping")
  }
  return mapping.physicalLayers.map((physicalLayer) => {
    const buildLayer = buildById.get(physicalLayer.id)
    return {
      ...physicalLayer,
      ...buildLayer,
      excludedNullGeometries: Number(physicalLayer.excludedNullGeometries ?? 0),
      sql: buildLayerSql(physicalLayer, buildLayer, vocabulary),
      centroidSql: buildLayer.lowZoomCentroid ? buildLayerSql(physicalLayer, buildLayer, vocabulary, { centroid: true }) : null,
    }
  })
}

async function main([mappingPath, configPath, vocabularyPath]) {
  if (!mappingPath || !configPath || !vocabularyPath) {
    throw new Error("Usage: layer-build-plan.mjs <layer-mapping.json> <layers.json> <filter-vocabulary.json>")
  }
  const [mapping, config, vocabulary] = await Promise.all(
    [mappingPath, configPath, vocabularyPath].map((path) => readFile(path, "utf8").then(JSON.parse)),
  )
  for (const layer of createBuildPlan(mapping, config, vocabulary)) {
    const values = [layer.id, layer.geoPackageFile, layer.geoPackageLayer, layer.transformProfile,
      String(layer.lowZoomCentroid ?? false), String(layer.excludedNullGeometries),
      Buffer.from(layer.sql).toString("base64"), Buffer.from(layer.centroidSql ?? "").toString("base64")]
    process.stdout.write(`${values.join("\t")}\n`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main(process.argv.slice(2))
