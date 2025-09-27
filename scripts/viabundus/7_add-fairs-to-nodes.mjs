import { parse } from "csv-parse/sync"
import fs from "fs"
import he from "he"
import path from "path"

const INPUT_GEOJSON = path.join("results", "6_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "7_Viabundus-nodes.geojson")
const FAIRS_CSV = path.join("source-data", "viabundus_csv", "fairs.csv")
const FAIRS_DESC_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "fairsdescription.csv"
)

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Load CSVs
function loadCsv(file) {
  return parse(fs.readFileSync(file, "utf8"), {
    columns: true,
    skip_empty_lines: true
  })
}

const fairs = loadCsv(FAIRS_CSV)
const fairDescriptions = loadCsv(FAIRS_DESC_CSV)

// --- Step 3: Build lookup fairid → finnish description
const fiDescriptions = {}
for (const row of fairDescriptions) {
  if (row.language === "fin") {
    fiDescriptions[row.fairid] = he.decode(row.description)
  }
}

// --- Step 4: Attach fairs to nodes
const fairsByNode = {}
for (const fair of fairs) {
  const nodeId = fair.nodesid
  if (!nodeId) continue

  const fairObj = { ...fair }

  // Decode HTML entities in all string fields
  for (const key of Object.keys(fairObj)) {
    if (typeof fairObj[key] === "string") {
      fairObj[key] = he.decode(fairObj[key])
      if (fairObj[key].toLowerCase() === "null") {
        fairObj[key] = null
      }
    }
  }

  // Wrap description into { en, fi }
  const enDesc = fairObj.description
  const fiDesc = fiDescriptions[fairObj.id] || null
  fairObj.description = { en: enDesc, fi: fiDesc }

  if (!fairsByNode[nodeId]) {
    fairsByNode[nodeId] = []
  }
  fairsByNode[nodeId].push(fairObj)
}

// --- Step 5: Enrich GeoJSON features
for (const feature of geojson.features) {
  const nodeId = String(feature.properties.id)
  if (fairsByNode[nodeId]) {
    feature.properties.fairs = fairsByNode[nodeId]
  }
}

// --- Step 6: Save output
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
