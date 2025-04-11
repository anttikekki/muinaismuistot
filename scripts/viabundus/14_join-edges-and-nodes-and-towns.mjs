import fs from "fs"
import path from "path"

const EDGES_FILE = path.join("results", "3b_Viabundus-edges.geojson")
const NODES_FILE = path.join("results", "11_Viabundus-nodes.geojson")
const TOWNS_FILE = path.join("results", "13_Viabundus-towns.geojson")
const OUTPUT_FILE = path.join("results", "14_Viabundus-final.geojson")

// --- Step 1: Load all GeoJSON files
const edges = JSON.parse(fs.readFileSync(EDGES_FILE, "utf8"))
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, "utf8"))
const towns = JSON.parse(fs.readFileSync(TOWNS_FILE, "utf8"))

// --- Step 2: Verify they are FeatureCollections
for (const [name, data] of [
  ["edges", edges],
  ["nodes", nodes],
  ["towns", towns]
]) {
  if (data.type !== "FeatureCollection") {
    throw new Error(`${name} file is not a FeatureCollection`)
  }
}

// --- Step 3: Merge features
const joined = {
  type: "FeatureCollection",
  features: [...edges.features, ...nodes.features, ...towns.features]
}

// --- Step 4: Save output
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(joined, null, 2))
console.log(`Done. Output saved as ${OUTPUT_FILE}`)
