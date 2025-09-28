import fs from "fs"
import path from "path"

const EDGES_FILE = path.join("results", "3_Viabundus-edges.geojson")
const NODES_FILE = path.join("results", "11_Viabundus-nodes.geojson")
const OUTPUT_FILE = path.join("results", "12_Viabundus-final.geojson")

// --- Step 1: Load both GeoJSON files
const edges = JSON.parse(fs.readFileSync(EDGES_FILE, "utf8"))
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, "utf8"))

// --- Step 2: Verify they are FeatureCollections
if (edges.type !== "FeatureCollection" || nodes.type !== "FeatureCollection") {
  throw new Error("Both input files must be FeatureCollections")
}

// --- Step 3: Merge features
const joined = {
  type: "FeatureCollection",
  features: [...edges.features, ...nodes.features]
}

// --- Step 4: Save output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(joined, null, 2))
console.log(`Done. Output saved as ${OUTPUT_FILE}`)
