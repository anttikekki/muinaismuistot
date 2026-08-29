import crypto from "node:crypto"
import { OPENAI_CONFIG } from "../config.mjs"
import { MOUND_EXTRACTION_JSON_SCHEMA, assertMoundExtractionResult } from "./schemas.mjs"

export const REPORT_EXTRACTION_PROMPT_VERSION = 4
export const REPORT_EXTRACTION_SCHEMA_VERSION = 1

const moundSchema = MOUND_EXTRACTION_JSON_SCHEMA.properties.mounds.items
export const REPORT_EXTRACTION_JSON_SCHEMA = {
  ...MOUND_EXTRACTION_JSON_SCHEMA,
  properties: {
    ...MOUND_EXTRACTION_JSON_SCHEMA.properties,
    mounds: {
      ...MOUND_EXTRACTION_JSON_SCHEMA.properties.mounds,
      items: {
        ...moundSchema,
        properties: {
          ...moundSchema.properties,
          sourceReferences: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                documentId: { type: "string" },
                page: { type: "integer", minimum: 1 },
                evidence: { type: "string" }
              },
              required: ["documentId", "page", "evidence"]
            }
          }
        },
        required: [...moundSchema.required, "sourceReferences"]
      }
    }
  }
}

export const REPORT_EXTRACTION_INSTRUCTIONS = `
Poimi suomalaisen arkeologisen kohteen raporttikatkelmista jokainen erillinen
hautaröykkiö ja tekstissä ilmoitetut mitat. Katkelmat voivat olla saman raportin
sisällysluetteloa, yhteenvetoa ja varsinaista kohdekuvausta tai eri vuosien
raportteja.

Lähteiden ajallinen ensisijaisuus:
- Käytä röykkiöiden määrään, säilyneisyyteen ja mittoihin aina vain uusimman
  tunnetun tutkimusvuoden aineistoja (isLatestSource=true).
- Vanhemmat aineistot ovat vain historiatietoa. Älä täydennä uusimman aineiston
  puuttuvia mittoja vanhemmasta aineistosta äläkä yhdistä vanhoja ja uusia
  havaintoja samaan röykkiöön.
- Vanhemman ja uusimman aineiston ero ei itsessään ole ristiriita: röykkiö on
  voinut vaurioitua, muuttua tai tuhoutua. Älä merkitse needsReview=true vain
  tämän ajallisen eron vuoksi.
- sourceReferences saa sisältää vain isLatestSource=true-aineistoja, kun
  kohteella on vuosiluvultaan tunnettu uusin aineisto.

- Käytä vain pyydettyä kohdetta koskevia tietoja. Älä poimi naapurikohteita.
- Älä laske samaa röykkiötä uudeksi röykkiöksi, jos eri raportit kuvaavat sitä.
- Jos eri raporttien tiedot ovat ristiriidassa, merkitse needsReview=true ja
  kerro ristiriita notes-kentässä. Älä yhdistä eri röykkiöiden mittoja.
- Älä päättele tekstissä ilmoittamatonta mittaa. Muunna senttimetrit metreiksi.
- 10 x 6 m tarkoittaa pituutta ja leveyttä; halkaisija vain kun lähde niin sanoo.
- Sijaintietäisyydet eivät ole röykkiön mittoja.
- evidence sisältää sanatarkat lähdekatkelmat. PDF:n taitosta tai OCR:stä
  syntyneet ylimääräiset välilyönnit, myös sanan sisällä, saa poistaa. Sanojen
  kirjaimia ja numeroita ei saa korjata tai muuttaa.
- Jokaiselle evidence-katkelmalle anna sourceReferences-taulukossa sitä vastaava
  documentId, PDF-sivu ja sama sanatarkka evidence. Viittauksen täytyy löytyä
  annetun sivun tekstistä.
- Puuttuva tieto on null. confidence arvioi poiminnan varmuutta.
`.trim()

export function buildReportModelInput(site) {
  const sourceDocuments = Number.isInteger(site.latestSourceYear)
    ? site.documents.filter((document) => document.isLatestSource === true)
    : site.documents
  const readyPages = site.readiness?.status === "ready_for_llm"
    ? new Set(site.readiness.pages ?? [])
    : null
  return {
    mjtunnus: site.mjtunnus,
    kohdenimi: site.kohdenimi,
    kunta: site.kunta,
    latestSourceYear: site.latestSourceYear ?? null,
    documents: sourceDocuments.map((document) => ({
      documentId: document.documentId,
      title: document.title,
      sourceYear: document.sourceYear ?? null,
      isLatestSource: document.isLatestSource,
      pages: document.passages
        .filter((passage) => !readyPages || readyPages.has(`${document.documentId}:${passage.page}`))
        .map((passage) => ({ page: passage.page, text: passage.text }))
    })).filter((document) => document.pages.length > 0)
  }
}

export function buildReportOpenAIRequest({ site, model = OPENAI_CONFIG.model }) {
  return {
    model,
    instructions: REPORT_EXTRACTION_INSTRUCTIONS,
    input: JSON.stringify(buildReportModelInput(site)),
    reasoning: { effort: OPENAI_CONFIG.reasoningEffort, context: "current_turn" },
    text: { verbosity: "low", format: { type: "json_schema", name: "report_mound_dimensions", strict: true, schema: REPORT_EXTRACTION_JSON_SCHEMA } },
    max_output_tokens: OPENAI_CONFIG.maxOutputTokens,
    prompt_cache_key: `report-mound-dimensions-prompt-v${REPORT_EXTRACTION_PROMPT_VERSION}`,
    store: false,
    metadata: { mjtunnus: site.mjtunnus, prompt_version: String(REPORT_EXTRACTION_PROMPT_VERSION), schema_version: String(REPORT_EXTRACTION_SCHEMA_VERSION) }
  }
}

