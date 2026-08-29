import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { documentFileName, run } from "../8_download-source-documents.mjs"
import { DOCUMENT_CONFIG } from "../config.mjs"

test("PDF-lataus sallii suuret läänikohtaiset inventointiraportit", () => {
  assert.equal(DOCUMENT_CONFIG.maxPdfBytes, 500 * 1024 * 1024)
})

test("documentFileName säilyttää luettavan alkuperäisen nimen ja poistaa polkumerkit", () => {
  assert.equal(documentFileName("Nakkila Inventointi 2001"), "Nakkila Inventointi 2001.pdf")
  assert.equal(documentFileName('Kunta: raportti / osa 1'), "Kunta- raportti - osa 1.pdf")
})

test("vaihe 8 lataa kahden tietueen saman PDF:n vain kerran", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "document-download-test-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = createPaths(directory)
  await fs.mkdir(path.dirname(paths.documentIndexFile), { recursive: true })
  await fs.writeFile(paths.documentIndexFile, JSON.stringify({ records: [
    { recordId: "129.1", url: "https://www.kyppi.fi/to.aspx?id=129.1", siteIds: ["111"] },
    { recordId: "129.2", url: "https://www.kyppi.fi/to.aspx?id=129.2", siteIds: ["222"] }
  ] }))
  const pdfUrl = "https://www.kyppi.fi/x/hae_liite.aspx?id=9&ttyyppi=pdf"
  const html = `<span id="liite"><table><tr><td><a href="${pdfUrl}">PDF</a></td><td>Raportti</td></tr></table></span>`
  const calls = []
  const fetchImpl = async (url) => {
    calls.push(url)
    const isPdf = url === pdfUrl
    const body = Buffer.from(isPdf ? "%PDF-test" : html)
    return { ok: true, status: 200, url, headers: new Headers({ "content-type": isPdf ? "application/pdf" : "text/html" }), arrayBuffer: async () => body }
  }
  const config = { requestDelayMs: 0, requestTimeoutMs: 1000, userAgent: "test", maxPdfBytes: 1000 }
  const manifest = await run({ all: true, paths, config, fetchImpl, sleep: async () => {}, extractPdfText: async (_pdf, text) => fs.writeFile(text, "poimittu") })
  assert.equal(calls.filter((url) => url === pdfUrl).length, 1)
  assert.equal(manifest.documents.length, 1)
  assert.deepEqual(manifest.documents[0].recordIds, ["129.1", "129.2"])
  assert.deepEqual(manifest.documents[0].siteIds, ["111", "222"])
})

function createPaths(directory) {
  return {
    documentIndexFile: path.join(directory, "intermediate", "7_document-index.json"),
    documentRecordPagesDirectory: path.join(directory, "source-data", "record-pages"),
    documentsDirectory: path.join(directory, "source-data", "documents"),
    documentTextsDirectory: path.join(directory, "intermediate", "texts"),
    documentDownloadManifestFile: path.join(directory, "intermediate", "8_manifest.json")
  }
}
