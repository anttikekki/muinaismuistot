#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { resolve } from "node:path"

const project = resolve(import.meta.dirname, "../..")
const archive = resolve(project, "data/tutkija.zip")
const listing = spawnSync("unzip", ["-l", archive], { encoding: "utf8" })
if (listing.status !== 0) throw new Error(`Could not inspect source ZIP: ${listing.stderr.trim()}`)

const dates = new Set()
for (const line of listing.stdout.split("\n")) {
  const entry = line.match(/\s(\d{2,4})-(\d{2})-(\d{2,4})\s+\d{2}:\d{2}\s+.*\.gpkg\s*$/i)
  if (!entry) continue

  // Info-ZIP prints dates as MM-DD-YYYY on macOS and YYYY-MM-DD on Linux.
  const [, first, middle, last] = entry
  dates.add(first.length === 4 ? `${first}-${middle}-${last}` : `${last}-${first}-${middle}`)
}
if (dates.size !== 1) throw new Error(`Expected one GeoPackage publication date in ZIP, got: ${[...dates].join(", ") || "none"}`)

const publishedDate = [...dates][0]
const publishedAt = `${publishedDate}T00:00:00Z`
const version = `${publishedDate.replaceAll("-", "")}T000000Z`
process.stdout.write(`${JSON.stringify({ schemaVersion: 1, version, publishedAt, source: "GeoPackage ZIP entry date normalized to 00:00 UTC" })}\n`)
