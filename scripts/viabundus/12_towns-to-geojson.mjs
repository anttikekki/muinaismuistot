import { parse } from "csv-parse/sync"
import fs from "fs"
import path from "path"
import wellknown from "wellknown" // npm install wellknown

const INPUT_CSV = path.join("source-data", "viabundus_csv", "towns.csv")
const NODES_FILE = path.join("results", "11_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "12_Viabundus-towns.geojson")

// --- Step 1: Load nodes GeoJSON to get valid node IDs
const nodesGeojson = JSON.parse(fs.readFileSync(NODES_FILE, "utf8"))
const validNodeIds = new Set(nodesGeojson.features.map((f) => f.properties.id))

// --- Step 2: Load and parse CSV
const csvText = fs.readFileSync(INPUT_CSV, "utf8")
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true
})

// --- Step 3: Convert to GeoJSON (filtering by valid nodes)
const features = []

for (const row of records) {
  if (!row.wkt) continue
  const nodeId = parseInt(row.nodesid, 10)

  if (!validNodeIds.has(nodeId)) {
    continue // skip if not in nodes
  }

  const geometry = wellknown(row.wkt) // convert WKT → GeoJSON geometry
  if (!geometry) continue

  const properties = {
    type: "townOutline",
    nodesid: nodeId,
    name: nodesGeojson.features.find((node) => node.properties.id === nodeId)
      ?.properties?.name,
    fromyear: row.fromyear ? parseInt(row.fromyear, 10) : undefined,
    toyear: row.toyear ? parseInt(row.toyear, 10) : undefined
  }

  features.push({
    type: "Feature",
    geometry,
    properties
  })
}

// --- Step 4: Wrap in FeatureCollection
const geojson = {
  type: "FeatureCollection",
  features
}

// --- Step 5: Save output
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2), "utf8")
console.log(
  `Done. Output saved as ${OUTPUT_GEOJSON} with ${features.length} features.`
)
