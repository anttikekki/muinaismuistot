import fs from "fs"
import path from "path"

const INPUT_GEOJSON = path.join("results", "10_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "11_Viabundus-nodes.geojson")

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Filter features
const pruned = {
  ...geojson,
  features: geojson.features.filter((f) => {
    const p = f.properties
    return !(
      (p.name === null || p.name === "") &&
      Array.isArray(p.features) &&
      p.features.length === 0 &&
      Array.isArray(p.literature) &&
      p.literature.length === 0 &&
      Array.isArray(p.population) &&
      p.population.length === 0
    )
  })
}

// --- Step 3: Save result
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(pruned, null, 2), "utf8")

console.log(
  `Done. Dropped ${
    geojson.features.length - pruned.features.length
  } empty features. Output saved as ${OUTPUT_GEOJSON}`
)
