#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { createInterface } from "node:readline"
import { readFile, writeFile } from "node:fs/promises"

const types = [
  "ei määritelty", "alusten hylyt", "asuinpaikat", "hautapaikat", "kirkkorakenteet",
  "kivirakenteet", "kulkuväylät", "kultti- ja tarinapaikat", "luonnonmuodostumat",
  "löytöpaikat", "maarakenteet", "muinaisjäännösryhmät", "puolustusvarustukset",
  "puurakenteet", "raaka-aineen hankintapaikat", "tapahtumapaikat", "teollisuuskohteet",
  "taide, muistomerkit", "työ- ja valmistuspaikat",
]
const datings = [
  "moniperiodinen", "esihistoriallinen", "kivikautinen", "varhaismetallikautinen",
  "pronssikautinen", "rautakautinen", "rautakautinen ja/tai keskiaikainen",
  "keskiaikainen", "historiallinen", "moderni", "ajoittamaton", "ei määritelty",
]

function atomicValues(raw, kind) {
  if (!raw) return []
  const protectedRaw = kind === "type" ? raw.replaceAll("taide, muistomerkit", "taide\u001fmuistomerkit") : raw
  return protectedRaw.split(",").map((value) => value.replaceAll("\u001f", ", ").trim()).filter(Boolean)
}

function distinctRawValues(gpkg, layer, field) {
  const sql = `SELECT DISTINCT ${field} FROM ${layer}`
  const result = spawnSync("ogrinfo", ["-ro", "-json", "-features", "-dialect", "SQLite", "-sql", sql, gpkg], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
  if (result.status !== 0) throw new Error(result.stderr || `ogrinfo failed for ${field}`)
  const document = JSON.parse(result.stdout)
  return document.layers[0].features.map((feature) => feature.properties[field]).filter((value) => typeof value === "string")
}

async function generateVocabulary([gpkg, layer, output]) {
  const typeSet = new Set()
  const datingSet = new Set()
  const subtypeSet = new Set()
  for (const raw of distinctRawValues(gpkg, layer, "tyyppi")) {
    for (const value of atomicValues(raw, "type")) typeSet.add(value)
  }
  for (const raw of distinctRawValues(gpkg, layer, "ajoitus")) {
    for (const value of atomicValues(raw, "dating")) datingSet.add(value)
  }
  for (const raw of distinctRawValues(gpkg, layer, "alatyyppi")) {
    for (const value of atomicValues(raw, "subtype")) subtypeSet.add(value)
  }
  const vocabulary = { schemaVersion: 1, types: [...typeSet].sort((a, b) => a.localeCompare(b, "fi")), datings: [...datingSet].sort((a, b) => a.localeCompare(b, "fi")), subtypes: [...subtypeSet].sort((a, b) => a.localeCompare(b, "fi")) }
  await writeFile(output, `${JSON.stringify(vocabulary, null, 2)}\n`)
}

function mask(raw, values, kind) {
  const indexes = new Map(values.map((value, index) => [value, index]))
  let result = 0
  for (const value of atomicValues(raw, kind)) {
    const index = indexes.get(value)
    if (index === undefined) continue
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
  const subtypeIndexes = new Map(vocabulary.subtypes.map((value, index) => [value, index + 1]))
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const line of input) {
    if (!line.trim()) continue
    const feature = JSON.parse(line)
    const source = feature.properties ?? {}
    const properties = { source_fid: featureId(layerId, source.gpkg_fid) }
    if (profile === "archaeological-filters") {
      properties.laji_key = source.laji_key
      properties.type_mask = mask(source.types_raw, vocabulary.types, "type")
      properties.dating_mask = mask(source.datings_raw, vocabulary.datings, "dating")
      properties.subtype_codes = atomicValues(source.subtypes_raw, "subtype").map((value) => {
        const code = subtypeIndexes.get(value)
        return code?.toString(36)
      }).filter(Boolean).join(".")
    } else if (profile === "logical-filter") {
      properties.laji_key = source.laji_key
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
    process.stdout.write(`INSERT INTO feature_details (source_layer, feature_id, logical_layer_id, registry_id, name, search_name, municipality, properties_json) VALUES\n${values.join(",\n")};\n`)
    values = []
  }
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const line of input) {
    if (!line.trim()) continue
    const source = JSON.parse(line).properties ?? {}
    const id = featureId(layerId, source.gpkg_fid)
    const logical = logicalLayers.find((layer) => !layer.filter || String(source[layer.filter.field] ?? "") === layer.filter.equals)
    if (!logical) throw new Error(`No logical layer for ${layerId}: ${JSON.stringify(source)}`)
    const extra = Object.fromEntries(Object.entries(source).filter(([key]) =>
      !["gpkg_fid", "source_fid", "registry_id", "name", "municipality"].includes(key),
    ))
    values.push(`(${sqlString(layerId)}, ${id}, ${sqlString(logical.id)}, ${sqlString(source.registry_id)}, ${sqlString(source.name)}, ${sqlString(normalizeSearchText(source.name))}, ${sqlString(source.municipality)}, ${sqlString(JSON.stringify(extra))})`)
    if (values.length === 50) flush()
  }
  flush()
}

const [command, ...args] = process.argv.slice(2)
if (command === "vocabulary" && args.length === 3) await generateVocabulary(args)
else if (command === "transform" && args.length >= 3 && args.length <= 5) await transform(args)
else if (command === "details" && args.length === 2) await details(args)
else throw new Error("Usage: compact-filter-data.mjs vocabulary <gpkg> <layer> <output> | transform <vocabulary> <layer-id> <profile> [default|centroid|polygon] | details <layer-mapping> <layer-id>")
