import assert from "node:assert/strict"
import crypto from "node:crypto"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import {
  parseArguments,
  run,
  selectDownloadedEntries
} from "../3_extract-page-content.mjs"

const HTML = `<!doctype html><html><body>
  <div id="kohteen_sijaintikunta">Testikunta</div>
  <div id="kohteen_nimi">Testikohde</div>
  <div id="kohdetunnus">123</div>
  <table><tr><td class="norm1">Tyyppi:</td><td class="norm"><a>hautapaikat</a><a>hautaröykkiöt</a></td></tr>
  <tr><td class="norm">Ajoitus:</td><td class="norm">pronssikautinen</td></tr></table>
  <span id="koordinaatit">ETRS-TM35FIN P: 6800000 I: 250000</span>
  <span id="kuvaus"><table><tr><td class="norm">Halkaisija on 10 m.</td></tr></table></span>
</body></html>`

test("run tarkistaa tiivisteen ja kirjoittaa JSONL-tuloksen sekä raportin", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-parser-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  const pageFile = path.join(temporaryDirectory, "source-data", "pages", "123.html")
  await fs.mkdir(path.dirname(pageFile), { recursive: true })
  await fs.mkdir(path.dirname(paths.downloadManifestFile), { recursive: true })
  await fs.writeFile(pageFile, HTML, "utf8")
  await fs.writeFile(
    paths.downloadManifestFile,
    JSON.stringify(createManifest(pageFile, paths.downloadManifestFile)),
    "utf8"
  )

  const { parsedSites, report } = await run({
    paths,
    now: () => new Date("2026-08-02T12:00:00.000Z")
  })

  assert.equal(parsedSites.length, 1)
  assert.equal(parsedSites[0].description, "Halkaisija on 10 m.")
  assert.equal(parsedSites[0].source.file, "../source-data/pages/123.html")
  assert.deepEqual(report, {
    schemaVersion: 1,
    generatedAt: "2026-08-02T12:00:00.000Z",
    sourceManifest: "2_download-manifest.json",
    selection: { siteIds: [], limit: null },
    parsedSites: 1,
    sitesWithDescription: 1,
    sitesNeedingReview: 0,
    warnings: 0
  })

  const jsonLines = (await fs.readFile(paths.parsedSiteContentFile, "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse)
  assert.equal(jsonLines.length, 1)
  assert.equal(jsonLines[0].mjtunnus, "123")
})

test("run hylkää lähdetiedoston, jonka tiiviste on muuttunut", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-parser-hash-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  const pageFile = path.join(temporaryDirectory, "source-data", "pages", "123.html")
  await fs.mkdir(path.dirname(pageFile), { recursive: true })
  await fs.mkdir(path.dirname(paths.downloadManifestFile), { recursive: true })
  await fs.writeFile(pageFile, HTML, "utf8")
  const manifest = createManifest(pageFile, paths.downloadManifestFile)
  manifest.sites[0].sha256 = "0".repeat(64)
  await fs.writeFile(paths.downloadManifestFile, JSON.stringify(manifest), "utf8")

  await assert.rejects(run({ paths }), /SHA-256-tiiviste ei täsmää/)
})

test("selectDownloadedEntries valitsee vain onnistuneet lataukset", () => {
  const manifest = {
    sites: [
      { mjtunnus: "1", status: "success" },
      { mjtunnus: "2", status: "failed" },
      { mjtunnus: "3", status: "success" }
    ]
  }

  assert.deepEqual(
    selectDownloadedEntries(manifest, { limit: 1 }).map((entry) => entry.mjtunnus),
    ["1"]
  )
  assert.deepEqual(
    selectDownloadedEntries(manifest, { siteIds: ["3"] }).map(
      (entry) => entry.mjtunnus
    ),
    ["3"]
  )
  assert.throws(
    () => selectDownloadedEntries(manifest, { siteIds: ["2"] }),
    /Onnistuneesti ladattua kohdetta 2 ei löydy/
  )
})

test("parseArguments käsittelee rajauksen ja hylkää tuntemattoman valinnan", () => {
  assert.deepEqual(parseArguments(["--site", "123", "--site", "456"]), {
    siteIds: ["123", "456"]
  })
  assert.deepEqual(parseArguments(["--limit", "5"]), {
    siteIds: [],
    limit: 5
  })
  assert.throws(() => parseArguments(["--unknown"]), /Tuntematon/)
})

function createPaths(directory) {
  return {
    downloadManifestFile: path.join(
      directory,
      "intermediate",
      "2_download-manifest.json"
    ),
    parsedSiteContentFile: path.join(
      directory,
      "intermediate",
      "3_site-content.jsonl"
    ),
    parseReportFile: path.join(
      directory,
      "intermediate",
      "3_parse-report.json"
    )
  }
}

function createManifest(pageFile, manifestFile) {
  return {
    sites: [
      {
        mjtunnus: "123",
        status: "success",
        sourceUrl: "https://www.kyppi.fi/to.aspx?id=112.123",
        finalUrl: "https://www.kyppi.fi/example/123",
        fetchedAt: "2026-08-02T11:00:00.000Z",
        file: path.relative(path.dirname(manifestFile), pageFile),
        contentType: "text/html; charset=utf-8",
        sha256: crypto.createHash("sha256").update(HTML).digest("hex")
      }
    ]
  }
}
