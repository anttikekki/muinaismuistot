import fs from "fs"
import path from "path"

const INPUT_GEOJSON = path.join("results", "9_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "11_Viabundus-nodes.geojson")

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Remove empty features and clear empty values
const pruned = {
  ...geojson,
  features: geojson.features
    .filter((f) => !!f.properties.name)
    .map((feature) => {
      // change null fields to undefined, so that those are removed in JSON stringify
      for (const key of Object.keys(feature.properties)) {
        if (feature[key] === null) {
          feature[key] = undefined
        }
      }
      return feature
    })
}

// --- Step 4: Save result
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(pruned, null, 2), "utf8")

console.log(
  `Done. Dropped ${
    geojson.features.length - pruned.features.length
  } empty features. Output saved as ${OUTPUT_GEOJSON}`
)