export async function extractReportMoundDimensions({ client, site, model = OPENAI_CONFIG.model }) {
  const response = await client.responses.create(buildReportOpenAIRequest({ site, model }))
  if (response.status !== "completed" || !response.output_text) throw new Error(`OpenAI-vastaus ei valmistunut: ${response.status ?? "tuntematon tila"}`)
  let result
  try { result = JSON.parse(response.output_text) } catch (error) { throw new Error(`OpenAI-vastauksen JSON-jäsennys epäonnistui: ${error.message}`) }
  return { result }
}

export function assertReportExtractionResult(result, site) {
  assertMoundExtractionResult(result, site.mjtunnus)
  const pages = new Map(site.documents.flatMap((document) => document.passages.map((passage) => [`${document.documentId}:${passage.page}`, passage.text])))
  for (const mound of result.mounds) {
    if (!Array.isArray(mound.sourceReferences)) throw new Error("Raporttituloksen sourceReferences puuttuu")
    for (const reference of mound.sourceReferences) {
      const text = pages.get(`${reference.documentId}:${reference.page}`)
      if (!text) throw new Error(`Raporttituloksen lähdeviite ei vastaa syötettä: ${reference.documentId} sivu ${reference.page}`)
      if (!reference.evidence || !normalizeEvidence(text).includes(normalizeEvidence(reference.evidence))) throw new Error("Raporttituloksen evidence ei löydy viitatulta sivulta")
    }
    if (mound.evidence.length !== mound.sourceReferences.length || mound.evidence.some((evidence, index) => !equivalentEvidence(evidence, mound.sourceReferences[index].evidence))) throw new Error("Raporttituloksen evidence ja sourceReferences eivät vastaa toisiaan")
  }
  return result
}

export function repairReportSourceReferences(result, site) {
  const pages = site.documents.flatMap((document) => document.passages.map((passage) => ({ documentId: document.documentId, page: passage.page, text: passage.text })))
  let repaired = false
  for (const mound of result.mounds ?? []) {
    for (const [index, reference] of (mound.sourceReferences ?? []).entries()) {
      const current = pages.find((page) => page.documentId === reference.documentId && page.page === reference.page)
      if (current && normalizeEvidence(current.text).includes(normalizeEvidence(reference.evidence))) continue
      const currentEvidence = current && expandAbbreviatedEvidence(reference.evidence, current.text)
      if (currentEvidence) {
        reference.evidence = currentEvidence
        mound.evidence[index] = currentEvidence
        repaired = true
        continue
      }
      const matches = pages.flatMap((page) => {
        const evidence = normalizeEvidence(page.text).includes(normalizeEvidence(reference.evidence))
          ? reference.evidence
          : expandAbbreviatedEvidence(reference.evidence, page.text)
        return evidence ? [{ ...page, evidence }] : []
      })
      if (matches.length !== 1) continue
      reference.documentId = matches[0].documentId
      reference.page = matches[0].page
      reference.evidence = matches[0].evidence
      mound.evidence[index] = matches[0].evidence
      repaired = true
    }
  }
  return repaired
}

function expandAbbreviatedEvidence(evidence, pageText) {
  const fragments = String(evidence).split(/\s*(?:\.{3}|…)\s*|(?<=[.!?])\s+(?=\p{Lu})/u).filter((fragment) => normalizeEvidence(fragment).length >= 8)
  if (fragments.length < 2) return null
  const normalizedPage = normalizedTextWithOffsets(pageText)
  let start = -1
  let end = -1
  let from = 0
  for (const fragment of fragments) {
    const normalizedFragment = normalizeEvidence(fragment)
    const position = normalizedPage.text.indexOf(normalizedFragment, from)
    if (position < 0) return null
    if (start < 0) start = position
    end = position + normalizedFragment.length
    from = end
  }
  return pageText.slice(normalizedPage.offsets[start], normalizedPage.offsets[end - 1] + 1).trim()
}

function normalizedTextWithOffsets(value) {
  let text = ""
  const offsets = []
  for (let index = 0; index < value.length;) {
    const codePoint = value.codePointAt(index)
    const character = String.fromCodePoint(codePoint)
    const normalized = character.normalize("NFKC").toLocaleLowerCase("fi-FI").replace(/[^\p{L}\p{N}]/gu, "")
    for (const outputCharacter of normalized) {
      text += outputCharacter
      offsets.push(index)
    }
    index += character.length
  }
  return { text, offsets }
}

function equivalentEvidence(first, second) {
  const left = normalizeEvidence(first)
  const right = normalizeEvidence(second)
  return left === right || left.includes(right) || right.includes(left)
}

function normalizeEvidence(value) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("fi-FI")
    .replace(/[^\p{L}\p{N}]/gu, "")
}

export function buildReportExtractionCacheKey({ site, model }) {
  return crypto.createHash("sha256").update(JSON.stringify({ model, promptVersion: REPORT_EXTRACTION_PROMPT_VERSION, schemaVersion: REPORT_EXTRACTION_SCHEMA_VERSION, input: buildReportModelInput(site) })).digest("hex")
}
