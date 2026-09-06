import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"
import test from "node:test"
import { buildLayerSql, createBuildPlan } from "../../lib/layer-build-plan.mjs"
import { varkLinkedMjRegistryId } from "../../lib/vark-link.mjs"

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
    `SELECT "fid" AS "gpkg_fid", "fid" AS "source_fid", CAST("register" AS TEXT) AS "registry_id", trim("name") AS "name", CASE trim(lower("kind")) WHEN 'löytöpaikka' THEN 'loytopaikka' WHEN 'muu kohde' THEN 'muu_kohde' ELSE 'unknown' END AS "laji_key", AsGeoJSON("geom") AS "exact_geometry_json", "geom" AS "geom" FROM "source areas" WHERE "geom" IS NOT NULL`)
  assert.match(buildLayerSql(physical, build, vocabulary, { centroid: true }), /AsGeoJSON\(ST_Centroid\("geom"\)\) AS "exact_geometry_json", ST_Centroid\("geom"\) AS "geom"/)
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

test("extracts the linked archaeological registry ID from a VARK link", () => {
  assert.equal(varkLinkedMjRegistryId("https://www.kyppi.fi/vark.aspx?id=91500002"), "91500002")
  assert.equal(varkLinkedMjRegistryId(
    "https://www.kyppi.fi/palveluikkuna/VARKL/asp/v_kohde_det.aspx?KOHDE_ID=1000011245",
  ), "1000011245")
  assert.equal(varkLinkedMjRegistryId("https://www.kyppi.fi/vark.aspx"), null)
})

test("requires exactly the same physical and build layer IDs", () => {
  assert.throws(() => createBuildPlan({ physicalLayers: [physical] }, { layers: [] }, vocabulary),
    /build layer IDs differ/)
})

test("requires kind source mappings to produce exactly the versioned kinds", () => {
  assert.throws(() => createBuildPlan({ physicalLayers: [physical] }, { layers: [build] },
    { kinds: ["loytopaikka"], kindSourceValues: vocabulary.kindSourceValues }), /outputs differ/)
})

test("D1 transformer preserves the EPSG:3067 feature geometry", () => {
  const transformer = resolve(import.meta.dirname, "../../lib/compact-filter-data.mjs")
  const mapping = resolve(import.meta.dirname, "../../../../contract/layer-mapping.json")
  const input = JSON.stringify({
    type: "Feature",
    properties: {
      gpkg_fid: 1, registry_id: "1", name: "Test",
      vark_link_url: "https://www.kyppi.fi/vark.aspx?id=91500002",
      exact_geometry_json: { type: "Point", coordinates: [385000, 6670000] },
    },
    geometry: { type: "Point", coordinates: [385000, 6670000] },
  })
  const result = spawnSync("node", [transformer, "details", mapping, "vark_pisteet"], { input: `${input}\n`, encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"coordinates":\[385000,6670000\]/)
  assert.match(result.stdout, /linked_mj_registry_id.*91500002/)
  assert.doesNotMatch(result.stdout, /vark_link_url|https:\/\//)
  assert.doesNotMatch(result.stdout, /24\.94/)
})
