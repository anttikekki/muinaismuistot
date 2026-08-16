import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { calculateDerivedMeasurements, renderDatabaseHtml, run } from "../6_build-database.mjs"

test("vaihe 6 tekee jokaisesta hyväksytystä röykkiöstä oman Featuren", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mound-database-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = createPaths(directory)
  await fs.writeFile(paths.siteIndexFile, JSON.stringify(siteIndex()))
  await fs.writeFile(paths.validatedResultsFile, [
    validatedSite("123", "accepted", [mound(1), mound(2)]),
    validatedSite("456", "review", [mound(1)])
  ].map(JSON.stringify).join("\n") + "\n")

  const { collection, report } = await run({ paths, now: () => new Date("2026-08-16T12:00:00Z") })
  assert.deepEqual(collection.features.map((feature) => feature.id), ["123-1", "123-2", "456-1"])
  assert.deepEqual(collection.features[0].geometry.coordinates, [250000, 6800000])
  assert.equal(collection.features[0].properties.name, "Testikohde")
  assert.equal(collection.features[0].properties.sourceOrder, 1)
  assert.deepEqual(collection.features[0].properties.missingMeasurements, ["lengthM", "widthM", "heightM"])
  assert.deepEqual(collection.features[0].properties.areaM2, {
    min: 50.265, max: 50.265, approximate: false, method: "circle"
  })
  assert.equal(collection.features[0].properties.volumeM3, null)
  assert.equal("mounds" in collection.features[0].properties, false)
  assert.equal(report.publishedMounds, 3)
  assert.equal(report.publishedReviewSites, 1)
  assert.equal(collection.features[2].properties.validationStatus, "review")
  assert.deepEqual(collection.features[2].properties.validationIssues, ["model_review"])
  assert.deepEqual(JSON.parse(await fs.readFile(paths.moundsDatabaseFile)), collection)
})

test("johdetut mitat käyttävät ellipsin pinta-alaa ja puolikkaan ellipsoidin tilavuutta", () => {
  assert.deepEqual(calculateDerivedMeasurements({
    lengthM: { min: 10, max: 12, approximate: false },
    widthM: { min: 6, max: 8, approximate: true },
    diameterM: null,
    heightM: { min: 0.5, max: 1, approximate: false }
  }), {
    areaM2: { min: 47.124, max: 75.398, approximate: true, method: "ellipse" },
    volumeM3: { min: 15.708, max: 50.265, approximate: true, method: "half_ellipsoid" }
  })
})

test("johdettuja mittoja ei lasketa ilman tarvittavia lähdemittoja", () => {
  assert.deepEqual(calculateDerivedMeasurements({
    lengthM: { min: 10, max: 10, approximate: false },
    widthM: null,
    diameterM: null,
    heightM: { min: 1, max: 1, approximate: false }
  }), { areaM2: null, volumeM3: null })
})

test("vaihe 6 hylkää puuttuvan geometrian", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mound-database-invalid-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = createPaths(directory)
  const index = siteIndex()
  index.features[0].geometry = null
  await fs.writeFile(paths.siteIndexFile, JSON.stringify(index))
  await fs.writeFile(paths.validatedResultsFile, `${JSON.stringify(validatedSite("123", "accepted", [mound(1)]))}\n`)
  await assert.rejects(run({ paths }), /geometria ei ole kelvollinen piste/)
})

function createPaths(directory) {
  return {
    siteIndexFile: path.join(directory, "1.geojson"),
    validatedResultsFile: path.join(directory, "5.jsonl"),
    moundsDatabaseFile: path.join(directory, "results", "6.geojson"),
    moundsDatabaseHtmlFile: path.join(directory, "results", "6.html"),
    databaseBuildReportFile: path.join(directory, "results", "report.json")
  }
}

test("vaiheen 6 HTML-näkymä sisältää tärkeät sarakkeet ja järjestämistoiminnon", () => {
  const html = renderDatabaseHtml({
    metadata: { generatedAt: "2026-08-16T12:00:00Z" },
    features: [{ properties: {
      name: "Testi & kohde", municipality: "Testikunta", mjtunnus: "123", sourceOrder: 1,
      validationStatus: "review",
      sourceUrl: "https://example.test/123", lengthM: null, widthM: null,
      diameterM: { min: 8, max: 8, approximate: false }, heightM: null,
      areaM2: { min: 50.265, max: 50.265, approximate: false }, volumeM3: null
    } }]
  })
  assert.match(html, /Pinta-ala \(m²\)/)
  assert.match(html, /Tilavuus \(m³\)/)
  assert.match(html, /Validointi/)
  assert.match(html, /Testi &amp; kohde/)
  assert.match(html, /sortRows/)
  assert.match(html, /data-sort="50.265"/)
})

function mound(sourceOrder) {
  return {
    sourceOrder, lengthM: null, widthM: null,
    diameterM: { min: 8, max: 8, approximate: false }, heightM: null,
    shape: "pyöreä", status: null, confidence: "high", needsReview: false,
    evidence: ["Halkaisija on 8 m."]
  }
}

function validatedSite(mjtunnus, status, mounds) {
  return {
    mjtunnus, statedMoundCount: mounds.length, mounds, notes: [],
    extraction: { createdAt: "2026-08-16T11:00:00Z", model: "gpt-test", promptVersion: 4, resultSchemaVersion: 2 },
    validation: { status, issues: status === "accepted" ? [] : [{ code: "model_review" }] }
  }
}

function siteIndex() {
  return {
    type: "FeatureCollection",
    crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::3067" } },
    features: [
      {
        type: "Feature", id: "source.123",
        geometry: { type: "Point", coordinates: [250000, 6800000] },
        properties: {
          mjtunnus: "123", kohdenimi: "Testikohde", kunta: "Testikunta",
          url: "https://example.test/123", Laji: "kiinteä muinaisjäännös",
          tyyppi: ["hautapaikat"], alatyyppi: ["hautaröykkiöt"], ajoitus: ["pronssikautinen"]
        }
      },
      { type: "Feature", id: "source.456", geometry: { type: "Point", coordinates: [260000, 6810000] }, properties: { mjtunnus: "456" } }
    ]
  }
}
