import assert from "node:assert/strict"
import test from "node:test"

import { OPENAI_CONFIG } from "../config.mjs"
import {
  buildExtractionCacheKey,
  buildModelInput,
  buildOpenAIRequest,
  createOpenAIClient,
  extractMoundDimensions,
  MOUND_EXTRACTION_INSTRUCTIONS
} from "../lib/llm.mjs"
import {
  assertMoundExtractionResult,
  MOUND_EXTRACTION_JSON_SCHEMA
} from "../lib/schemas.mjs"

test("buildOpenAIRequest käyttää Responses API:n strict Structured Outputs -muotoa", () => {
  const site = createSite("262010002")
  const request = buildOpenAIRequest({ site })

  assert.equal(request.model, "gpt-5.6-luna")
  assert.equal(request.store, false)
  assert.deepEqual(request.reasoning, {
    effort: "medium",
    context: "current_turn"
  })
  assert.equal(request.text.verbosity, "low")
  assert.equal(request.text.format.type, "json_schema")
  assert.equal(request.text.format.strict, true)
  assert.equal(request.text.format.schema, MOUND_EXTRACTION_JSON_SCHEMA)
  assert.equal(request.metadata.mjtunnus, "262010002")
  assert.match(MOUND_EXTRACTION_INSTRUCTIONS, /Älä tulkitse kohteen sijaintia/)
  assert.deepEqual(JSON.parse(request.input), buildModelInput(site))
})

test("extractMoundDimensions jäsentää ja validoi OpenAI-vastauksen", async () => {
  const site = createSite("262010002")
  const result = createExtractionResult(site.mjtunnus)
  const client = fakeClient(result)

  const extraction = await extractMoundDimensions({ client, site })

  assert.deepEqual(extraction.result, result)
  assert.equal(extraction.response.id, "resp_test")
  assert.equal(extraction.response.model, OPENAI_CONFIG.model)
  assert.equal(extraction.response.usage.total_tokens, 150)
})

test("extractMoundDimensions hylkää väärän tunnuksen ja keskeneräisen vastauksen", async () => {
  const site = createSite("262010002")
  const wrongId = createExtractionResult("999")

  await assert.rejects(
    extractMoundDimensions({ client: fakeClient(wrongId), site }),
    /ei vastaa odotettua tunnusta/
  )
  await assert.rejects(
    extractMoundDimensions({
      client: {
        responses: {
          create: async () => ({ status: "incomplete", output_text: "" })
        }
      },
      site
    }),
    /ei valmistunut/
  )
})

test("assertMoundExtractionResult hylkää virheellisen mittavälin ja duplikaatin", () => {
  const invalidRange = createExtractionResult("123")
  invalidRange.mounds[0].diameterM = {
    min: 11,
    max: 10,
    approximate: false
  }
  assert.throws(
    () => assertMoundExtractionResult(invalidRange, "123"),
    /diameterM on virheellinen/
  )

  const duplicate = createExtractionResult("123")
  duplicate.mounds.push(structuredClone(duplicate.mounds[0]))
  assert.throws(
    () => assertMoundExtractionResult(duplicate, "123"),
    /toistuu sourceOrder 1/
  )
})

test("buildExtractionCacheKey muuttuu syötteen tai mallin muuttuessa", () => {
  const site = createSite("262010002")
  const original = buildExtractionCacheKey({ site, model: "gpt-5.6-luna" })
  const same = buildExtractionCacheKey({
    site: structuredClone(site),
    model: "gpt-5.6-luna"
  })
  const changedModel = buildExtractionCacheKey({ site, model: "gpt-5.6-terra" })
  const changedSite = structuredClone(site)
  changedSite.description += " Lisäys."
  const changedInput = buildExtractionCacheKey({
    site: changedSite,
    model: "gpt-5.6-luna"
  })

  assert.equal(original, same)
  assert.notEqual(original, changedModel)
  assert.notEqual(original, changedInput)
  assert.match(original, /^[a-f0-9]{64}$/)
})

test("createOpenAIClient vaatii API-avaimen", () => {
  assert.throws(
    () => createOpenAIClient({ apiKey: "" }),
    /OPENAI_API_KEY-ympäristömuuttujaa ei ole asetettu/
  )
})

function fakeClient(result) {
  return {
    responses: {
      create: async () => ({
        id: "resp_test",
        model: OPENAI_CONFIG.model,
        status: "completed",
        output_text: JSON.stringify(result),
        usage: {
          input_tokens: 100,
          input_tokens_details: { cached_tokens: 20 },
          output_tokens: 50,
          output_tokens_details: { reasoning_tokens: 10 },
          total_tokens: 150
        }
      })
    }
  }
}

function createSite(mjtunnus) {
  return {
    schemaVersion: 2,
    mjtunnus,
    name: "Heikkilä",
    description:
      "Sen halkaisija on noin 11 m. Sen korkeus on 30–70 cm. Kohde on 100 m tiestä.",
    subSites: [],
    parsing: { needsReview: false, warnings: [] }
  }
}

export function createExtractionResult(mjtunnus) {
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
        evidence: [
          "Sen halkaisija on noin 11 m.",
          "Sen korkeus on 30–70 cm."
        ]
      }
    ],
    notes: []
  }
}
