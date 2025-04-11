import { parse } from "csv-parse/sync"
import he from "he"
import fs from "node:fs"
import path from "node:path"
import { stripHtml } from "string-strip-html"

const INPUT_GEOJSON = path.join("results", "1_Viabundus-edges.geojson")
const OUTPUT_GEOJSON = path.join("results", "3a_Viabundus-edges.geojson")
const EDGES_LANG_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "edgesdescriptionlang.csv"
)
const EDGES_EN_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "edgesdescription.csv"
)

// --- Step 1: Load roads GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Load and parse CSVs
function loadCsv(file) {
  const text = fs.readFileSync(file, "utf8")
  return parse(text, { columns: true, skip_empty_lines: true })
}

const descriptionsEn = loadCsv(EDGES_EN_CSV)
const descriptiontsOtherLang = loadCsv(EDGES_LANG_CSV)

// --- Step 3: Build lookup tables (keyed by descriptionid)
const descFiByDescId = {}
for (const row of descriptiontsOtherLang) {
  if (row.descriptionid && row.language === "fin") {
    descFiByDescId[row.descriptionid] = he.decode(row.description || "")
  }
}

const descEnByDescId = {}
for (const row of descriptionsEn) {
  if (row.id) {
    descEnByDescId[row.id] = he.decode(row.description || "")
  }
}

// --- Step 4: Add descriptions to roads GeoJSON properties
for (const feature of geojson.features) {
  const { properties } = feature
  const descId = properties.descriptionid
  const descFi = descFiByDescId[descId]
  const descEn = descEnByDescId[descId]

  if (descFi) {
    properties.descriptionFI = stripHtml(descFi).result
  }

  if (descEn) {
    properties.descriptionEN = stripHtml(descEn).result
  }

  // Drop uninteresting field
  delete properties.zoomlevel

  // Add rename original type to roadType and add common type field
  properties.roadType = properties.type
  properties.type = "road"

  // change null fields to undefined, so that those are removed in JSON stringify
  for (const key of Object.keys(properties)) {
    if (properties[key] === null || properties[key] === "") {
      properties[key] = undefined
    }
  }
}

// --- Step 5: Save output (pretty-printed JSON)
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
