import fs from "fs"
import path from "path"

const INPUT_GEOJSON = path.join("results", "9_Viabundus-nodes.geojson")
const OUTPUT_GEOJSON = path.join("results", "10_Viabundus-nodes.geojson")

// --- Step 1: Load GeoJSON
const geojson = JSON.parse(fs.readFileSync(INPUT_GEOJSON, "utf8"))

// --- Step 2: Restructure function
function restructureProperties(props) {
  const groups = []

  // Helper to preserve multilingual descriptions and attach type-based literature
  function makeGroup(type, from, to, description, extras = {}) {
    const litKey = `${type}Literature`
    return {
      type,
      from: from || undefined,
      to: to || undefined,
      description: description || undefined,
      literature: props[litKey] || undefined,
      ...extras
    }
  }

  // Settlement
  if (props.Is_Settlement === "y") {
    groups.push(
      makeGroup(
        "settlement",
        props.Settlement_From,
        props.Settlement_To,
        props.Settlement_Description
      )
    )
  }

  // Town
  if (props.Is_Town === "y") {
    groups.push(
      makeGroup("town", props.Town_From, props.Town_To, props.Town_Description)
    )
  }

  // Fair
  if (props.Is_Fair === "y") {
    groups.push(
      makeGroup(
        "fair",
        props.Fair_From,
        props.Fair_To,
        props.Fair_Description,
        {
          gregorian: props.Gregorian_Calendar || undefined,
          fairs: props.fairs || []
        }
      )
    )
  }

  // Toll
  if (props.Is_Toll === "y") {
    groups.push(
      makeGroup(
        "toll",
        props.Toll_From,
        props.Toll_To,
        props.Toll_Description,
        {
          owner: props.Toll_Primary_Owner || undefined
        }
      )
    )
  }

  // Bridge
  if (props.Is_Bridge === "y") {
    groups.push(
      makeGroup(
        "bridge",
        props.Bridge_From,
        props.Bridge_To,
        props.Bridge_Description
      )
    )
  }

  // Staple
  if (props.Is_Staple === "y") {
    groups.push(
      makeGroup(
        "staple",
        props.Staple_From,
        props.Staple_To,
        props.Staple_Description,
        {
          duration: props.Staple_Duration_Of_Stay || undefined
        }
      )
    )
  }

  // Ferry
  if (props.Is_Ferry === "y") {
    groups.push(
      makeGroup(
        "ferry",
        props.Ferry_From,
        props.Ferry_To,
        props.Ferry_Description
      )
    )
  }

  // Harbour
  if (props.Is_Harbour === "y") {
    groups.push(
      makeGroup(
        "harbour",
        props.Harbour_From,
        props.Harbour_To,
        props.Harbour_Description
      )
    )
  }

  // Lock
  if (props.Is_Lock === "y") {
    groups.push(
      makeGroup("lock", props.Lock_From, props.Lock_To, props.Lock_Description)
    )
  }

  return {
    id: props.id,
    name: props.name,
    subfeatures: groups,
    // node-level literature (pertainsto was null/empty)
    literature: props.literature || undefined,
    population: props.population || undefined
  }
}

// --- Step 3: Transform all features
geojson.features = geojson.features.map((f) => ({
  ...f,
  properties: restructureProperties(f.properties)
}))

// --- Step 4: Save output
fs.writeFileSync(OUTPUT_GEOJSON, JSON.stringify(geojson, null, 2))
console.log(`Done. Output saved as ${OUTPUT_GEOJSON}`)
