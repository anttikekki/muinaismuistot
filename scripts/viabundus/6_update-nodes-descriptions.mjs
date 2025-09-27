import { parse } from "csv-parse/sync"
import fs from "fs"
import he from "he"
import path from "path"

const INPUT_GEOJSON = path.join("results", "5_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "6_Viabundus-nodes.geojson")
const DESCRIPTIONS_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "descriptions.csv"
)

// mapping from CSV pertainsto → GeoJSON description field
const PERTAINSTO_MAP = {
  settlement: "Settlement_Description",
  town: "Town_Description",
  fair: "Fair_Description",
  toll: "Toll_Description",
  bridge: "Bridge_Description",
  staple: "Staple_Description",
  ferry: "Ferry_Description",
  harbour: "Harbour_Description",
  lock: "Lock_Description"
}

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Load and parse CSV
const csvText = fs.readFileSync(DESCRIPTIONS_CSV, "utf8")
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true
})

// --- Step 3: Build lookup { nodesid: [ { pertainsto, description }, ... ] }
const descriptionsByNode = {}
for (const row of records) {
  if (row.language !== "fin") continue

  if (!descriptionsByNode[row.nodesid]) {
    descriptionsByNode[row.nodesid] = []
  }

  descriptionsByNode[row.nodesid].push({
    pertainsto: row.pertainsto.toLowerCase(),
    description: he.decode(row.description)
  })
}

// --- Step 4: Update GeoJSON features
for (const feature of geojson.features) {
  const props = feature.properties
  const nodeId = String(props.id)
  const updates = descriptionsByNode[nodeId]
  if (!updates) continue

  for (const { pertainsto, description } of updates) {
    const field = PERTAINSTO_MAP[pertainsto]
    const flag = `Is_${pertainsto.charAt(0).toUpperCase()}${pertainsto.slice(1)}`

    if (field && props[flag] === "y") {
      const existing = props[field]

      // Wrap existing + new into { en, fi }
      if (existing && typeof existing === "string") {
        props[field] = { en: existing, fi: description }
      } else if (existing && typeof existing === "object") {
        props[field].fi = description // already multilingual
      } else {
        props[field] = { en: null, fi: description }
      }
    }
  }
}

// --- Step 5: Save updated GeoJSON
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
