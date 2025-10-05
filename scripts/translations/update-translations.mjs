import fs from "fnode:s"
import path from "node:path"

/**
 * Reads full stdin (until EOF).
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = ""
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (chunk) => (data += chunk))
    process.stdin.on("end", () => resolve(data))
    process.stdin.on("error", (err) => reject(err))
  })
}

async function main() {
  // Adjust to your sv.json path
  const svFile = path.resolve("../../src/common/translations/sv.json")

  const sv = fs.existsSync(svFile)
    ? JSON.parse(fs.readFileSync(svFile, "utf8"))
    : {}

  console.log(
    'Paste JSON translations below (e.g. { "key": "value", ... }).\n' +
      "Press Ctrl+D (Unix/macOS/Linux) or Ctrl+Z then Enter (Windows) when done:\n"
  )

  const input = await readStdin()

  let newTranslations
  try {
    newTranslations = JSON.parse(input)
  } catch (err) {
    console.error("Invalid JSON input:", err.message)
    process.exit(1)
  }

  let added = 0
  let updated = 0

  for (const [key, value] of Object.entries(newTranslations)) {
    const keys = key.split(".")
    let current = sv
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!current[k] || typeof current[k] !== "object") current[k] = {}
      current = current[k]
    }

    const lastKey = keys[keys.length - 1]
    if (current[lastKey] === undefined) added++
    else updated++

    current[lastKey] = value
  }

  fs.writeFileSync(svFile, JSON.stringify(sv, null, 2), "utf8")

  console.log(
    `Done. ${added} new keys added, ${updated} existing keys updated in sv.json`
  )
}

main().catch((err) => console.error(err))
