import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { parseArguments, run, selectSites } from "../2_download-pages.mjs"
import { KYPPI_CONFIG } from "../config.mjs"

const VALID_HTML = `<!DOCTYPE HTML>
<html><head><title>Kulttuuriymp&auml;rist&ouml;n palveluikkuna</title></head>
<body><span id="kuvaus">Kuvaus</span></body></html>`

test("selectSites valitsee pyydetyt tunnukset lähdejärjestyksestä riippumatta", () => {
  const index = createSiteIndex()
  const selected = selectSites(index, {
    siteIds: ["6010009", "4010002"]
  })

  assert.deepEqual(
    selected.map((site) => site.properties.mjtunnus),
    ["6010009", "4010002"]
  )
  assert.throws(
    () => selectSites(index, { siteIds: ["999"] }),
    /ei löydy mjtunnusta 999/
  )
})

test("run lataa valitun sivun ja ohittaa ehjän välimuistin seuraavalla ajolla", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-download-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  await fs.mkdir(path.dirname(paths.siteIndexFile), { recursive: true })
  await fs.writeFile(
    paths.siteIndexFile,
    `${JSON.stringify(createSiteIndex())}\n`,
    "utf8"
  )

  let requestCount = 0
  const fetchImpl = async () => {
    requestCount += 1
    return htmlResponse(VALID_HTML)
  }
  const options = {
    siteIds: ["4010002"],
    config: { ...KYPPI_CONFIG, retryCount: 0 },
    requestDelayMs: 250,
    paths,
    fetchImpl,
    now: () => new Date("2026-08-02T12:00:00.000Z"),
    sleep: async () => {}
  }

  const firstManifest = await run(options)
  assert.equal(firstManifest.lastRun.downloaded, 1)
  assert.equal(firstManifest.lastRun.skipped, 0)
  assert.equal(firstManifest.lastRun.failed, 0)
  assert.equal(requestCount, 1)

  const outputFile = path.join(paths.kyppiPagesDirectory, "4010002.html")
  assert.equal(await fs.readFile(outputFile, "utf8"), VALID_HTML)
  assert.equal(firstManifest.sites[0].status, "success")
  assert.equal(firstManifest.sites[0].file, "../source-data/pages/4010002.html")
  assert.match(firstManifest.sites[0].sha256, /^[a-f0-9]{64}$/)

  const cachedManifest = await run(options)
  assert.equal(cachedManifest.lastRun.downloaded, 0)
  assert.equal(cachedManifest.lastRun.skipped, 1)
  assert.equal(requestCount, 1)

  const forcedManifest = await run({ ...options, force: true })
  assert.equal(forcedManifest.lastRun.downloaded, 1)
  assert.equal(forcedManifest.lastRun.skipped, 0)
  assert.equal(requestCount, 2)
})

test("run tallentaa epäonnistumisen manifestiin", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-download-error-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  await fs.mkdir(path.dirname(paths.siteIndexFile), { recursive: true })
  await fs.writeFile(paths.siteIndexFile, JSON.stringify(createSiteIndex()), "utf8")

  const manifest = await run({
    siteIds: ["4010002"],
    config: { ...KYPPI_CONFIG, retryCount: 0 },
    requestDelayMs: 250,
    paths,
    fetchImpl: async () => htmlResponse("<html>virhesivu</html>"),
    sleep: async () => {}
  })

  assert.equal(manifest.lastRun.failed, 1)
  assert.equal(manifest.sites[0].status, "failed")
  assert.match(manifest.sites[0].error, /lataus epäonnistui/)
})

test("parseArguments vaatii turvallisen valinnan ja lukee asetukset", async () => {
  assert.deepEqual(
    parseArguments([
      "--site",
      "4010002",
      "--site",
      "6010009",
      "--force",
      "--concurrency",
      "2",
      "--delay-ms",
      "500"
    ]),
    {
      siteIds: ["4010002", "6010009"],
      force: true,
      concurrency: 2,
      requestDelayMs: 500
    }
  )
  assert.deepEqual(parseArguments(["--all"]), { siteIds: [], all: true })
  assert.throws(() => parseArguments(["--site", "abc"]), /numeerinen/)

  await assert.rejects(
    run({ siteIds: [], all: false, limit: undefined }),
    /täsmälleen yksi valinnoista/
  )
})

function createSiteIndex() {
  return {
    type: "FeatureCollection",
    features: [
      createFeature("4010002"),
      createFeature("6010009")
    ]
  }
}

function createFeature(mjtunnus) {
  return {
    type: "Feature",
    id: `feature.${mjtunnus}`,
    geometry: { type: "Point", coordinates: [250000, 6800000] },
    properties: {
      mjtunnus,
      url: `https://www.kyppi.fi/to.aspx?id=112.${mjtunnus}`
    }
  }
}

function createPaths(directory) {
  return {
    siteIndexFile: path.join(directory, "intermediate", "1_sites.geojson"),
    kyppiPagesDirectory: path.join(directory, "source-data", "pages"),
    downloadManifestFile: path.join(
      directory,
      "intermediate",
      "2_download-manifest.json"
    )
  }
}

function htmlResponse(html) {
  const bytes = new TextEncoder().encode(html)
  return {
    ok: true,
    status: 200,
    url: "https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx",
    headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
    arrayBuffer: async () => bytes.buffer
  }
}
