import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import {
  parseArguments,
  run
} from "../4_extract-mound-dimensions.mjs"
import { OPENAI_CONFIG } from "../config.mjs"

test("run tekee API-kutsun, tallentaa välimuistin ja käyttää sitä seuraavalla ajolla", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-llm-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  await writeSites(paths.parsedSiteContentFile, [createSite("123"), createSite("456")])
  let apiCalls = 0
  const client = createClient(() => {
    apiCalls += 1
  })
  const options = {
    siteIds: ["123"],
    paths,
    client,
    now: () => new Date("2026-08-02T12:00:00.000Z")
  }

  const first = await run(options)
  assert.equal(first.report.apiCalls, 1)
  assert.equal(first.report.cacheHits, 0)
  assert.equal(first.report.successfulSites, 1)
  assert.equal(first.report.failedSites, 0)
  assert.deepEqual(first.report.usage, {
    inputTokens: 100,
    cachedInputTokens: 20,
    outputTokens: 50,
    reasoningTokens: 10,
    totalTokens: 150
  })
  assert.equal(first.output[0].mounds[0].diameterM.min, 11)
  assert.equal(apiCalls, 1)

  const cached = await run({ ...options, client: undefined })
  assert.equal(cached.report.apiCalls, 0)
  assert.equal(cached.report.cacheHits, 1)
  assert.equal(cached.report.successfulSites, 1)
  assert.equal(apiCalls, 1)

  const cacheFiles = await fs.readdir(paths.llmResponsesDirectory)
  assert.equal(cacheFiles.filter((file) => file.endsWith(".json")).length, 1)
  const outputLines = (await fs.readFile(paths.moundDimensionsFile, "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse)
  assert.equal(outputLines[0].mjtunnus, "123")
  assert.equal(outputLines[0].extraction.model, OPENAI_CONFIG.model)
})

test("run tallentaa virheen ja --retry-failed käsittelee sen myöhemmin", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-llm-retry-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  await writeSites(paths.parsedSiteContentFile, [createSite("123"), createSite("456")])
  const failingClient = {
    responses: {
      create: async () => {
        const error = new Error("rate limit")
        error.status = 429
        error.request_id = "req_test"
        throw error
      }
    }
  }

  const failed = await run({ siteIds: ["456"], paths, client: failingClient })
  assert.equal(failed.report.failedSites, 1)
  assert.equal(failed.report.failures[0].status, 429)
  assert.equal(failed.report.failures[0].requestId, "req_test")

  const retried = await run({ retryFailed: true, paths, client: createClient() })
  assert.equal(retried.report.selectedSites, 1)
  assert.equal(retried.report.apiCalls, 1)
  assert.equal(retried.report.successfulSites, 1)
  assert.equal(retried.output[0].mjtunnus, "456")

  const noFailuresLeft = await run({
    retryFailed: true,
    paths,
    client: undefined
  })
  assert.equal(noFailuresLeft.report.selectedSites, 0)
  assert.equal(noFailuresLeft.report.apiCalls, 0)
})

test("rajattu ajo säilyttää muiden kohteiden välimuistitulokset JSONL-tiedostossa", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "roykkioiden-koot-llm-aggregate-test-")
  )
  t.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }))

  const paths = createPaths(temporaryDirectory)
  await writeSites(paths.parsedSiteContentFile, [createSite("123"), createSite("456")])
  const client = createClient()

  await run({ siteIds: ["123"], paths, client })
  const second = await run({ siteIds: ["456"], paths, client })

  assert.equal(second.report.successfulSites, 1)
  assert.equal(second.report.outputSites, 2)
  assert.deepEqual(second.output.map((site) => site.mjtunnus), ["123", "456"])
})

test("parseArguments lukee turvalliset valinnat", () => {
  assert.deepEqual(
    parseArguments([
      "--site",
      "123",
      "--force",
      "--model",
      "gpt-5.6-terra",
      "--concurrency",
      "2"
    ]),
    {
      siteIds: ["123"],
      force: true,
      model: "gpt-5.6-terra",
      concurrency: 2
    }
  )
  assert.deepEqual(parseArguments(["--retry-failed"]), {
    siteIds: [],
    retryFailed: true
  })
  assert.throws(() => parseArguments(["--site", "abc"]), /numeerinen/)
  assert.throws(() => parseArguments(["--unknown"]), /Tuntematon/)
})

function createClient(onCall = () => {}) {
  return {
    responses: {
      create: async (request) => {
        onCall(request)
        const { mjtunnus } = JSON.parse(request.input)
        return {
          id: `resp_${mjtunnus}`,
          model: request.model,
          status: "completed",
          output_text: JSON.stringify(createExtractionResult(mjtunnus)),
          usage: {
            input_tokens: 100,
            input_tokens_details: { cached_tokens: 20 },
            output_tokens: 50,
            output_tokens_details: { reasoning_tokens: 10 },
            total_tokens: 150
          }
        }
      }
    }
  }
}

function createSite(mjtunnus) {
  return {
    schemaVersion: 2,
    mjtunnus,
    name: `Kohde ${mjtunnus}`,
    description: "Sen halkaisija on noin 11 m ja korkeus 30–70 cm.",
    subSites: [],
    parsing: { needsReview: false, warnings: [] }
  }
}

function createPaths(directory) {
  return {
    parsedSiteContentFile: path.join(
      directory,
      "intermediate",
      "3_site-content.jsonl"
    ),
    llmResponsesDirectory: path.join(
      directory,
      "intermediate",
      "llm-responses"
    ),
    moundDimensionsFile: path.join(
      directory,
      "intermediate",
      "4_mound-dimensions.jsonl"
    ),
    extractionReportFile: path.join(
      directory,
      "intermediate",
      "4_extraction-report.json"
    )
  }
}

async function writeSites(file, sites) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, `${sites.map(JSON.stringify).join("\n")}\n`, "utf8")
}

function createExtractionResult(mjtunnus) {
  return {
    mjtunnus,
    statedMoundCount: 1,
    mounds: [
      {
        sourceOrder: 1,
        ordinal: null,
        direction: null,
        lengthM: null,
        widthM: null,
        diameterM: { min: 11, max: 11, approximate: true },
        heightM: { min: 0.3, max: 0.7, approximate: false },
        shape: null,
        status: null,
        confidence: "high",
        needsReview: false,
        evidence: ["Sen halkaisija on noin 11 m."]
      }
    ],
    notes: []
  }
}
