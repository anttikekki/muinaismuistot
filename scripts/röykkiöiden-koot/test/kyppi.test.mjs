import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { parseArguments, run } from "../1_fetch-site-index.mjs"
import { WFS_CONFIG } from "../config.mjs"
import {
  buildWfsUrl,
  fetchSiteIndex,
  normalizeFeature
} from "../lib/kyppi.mjs"

const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))

const [firstPage, secondPage] = await Promise.all([
  readFixture("wfs-page-0.json"),
  readFixture("wfs-page-2.json")
])

test("buildWfsUrl muodostaa WFS 2.0.0 -kyselyn ja enkoodaa CQL-filtterin", () => {
  const url = buildWfsUrl({
    ...WFS_CONFIG,
    count: 50,
    startIndex: 100
  })

  assert.equal(url.origin + url.pathname, WFS_CONFIG.endpoint)
  assert.equal(url.searchParams.get("service"), "WFS")
  assert.equal(url.searchParams.get("acceptversions"), "2.0.0")
  assert.equal(url.searchParams.get("request"), "GetFeature")
  assert.equal(url.searchParams.get("typeNames"), WFS_CONFIG.typeNames)
  assert.equal(url.searchParams.get("count"), "50")
  assert.equal(url.searchParams.get("startIndex"), "100")
  assert.equal(url.searchParams.get("outputFormat"), "application/json")
  assert.equal(url.searchParams.get("cql_filter"), WFS_CONFIG.cqlFilter)
})

test("normalizeFeature siistii merkkijonot ja moniarvokentät", () => {
  const source = structuredClone(firstPage.features[1])
  const normalized = normalizeFeature(source)

  assert.equal(normalized.properties.mjtunnus, "6010009")
  assert.equal(normalized.properties.kohdenimi, "Isovarenmäki")
  assert.equal(normalized.properties.kunta, "Loimaa")
  assert.equal(normalized.properties.Laji, "kiinteä muinaisjäännös")
  assert.deepEqual(normalized.properties.tyyppi, ["hautapaikat"])
  assert.deepEqual(normalized.properties.alatyyppi, ["hautaröykkiöt"])
  assert.deepEqual(normalized.properties.ajoitus, [
    "pronssikautinen",
    "rautakautinen"
  ])
  assert.equal(normalized.properties.selite, "")

  assert.equal(source.properties.mjtunnus, 6010009)
  assert.equal(source.properties.kohdenimi, "Isovarenmäki     ")
})

test("normalizeFeature muuntaa puuttuvan moniarvokentän tyhjäksi taulukoksi", () => {
  const source = structuredClone(firstPage.features[0])
  source.properties.ajoitus = null

  const normalized = normalizeFeature(source)

  assert.deepEqual(normalized.properties.ajoitus, [])
})

test("fetchSiteIndex hakee kaikki sivut järjestyksessä", async () => {
  const requestedStartIndexes = []
  const pages = new Map([
    ["0", firstPage],
    ["2", secondPage]
  ])

  const result = await fetchSiteIndex({
    config: { ...WFS_CONFIG, retryCount: 0 },
    pageSize: 2,
    fetchImpl: async (url) => {
      const startIndex = url.searchParams.get("startIndex")
      requestedStartIndexes.push(startIndex)
      return jsonResponse(pages.get(startIndex))
    }
  })

  assert.deepEqual(requestedStartIndexes, ["0", "2"])
  assert.equal(result.numberMatched, 3)
  assert.equal(result.normalizedFeatures.length, 3)
  assert.deepEqual(
    result.normalizedFeatures.map((feature) => feature.properties.mjtunnus),
    ["4010002", "6010009", "123456789"]
  )
})

test("fetchSiteIndex hylkää eri sivuilla toistuvan mjtunnuksen", async () => {
  const duplicatePage = structuredClone(secondPage)
  duplicatePage.features[0].properties.mjtunnus = 4010002

  await assert.rejects(
    fetchSiteIndex({
      config: { ...WFS_CONFIG, retryCount: 0 },
      pageSize: 2,
      fetchImpl: async (url) =>
        jsonResponse(
          url.searchParams.get("startIndex") === "0" ? firstPage : duplicatePage
        )
    }),
    /mjtunnus-duplikaatin 4010002/
  )
})

test("run tallentaa raakavastaukset, Featuret, manifestin ja kohdeluettelon", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = {
    wfsPagesDirectory: path.join(temporaryDirectory, "source-data", "pages"),
    wfsFeaturesDirectory: path.join(
      temporaryDirectory,
      "source-data",
      "features"
    ),
    siteIndexFile: path.join(temporaryDirectory, "intermediate", "sites.geojson"),
    manifestFile: path.join(temporaryDirectory, "intermediate", "manifest.json")
  }
  const pages = new Map([
    ["0", firstPage],
    ["2", secondPage]
  ])

  const result = await run({
    pageSize: 2,
    config: { ...WFS_CONFIG, retryCount: 0 },
    paths,
    now: () => new Date("2026-08-02T12:00:00.000Z"),
    fetchImpl: async (url) =>
      jsonResponse(pages.get(url.searchParams.get("startIndex")))
  })

  assert.equal(result.manifest.numberMatched, 3)
  assert.equal(result.manifest.numberReturned, 3)
  assert.equal(
    result.manifest.pages[0].file,
    path.join("..", "source-data", "pages", "00000000.json")
  )
  assert.equal(result.featureCollection.features.length, 3)

  const rawFeature = JSON.parse(
    await fs.readFile(
      path.join(paths.wfsFeaturesDirectory, "4010002.geojson"),
      "utf8"
    )
  )
  const normalizedCollection = JSON.parse(
    await fs.readFile(paths.siteIndexFile, "utf8")
  )
  const pageFiles = await fs.readdir(paths.wfsPagesDirectory)

  assert.equal(rawFeature.properties.mjtunnus, 4010002)
  assert.equal(rawFeature.properties.kohdenimi, "Suorsanmäki     ")
  assert.equal(normalizedCollection.properties, undefined)
  assert.equal(
    normalizedCollection.features[0].properties.kohdenimi,
    "Suorsanmäki"
  )
  assert.deepEqual(pageFiles.sort(), ["00000000.json", "00000002.json"])
})

test("parseArguments käsittelee tuetut valinnat ja hylkää virheelliset", () => {
  assert.deepEqual(parseArguments(["--page-size", "25", "--limit", "3"]), {
    pageSize: 25,
    limit: 3
  })
  assert.deepEqual(parseArguments(["--help"]), { help: true })
  assert.throws(() => parseArguments(["--limit", "0"]), /positiivinen/)
  assert.throws(() => parseArguments(["--unknown"]), /Tuntematon/)
})

async function readFixture(name) {
  const file = path.join(TEST_DIRECTORY, "fixtures", name)
  return JSON.parse(await fs.readFile(file, "utf8"))
}

function jsonResponse(value) {
  return {
    ok: true,
    status: 200,
    json: async () => structuredClone(value)
  }
}
