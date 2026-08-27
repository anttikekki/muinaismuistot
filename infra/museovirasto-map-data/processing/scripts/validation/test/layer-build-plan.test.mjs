import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"
import test from "node:test"
import { buildLayerSql, createBuildPlan } from "../../lib/layer-build-plan.mjs"

const physical = {
  id: "areas", geoPackageFile: "areas.gpkg", geoPackageLayer: "source areas",
  featureIdentity: { rowIdField: "fid" }, excludedNullGeometries: 1,
}
const build = {
  id: "areas", transformProfile: "logical-filter", lowZoomCentroid: true,
  fields: [
    { source: "register", target: "registry_id", transform: "text" },
    { source: "name", target: "name", transform: "trim" },
    { source: "kind", target: "laji_key", transform: "kind" },
  ],
}
const vocabulary = {
  kinds: ["loytopaikka", "muu_kohde"],
  kindSourceValues: { "löytöpaikka": "loytopaikka", "muu kohde": "muu_kohde" },
}

test("generates ordinary and centroid SQL from declarative fields", () => {
  assert.equal(buildLayerSql(physical, build, vocabulary),
    `SELECT "fid" AS "gpkg_fid", "fid" AS "source_fid", CAST("register" AS TEXT) AS "registry_id", trim("name") AS "name", CASE trim(lower("kind")) WHEN 'löytöpaikka' THEN 'loytopaikka' WHEN 'muu kohde' THEN 'muu_kohde' ELSE 'unknown' END AS "laji_key", "geom" FROM "source areas" WHERE "geom" IS NOT NULL`)
  assert.match(buildLayerSql(physical, build, vocabulary, { centroid: true }), /ST_Centroid\("geom"\) AS "geom"/)
})

test("joins multiple optional source fields without empty separators", () => {
  const layer = {
    ...build,
    fields: [
      { sources: ["dating", "dating2"], target: "datings_raw", transform: "join" },
    ],
  }
  const sql = buildLayerSql(physical, layer, vocabulary)
  assert.match(sql, /NULLIF\(trim\(CAST\("dating" AS TEXT\)\), ''\)/)
  assert.match(sql, /NULLIF\(trim\(CAST\("dating2" AS TEXT\)\), ''\)/)
  assert.match(sql, /THEN ', ' ELSE '' END/)
})

test("requires exactly the same physical and build layer IDs", () => {
  assert.throws(() => createBuildPlan({ physicalLayers: [physical] }, { layers: [] }, vocabulary),
    /build layer IDs differ/)
})

test("requires kind source mappings to produce exactly the versioned kinds", () => {
  assert.throws(() => createBuildPlan({ physicalLayers: [physical] }, { layers: [build] },
    { kinds: ["loytopaikka"], kindSourceValues: vocabulary.kindSourceValues }), /outputs differ/)
})

test("D1 transformer uses the reprojected feature geometry", () => {
  const transformer = resolve(import.meta.dirname, "../../lib/compact-filter-data.mjs")
  const mapping = resolve(import.meta.dirname, "../../../../contract/layer-mapping.json")
  const input = JSON.stringify({
    type: "Feature",
    properties: { gpkg_fid: 1, registry_id: "1", name: "Test", exact_geometry_json: { type: "Point", coordinates: [385000, 6670000] } },
    geometry: { type: "Point", coordinates: [24.94, 60.17] },
  })
  const result = spawnSync("node", [transformer, "details", mapping, "vark_pisteet"], { input: `${input}\n`, encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"coordinates":\[24\.94,60\.17\]/)
  assert.doesNotMatch(result.stdout, /385000/)
})
