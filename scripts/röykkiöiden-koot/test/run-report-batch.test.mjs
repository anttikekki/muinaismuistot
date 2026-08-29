import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { mergeDocumentIndexes, parseArguments, run } from "../run-report-batch.mjs"

test("batch-komento vaatii yhden rajauksen ja lukee --no-llm-valinnan", () => {
  assert.deepEqual(parseArguments(["--limit", "50", "--no-llm"]), { siteIds: [], noLlm: true, all: false, limit: 50 })
  assert.deepEqual(parseArguments(["--site", "123", "--site", "456"]), { siteIds: ["123", "456"], noLlm: false, all: false })
  assert.deepEqual(parseArguments(["--all"]), { siteIds: [], noLlm: false, all: true })
  assert.throws(() => parseArguments([]), /täsmälleen yksi rajaus/)
  assert.throws(() => parseArguments(["--all", "--limit", "2"]), /täsmälleen yksi rajaus/)
})

test("dokumentti-indeksien yhdistäminen säilyttää aiemmat kohteet ja deduplikoi tietueet", () => {
  const merged = mergeDocumentIndexes({
    sites: [{ mjtunnus: "1", recordIds: ["a"] }],
    records: [{ recordId: "a", titles: ["Vanha"], siteIds: ["1"] }]
  }, {
    schemaVersion: 1, generatedAt: "now", selection: { siteIds: ["2"] },
    sites: [{ mjtunnus: "2", recordIds: ["a"] }],
    records: [{ recordId: "a", titles: ["Uusi"], siteIds: ["2"] }]
  })
  assert.deepEqual(merged.sites.map((site) => site.mjtunnus), ["1", "2"])
  assert.deepEqual(merged.records[0].titles, ["Vanha", "Uusi"])
  assert.deepEqual(merged.records[0].siteIds, ["1", "2"])
  assert.equal(merged.selection.cumulative, true)
})

test("--no-llm ajaa vaiheet 7–9 ja pysähtyy ennen API-vaihetta", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "report-batch-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const paths = {
    documentIndexFile: path.join(directory, "7.json"),
    documentCoverageReportFile: path.join(directory, "9-coverage.json")
  }
  const calls = []
  const runCommand = async (script, args) => {
    calls.push([script, args])
    if (script.startsWith("7_")) await fs.writeFile(paths.documentIndexFile, JSON.stringify({ sites: [], records: [], selection: {} }))
    if (script.startsWith("9_")) await fs.writeFile(paths.documentCoverageReportFile, JSON.stringify({ totalSites: 4, counts: { ready_for_llm: 3 } }))
  }
  const messages = []
  const result = await run({ options: parseArguments(["--limit", "4", "--no-llm"]), paths, runCommand, log: (message) => messages.push(message) })
  assert.deepEqual(calls, [
    ["7_index-source-documents.mjs", ["--limit", "4"]],
    ["8_download-source-documents.mjs", ["--all"]],
    ["9_extract-document-passages.mjs", []]
  ])
  assert.equal(result.stoppedAfter, 9)
  assert.ok(messages.some((message) => message.includes("enintään 3")))
})
