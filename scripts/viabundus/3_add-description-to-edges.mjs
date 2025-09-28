import { parse } from "csv-parse/sync"
import fs from "fs"
import he from "he"
import path from "path"

const INPUT_GEOJSON = path.join("results", "1_Viabundus-edges.geojson")
const OUTPUT_GEOJSON = path.join("results", "3_Viabundus-edges.geojson")

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

const recordsLang = loadCsv(EDGES_LANG_CSV)
const recordsEn = loadCsv(EDGES_EN_CSV)

// --- Step 3: Build lookup tables (keyed by descriptionid)
const descFi = {}
for (const row of recordsLang) {
  if (row.descriptionid && row.language === "fin") {
    descFi[row.descriptionid] = he.decode(row.description || "")
  }
}

const descEn = {}
for (const row of recordsEn) {
  if (row.id) {
    descEn[row.id] = he.decode(row.description || "")
  }
}

// --- Step 4: Add descriptions to roads GeoJSON properties
for (const feature of geojson.features) {
  const descId = feature.properties.descriptionid

  const fi = descId && descFi[descId] ? descFi[descId] : null
  const en = descId && descEn[descId] ? descEn[descId] : null

  if (fi || en) {
    feature.properties.descriptions = { fi, en }
  }

  // Drop uninteresting field
  delete feature.properties.descriptionid
  delete feature.properties.zoomlevel

  // Add rename original type to edgeTypec and add common type field
  feature.properties.roadType = feature.properties.type
  feature.properties.type = "road"

  // Remove empty fields
  if (!feature.properties.fromyear) {
    delete feature.properties.fromyear
  }
  if (!feature.properties.toyear) {
    delete feature.properties.toyear
  }
  if (!feature.properties.descriptions) {
    delete feature.properties.descriptions
  }
}

// --- Step 5: Save output (pretty-printed JSON)
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
