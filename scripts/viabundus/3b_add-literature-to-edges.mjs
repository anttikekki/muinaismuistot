import { parse } from "csv-parse/sync"
import he from "he"
import fs from "node:fs"
import path from "node:path"
import { stripHtml } from "string-strip-html"

const INPUT_GEOJSON = path.join("results", "3a_Viabundus-edges.geojson")
const OUTPUT_GEOJSON = path.join("results", "3b_Viabundus-edges.geojson")
const LITERATURE_LINK_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "literaturelink.csv"
)
const LITERATURE_CSV = path.join(
  "source-data",
  "viabundus_csv",
  "literature.csv"
)

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Load CSVs
function loadCsv(file) {
  return parse(fs.readFileSync(file, "utf8"), {
    columns: true,
    skip_empty_lines: true
  })
}

const links = loadCsv(LITERATURE_LINK_CSV)
const literature = loadCsv(LITERATURE_CSV)

// --- Step 3: Build lookup for literatureid → litertature text
const literatureMap = {}
for (const row of literature) {
  literatureMap[row.id] = he.decode(row.reflong || "")
}

// --- Step 4: Group literature texts by edgesid
const literatureByEdgeId = {}
for (const row of links) {
  const { edgesid, pertainsto, literatureid } = row

  if (!literatureid || pertainsto !== "edge") continue

  const literatureText = literatureMap[literatureid]
  if (!literatureText) continue

  if (!literatureByEdgeId[edgesid]) {
    literatureByEdgeId[edgesid] = []
  }
  literatureByEdgeId[edgesid].push(literatureText)
}

// --- Step 5: Attach literature to feature by edgesid --> nodeId.descriptionid
for (const feature of geojson.features) {
  const { descriptionid } = feature.properties
  const literatureTextArray = literatureByEdgeId[descriptionid]

  if (!Array.isArray(literatureTextArray)) continue

  feature.properties.literature = literatureTextArray.map(
    (text) => stripHtml(text).result
  )
}

// --- Step 6: Save output
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
