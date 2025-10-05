import { parse } from "csv-parse/sync"
import fs from "fs"
import path from "path"

const INPUT_GEOJSON = path.join("results", "8_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "9_Viabundus-nodes.geojson")
const POPULATION_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "population.csv"
)

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Load population CSV
const csvText = fs.readFileSync(POPULATION_CSV, "utf8")
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true
})

// --- Step 3: Group population rows by nodesid
const populationByNode = {}
for (const row of records) {
  const { nodesid, year, inhabitants } = row
  if (!nodesid || !year || !inhabitants) continue

  if (!populationByNode[nodesid]) {
    populationByNode[nodesid] = []
  }

  populationByNode[nodesid].push({
    year: parseInt(year, 10),
    inhabitants: parseInt(inhabitants, 10)
  })
}

// --- Step 4: Attach population arrays to features
for (const feature of geojson.features) {
  const nodeId = String(feature.properties.id)
  const population = populationByNode[nodeId]
  if (population && population.length > 0) {
    feature.properties.population = populationByNode[nodeId]
  }
}

// --- Step 5: Save output
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
