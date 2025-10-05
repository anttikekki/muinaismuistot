import { parse } from "csv-parse/sync"
import he from "he"
import fs from "node:fs"
import path from "node:path"
import { stripHtml } from "string-strip-html"

const INPUT_GEOJSON = path.join("results", "5_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "6_Viabundus-nodes.geojson")
const DESCRIPTIONS_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "descriptions.csv"
)

// mapping from CSV pertainsto → GeoJSON description field
const descriptionFieldNameMap = {
  settlement: "Settlement_Description",
  city: "Town_Description",
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
    descNodeType: row.pertainsto.toLowerCase(),
    descriptionFi: he.decode(row.description)
  })
}

// --- Step 4: Update GeoJSON descriptions
for (const feature of geojson.features) {
  const props = feature.properties
  const nodeId = String(props.id)
  const nodeFiDescs = descriptionsByNode[nodeId]

  for (const [nodeType, descFieldName] of Object.entries(
    descriptionFieldNameMap
  )) {
    const descEn = props[descFieldName]

    if (descEn) {
      props[`${descFieldName}EN`] = stripHtml(descEn).result
      props[descFieldName] = undefined
    }

    const nodeFiDesc = nodeFiDescs?.find(
      (desc) => desc.descNodeType === nodeType
    )
    if (!nodeFiDesc) continue

    const descFi = nodeFiDesc.descriptionFi
    if (descFi) {
      props[`${descFieldName}FI`] = stripHtml(descFi).result
    }
  }
}

// --- Step 5: Save updated GeoJSON
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
