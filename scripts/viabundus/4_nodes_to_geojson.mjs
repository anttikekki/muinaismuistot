import { parse } from "csv-parse/sync"
import fs from "fs"
import he from "he"
import path from "path"

const INPUT_CSV = path.join("source-data", "viabundus_csv", "nodes.csv")
const OUTPUT_GEOJSON = path.join("results", "4_Viabundus-nodes.geojson")

// --- Step 1: Load and parse CSV
const csvText = fs.readFileSync(INPUT_CSV, "utf8")
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true
})

// --- Step 2: Convert rows to GeoJSON Features
const features = records
  .map((row) => {
    const lat = parseFloat(row.latitude)
    const lon = parseFloat(row.longitude)
    if (isNaN(lat) || isNaN(lon)) return null

    for (const key of Object.keys(row)) {
      let val = row[key]
      if (typeof val === "string") {
        if (val.toLowerCase() === "null") {
          row[key] = undefined
        } else if (val === "y") {
          // Convert string to boolean
          row[key] = true
        } else {
          // Decode HTML entities & normalize "null" -> null
          row[key] = he.decode(val)
        }
      }
    }

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat] // GeoJSON expects [lon, lat]
      },
      properties: {
        ...row,
        type: "place",
        id: parseInt(row.id),
        latitude: undefined,
        longitude: undefined,
        links: undefined,
        zoomlevel: undefined
      }
    }
  })
  .filter(Boolean)

// --- Step 3: Wrap in FeatureCollection
const geojson = {
  type: "FeatureCollection",
  features
}

// --- Step 4: Save pretty-printed GeoJSON
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
