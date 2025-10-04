import fs from "fs"
import path from "path"

const INPUT_GEOJSON = path.join("results", "9_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "11_Viabundus-nodes.geojson")

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Remove empty nodes and change null values to undefined so that they are removed in JSON stringify
const pruned = {
  ...geojson,
  features: geojson.features
    .filter((feature) => {
      const {
        Is_Town,
        Is_Settlement,
        Is_Bridge,
        Is_Fair,
        Is_Toll,
        Is_Ferry,
        Is_Harbour
      } = feature.properties
      return (
        Is_Town ||
        Is_Settlement ||
        Is_Bridge ||
        Is_Fair ||
        Is_Toll ||
        Is_Ferry ||
        Is_Harbour
      )
    })
    .map((feature) => {
      for (const key of Object.keys(feature.properties)) {
        if (
          feature.properties[key] === null ||
          feature.properties[key] === ""
        ) {
          feature.properties[key] = undefined
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
