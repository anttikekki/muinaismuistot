import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"
import test from "node:test"

const project = resolve(import.meta.dirname, "../..")
const script = resolve(project, "processing/scripts/25-create-release-descriptor.sh")
const descriptorPath = resolve(project, "data/poc/release-descriptor.json")
const metadataPath = resolve(project, "data/poc/current-metadata.json")
const buildManifestPath = resolve(project, "data/poc/build-manifest.json")

function buildDescriptor() {
  const result = spawnSync(script, [], { cwd: project, encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(readFileSync(descriptorPath, "utf8"))
}

test("release uses the source publication timestamp and fixed active endpoints", () => {
  const first = buildDescriptor()
  const second = buildDescriptor()
  const metadata = JSON.parse(readFileSync(metadataPath, "utf8"))
  const buildManifest = JSON.parse(readFileSync(buildManifestPath, "utf8"))

  assert.equal(first.version, second.version)
  assert.match(first.version, /^\d{8}T000000Z$/)
  assert.equal(first.publishedAt, `${first.version.slice(0, 4)}-${first.version.slice(4, 6)}-${first.version.slice(6, 8)}T00:00:00Z`)
  assert.equal(first.state, "built")
  assert.equal(first.artifacts.pmtiles.activeR2Key, "current.pmtiles")
  assert.equal(first.artifacts.pmtiles.backupR2Key, `releases/${first.version}/map.pmtiles`)
  assert.equal(first.endpoints.pmtiles, "/api/museovirasto/pmtiles")
  assert.equal(first.endpoints.metadata, "/api/museovirasto/meta")
  assert.equal(first.endpoints.health, "/api/museovirasto/health")
  assert.equal(metadata.version, first.version)
  assert.deepEqual(first.counts, buildManifest.counts)
})
