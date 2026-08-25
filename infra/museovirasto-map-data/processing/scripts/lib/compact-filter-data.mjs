#!/usr/bin/env node

import { createInterface } from "node:readline"
import { readFile } from "node:fs/promises"

function atomicValues(raw, kind) {
  if (!raw) return []
  const protectedRaw = kind === "type" ? raw.replaceAll("taide, muistomerkit", "taide\u001fmuistomerkit") : raw
  return protectedRaw.split(",").map((value) => value.replaceAll("\u001f", ", ").trim()).filter(Boolean)
}

function mask(raw, values, kind) {
  const indexes = new Map(values.map((value, index) => [value, index]))
  let result = 0
  for (const value of atomicValues(raw, kind)) {
    const index = indexes.get(value)
    if (index === undefined) throw new Error(`Unknown ${kind} value: ${value}`)
    result += 2 ** index
  }
  return result
}

function featureId(layerId, sourceFid) {
  const featureId = Number(sourceFid)
  if (!Number.isSafeInteger(featureId) || featureId <= 0) throw new Error(`Invalid GeoPackage fid in ${layerId}: ${sourceFid}`)
  return featureId
}

async function transform([vocabularyPath, layerId, profile, representation = "default", representationZoom]) {
  const vocabulary = JSON.parse(await readFile(vocabularyPath, "utf8"))
  const kindIndexes = new Map(vocabulary.kinds.map((value, index) => [value, index + 1]))
  const subtypeIndexes = new Map(vocabulary.subtypes.map((value, index) => [value, index + 1]))
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const line of input) {
    if (!line.trim()) continue
    const feature = JSON.parse(line)
    const source = feature.properties ?? {}
    const properties = { source_fid: featureId(layerId, source.gpkg_fid) }
    if (profile === "archaeological-filters") {
      properties.laji_key = kindIndexes.get(source.laji_key)
      if (!properties.laji_key) throw new Error(`Unknown laji_key in ${layerId}: ${source.laji_key}`)
      properties.type_mask = mask(source.types_raw, vocabulary.types, "type")
      properties.dating_mask = mask(source.datings_raw, vocabulary.datings, "dating")
      properties.subtype_codes = atomicValues(source.subtypes_raw, "subtype").map((value) => {
        const code = subtypeIndexes.get(value)
        if (code === undefined) throw new Error(`Unknown subtype value: ${value}`)
        return code.toString(36)
      }).join(".")
    } else if (profile === "logical-filter") {
      properties.laji_key = kindIndexes.get(source.laji_key)
      if (!properties.laji_key) throw new Error(`Unknown laji_key in ${layerId}: ${source.laji_key}`)
    } else if (profile !== "none") {
      throw new Error(`Unknown transform profile for ${layerId}: ${profile}`)
    }
    feature.properties = properties
    if (representation === "centroid") {
      feature.tippecanoe = { maxzoom: Number(representationZoom) }
    } else if (representation === "polygon") {
      feature.tippecanoe = { minzoom: Number(representationZoom) }
    }
    process.stdout.write(`${JSON.stringify(feature)}\n`)
  }
}

function sqlString(value) {
  return value === null || value === undefined ? "NULL" : `'${String(value).replaceAll("'", "''")}'`
}

function normalizeSearchText(value) {
  return String(value ?? "").normalize("NFC").toLocaleLowerCase("fi").trim()
}

async function details([mappingPath, layerId]) {
  const mapping = JSON.parse(await readFile(mappingPath, "utf8"))
  const logicalLayers = mapping.logicalLayers.filter((layer) => layer.sourceLayer === layerId)
  let values = []
  const flush = () => {
    if (!values.length) return
    process.stdout.write(`INSERT INTO feature_details (source_layer, feature_id, logical_layer_id, registry_id, name, search_name, municipality, properties_json, geometry_json) VALUES\n${values.join(",\n")};\n`)
    values = []
  }
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const line of input) {
    if (!line.trim()) continue
    const feature = JSON.parse(line)
    const source = feature.properties ?? {}
    const exactGeometry = typeof source.exact_geometry_json === "string"
      ? JSON.parse(source.exact_geometry_json)
      : source.exact_geometry_json
    if (!exactGeometry) throw new Error(`Missing geometry in ${layerId}:${source.gpkg_fid}`)
    const id = featureId(layerId, source.gpkg_fid)
    const logical = logicalLayers.find((layer) => !layer.filter || String(source[layer.filter.field] ?? "") === layer.filter.equals)
    if (!logical) throw new Error(`No logical layer for ${layerId}: ${JSON.stringify(source)}`)
    const extra = Object.fromEntries(Object.entries(source).filter(([key]) =>
      !["gpkg_fid", "source_fid", "registry_id", "name", "municipality", "exact_geometry_json"].includes(key),
    ))
    const value = `(${sqlString(layerId)}, ${id}, ${sqlString(logical.id)}, ${sqlString(source.registry_id)}, ${sqlString(source.name)}, ${sqlString(normalizeSearchText(source.name))}, ${sqlString(source.municipality)}, ${sqlString(JSON.stringify(extra))}, ${sqlString(JSON.stringify(exactGeometry))})`
    if (values.length > 0 && Buffer.byteLength(values.join(",\n")) + Buffer.byteLength(value) > 60_000) flush()
    values.push(value)
    if (values.length === 50) flush()
  }
  flush()
}

const [command, ...args] = process.argv.slice(2)
if (command === "transform" && args.length >= 3 && args.length <= 5) await transform(args)
else if (command === "details" && args.length === 2) await details(args)
else throw new Error("Usage: compact-filter-data.mjs transform <vocabulary> <layer-id> <profile> [default|centroid|polygon] [zoom] | details <layer-mapping> <layer-id>")
