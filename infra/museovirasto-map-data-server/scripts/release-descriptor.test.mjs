import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"
import test from "node:test"

const project = resolve(import.meta.dirname, "..")
const script = resolve(project, "scripts/25-create-release-descriptor.sh")
const descriptorPath = resolve(project, "data/poc/release-descriptor.json")
const candidatePath = resolve(project, "data/poc/current-candidate.json")
const buildManifestPath = resolve(project, "data/poc/build-manifest.json")

function buildDescriptor() {
  const result = spawnSync(script, [], { cwd: project, encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(readFileSync(descriptorPath, "utf8"))
}

test("release descriptor is deterministic, versioned and inactive", () => {
  const first = buildDescriptor()
  const second = buildDescriptor()
  const candidate = JSON.parse(readFileSync(candidatePath, "utf8"))
  const buildManifest = JSON.parse(readFileSync(buildManifestPath, "utf8"))

  assert.equal(first.releaseId, second.releaseId)
  assert.match(first.releaseId, /^museovirasto-[0-9a-f]{20}$/)
  assert.equal(first.state, "built")
  assert.equal(candidate.state, "candidate")
  assert.equal(candidate.releaseId, first.releaseId)
  assert.equal(first.artifacts.pmtiles.r2Key, `datasets/${first.releaseId}/map.pmtiles`)
  assert.equal(first.artifacts.filterVocabulary.r2Key, `datasets/${first.releaseId}/filter-vocabulary.json`)
  assert.equal(first.artifacts.d1Import.releaseId, first.releaseId)
  assert.equal(first.endpoints.pmtiles, `/pmtiles/${first.releaseId}.pmtiles`)
  assert.deepEqual(first.counts, buildManifest.counts)
})
