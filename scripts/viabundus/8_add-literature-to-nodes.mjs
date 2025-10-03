import { parse } from "csv-parse/sync"
import fs from "fs"
import he from "he"
import path from "path"

const INPUT_GEOJSON = path.join("results", "7_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "8_Viabundus-nodes.geojson")
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

// --- Step 3: Build lookup for literatureid → reflong
const literatureMap = {}
for (const row of literature) {
  literatureMap[row.id] = he.decode(row.reflong || "")
}

// --- Step 4: Group links by nodesid + pertainsto
const refsByNode = {}
for (const row of links) {
  const { nodesid, literatureid } = row
  let { pertainsto } = row

  if (!nodesid || !literatureid) continue

  const ref = literatureMap[literatureid]
  if (!ref) continue

  // Normalize pertainsto
  if (!pertainsto || pertainsto === "\\N") {
    pertainsto = "node"
  }

  // normalize pertainsto values to canonical singular keys
  pertainsto = (() => {
    switch (pertainsto) {
      case "fairs":
        return "fair"
      case "tolls":
        return "toll"
      case "harbour":
      case "harbor":
        return "harbour"
      case "edges":
      case "edge":
        return "edge"
      case "names":
        return "name"
      default:
        return pertainsto
    }
  })()

  if (!refsByNode[nodesid]) {
    refsByNode[nodesid] = {}
  }

  const key = pertainsto.toLowerCase()
  if (!refsByNode[nodesid][key]) {
    refsByNode[nodesid][key] = []
  }
  refsByNode[nodesid][key].push(ref)
}

// --- Step 5: Attach to GeoJSON
for (const feature of geojson.features) {
  const nodeId = String(feature.properties.id)
  if (!refsByNode[nodeId]) continue

  const refGroups = refsByNode[nodeId]
  for (const [pertainsto, refs] of Object.entries(refGroups)) {
    if (refs.length === 0) {
      continue
    }
    if (pertainsto === "node") {
      feature.properties.Node_Literature = refs
    } else {
      const propName = `${pertainsto.charAt(0).toUpperCase()}${pertainsto.slice(1)}_Literature`
      feature.properties[propName] = refs
    }
  }
}

// --- Step 6: Save output
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
