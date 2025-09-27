import { parse } from "csv-parse/sync"
import fs from "fs"
import he from "he"
import path from "path"

const INPUT_GEOJSON = "Viabundus-roads-finland.geojson"
const OUTPUT_GEOJSON = "Viabundus-roads-finland-with-descriptions.geojson"
const EDGES_CSV = path.join("viabundus_csv", "edgesdescriptionlang.csv")

// --- Step 1: Load roads GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Load and parse roads description CSV
const csvText = fs.readFileSync(EDGES_CSV, "utf8")
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true
})

// --- Step 3: Build lookup table { descriptionid: description }
const edgeDescriptions = {}
for (const row of records) {
  if (row.descriptionid) {
    edgeDescriptions[row.descriptionid] = he.decode(row.description)
  }
}

// --- Step 4: Add road description to roads GeoJSON properties
for (const feature of geojson.features) {
  const descId = feature.properties.descriptionid
  if (descId && edgeDescriptions[descId]) {
    feature.properties.edgeDescription = edgeDescriptions[descId]
  }
}

// --- Step 5: Save output (pretty-printed JSON)
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
