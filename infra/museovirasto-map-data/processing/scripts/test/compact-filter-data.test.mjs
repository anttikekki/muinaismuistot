import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import test from "node:test"

const project = resolve(import.meta.dirname, "../../..")
const transformer = join(project, "processing/scripts/lib/compact-filter-data.mjs")
const vocabulary = join(project, "contract/filter-vocabulary.json")
const mapping = join(project, "contract/layer-mapping.json")

function run(command, args, input = "") {
  return spawnSync(command, args, { input, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
}

function feature(fid, registryId, overrides = {}) {
  const geometry = { type: "Point", coordinates: [24.94 + fid / 100000, 60.17] }
  return JSON.stringify({
    type: "Feature",
    properties: {
      gpkg_fid: fid,
      registry_id: registryId,
      name: `Kohde ${fid}`,
      municipality: "Testikunta",
      laji_key: "kiintea_muinaisjaannos",
      types_raw: "asuinpaikat, hautapaikat",
      subtypes_raw: "hautaröykkiöt, kuppikalliot",
      datings_raw: "kivikautinen, pronssikautinen",
      exact_geometry_json: geometry,
      ...overrides,
    },
    geometry,
  })
}

test("codes kind and multi-value classifications using the versioned vocabulary", () => {
  const result = run("node", [transformer, "transform", vocabulary, "archaeological_points", "archaeological-filters"], `${feature(41, "same-register")}\n`)
  assert.equal(result.status, 0, result.stderr)
  const transformed = JSON.parse(result.stdout)
  assert.deepEqual(transformed.properties, {
    source_fid: 41,
    laji_key: 2,
    type_mask: 12,
    dating_mask: 20,
    subtype_codes: "c.20",
  })
})

for (const [label, overrides, error] of [
  ["kind", { laji_key: "tuntematon_laji" }, "Unknown laji_key"],
  ["type", { types_raw: "tuntematon tyyppi" }, "Unknown type value"],
  ["dating", { datings_raw: "tuntematon ajoitus" }, "Unknown dating value"],
  ["subtype", { subtypes_raw: "tuntematon alatyyppi" }, "Unknown subtype value"],
]) {
  test(`rejects an unknown ${label}`, () => {
    const result = run("node", [transformer, "transform", vocabulary, "archaeological_points", "archaeological-filters"], `${feature(41, "register", overrides)}\n`)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, new RegExp(error))
  })
}

test("small PMTiles and D1 builds retain matching ids and duplicate registry rows", () => {
  const directory = mkdtempSync(join(tmpdir(), "museovirasto-build-test-"))
  const source = `${feature(41, "same-register")}\n${feature(42, "same-register")}\n`
  const transformed = run("node", [transformer, "transform", vocabulary, "archaeological_points", "archaeological-filters"], source)
  assert.equal(transformed.status, 0, transformed.stderr)
  const geojson = join(directory, "points.geojsonseq")
  const archive = join(directory, "test.pmtiles")
  writeFileSync(geojson, transformed.stdout)

  const tileBuild = run("tippecanoe", [
    `--output=${archive}`, "--force", "--minimum-zoom=0", "--maximum-zoom=0",
    "--no-feature-limit", "--no-tile-size-limit", "--use-attribute-for-id=source_fid",
    `--named-layer=archaeological_points:${geojson}`,
  ])
  assert.equal(tileBuild.status, 0, tileBuild.stderr)
  const decoded = run("tippecanoe-decode", [archive, "0", "0", "0"])
  assert.equal(decoded.status, 0, decoded.stderr)
  const document = JSON.parse(decoded.stdout)
  const layer = document.features.find((item) => item.properties.layer === "archaeological_points")
  assert.deepEqual(layer.features.map((item) => item.id).sort((a, b) => a - b), [41, 42])
  assert.deepEqual(layer.features[0].properties, {
    laji_key: 2,
    type_mask: 12,
    dating_mask: 20,
    subtype_codes: "c.20",
  })

  const details = run("node", [transformer, "details", mapping, "archaeological_points"], source)
  assert.equal(details.status, 0, details.stderr)
  assert.equal((details.stdout.match(/'same-register'/g) ?? []).length, 2)
  assert.match(details.stdout, /'archaeological_points', 41,/)
  assert.match(details.stdout, /'archaeological_points', 42,/)
})
