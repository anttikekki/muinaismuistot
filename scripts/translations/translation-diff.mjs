import fs from "node:fs"
import path from "node:path"

const fileA = path.resolve("../../src/common/translations/fi.json") // reference file
const fileB = path.resolve("../../src/common/translations/sv.json") // file to check against

// --- Load JSON files
const a = JSON.parse(fs.readFileSync(fileA, "utf8"))
const b = JSON.parse(fs.readFileSync(fileB, "utf8"))

// --- Helper: recursively flatten nested keys
function flatten(obj, prefix = "") {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === "object") {
      Object.assign(acc, flatten(value, fullKey))
    } else {
      acc[fullKey] = value
    }
    return acc
  }, {})
}

// --- Flatten both files
const flatA = flatten(a)
const flatB = flatten(b)

// --- Compare and report missing keys
console.log("Missing keys in second file:\n")

let missingCount = 0

for (const [key, value] of Object.entries(flatA)) {
  if (!(key in flatB)) {
    console.log(`${key} → "${value}"`)
    missingCount++
  }
}

if (missingCount === 0) {
  console.log("No missing keys!")
} else {
  console.log(`\nTotal missing: ${missingCount}`)
}
