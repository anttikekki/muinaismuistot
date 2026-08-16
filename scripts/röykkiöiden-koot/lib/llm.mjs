import crypto from "node:crypto"

import OpenAI from "openai"

import { OPENAI_CONFIG } from "../config.mjs"
import {
  assertMoundExtractionResult,
  MOUND_EXTRACTION_JSON_SCHEMA,
  MOUND_EXTRACTION_SCHEMA_VERSION
} from "./schemas.mjs"

export const MOUND_EXTRACTION_PROMPT_VERSION = 3

export const MOUND_EXTRACTION_INSTRUCTIONS = `
Poimi annetusta suomalaisen arkeologisen kohteen kuvauksesta jokainen erillinen
hautaröykkiö ja sen tekstissä ilmoitetut mitat. Palauta vain pyydetyn skeeman
mukainen tulos.

Tulkintasäännöt:
- Älä päättele tai arvioi mittaa, jota lähdeteksti ei ilmoita.
- Muunna senttimetrit metreiksi.
- Säilytä vaihteluväli min- ja max-arvoina. Yksittäisessä arvossa min=max.
- Merkitse approximate=true, kun tekstissä käytetään esimerkiksi sanoja
  "noin", "arviolta" tai muuta epätarkkaa ilmausta.
- Tallenna "10 x 6 m" pituudeksi 10 m ja leveydeksi 6 m. Älä muuta sitä
  halkaisijaksi. Halkaisija tallennetaan vain, kun teksti sanoo halkaisija,
  läpimitta tai vastaavan yksiselitteisen ilmauksen.
- Älä tulkitse kohteen sijaintia, röykkiöiden keskinäistä etäisyyttä,
  koordinaatteja tai etäisyyttä teihin, peltoihin ja muihin paikkoihin
  röykkiön mitoiksi.
- Yhdistä korkeus vain siihen röykkiöön, johon lauseyhteys sen liittää.
- Säilytä erilliset röykkiöt lähdetekstin järjestyksessä sourceOrder-kentässä.
- statedMoundCount on tekstissä erillisiksi röykkiöiksi tunnistettujen
  rakenteiden määrä. Käytä null-arvoa, jos määrää ei voi päätellä luotettavasti.
- Käytä ordinal- ja direction-tunnisteita vain, kun ne käyvät ilmi annetusta
  kuvauksesta. Muussa tapauksessa käytä null-arvoa.
- Jos samaa röykkiötä koskevat mitat ovat ristiriidassa tai viittaus on
  epäselvä, säilytä vain perusteltu tieto, aseta needsReview=true ja selitä
  epäselvyys notes-kentässä.
- evidence sisältää lyhyet, yhtenäiset ja sanatarkat lähdetekstin katkelmat,
  jotka suoraan tukevat kyseisen röykkiön tietoja. Kopioi jokainen katkelma
  sellaisenaan lähdetekstistä.
- Älä lyhennä evidence-katkelmia kolmella pisteellä (... tai …), hakasulkeilla
  tai millään muulla poisjättöä kuvaavalla merkinnällä. Älä myöskään muotoile,
  korjaa, käännä tai selitä lähdetekstiä evidence-kentässä. Jos tarvittava tuki
  on lähdetekstin eri kohdissa, palauta kohdat erillisinä evidence-taulukon
  katkelmina.
- Puuttuva mitta, muoto, tila, ordinal tai direction on null.
- confidence kuvaa poiminnan varmuutta, ei kohteen arkeologista varmuutta.
`.trim()

export function createOpenAIClient({
  apiKey = process.env.OPENAI_API_KEY,
  timeout = OPENAI_CONFIG.requestTimeoutMs,
  maxRetries = OPENAI_CONFIG.maxRetries
} = {}) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY-ympäristömuuttujaa ei ole asetettu")
  }
  return new OpenAI({ apiKey, timeout, maxRetries })
}

export function buildModelInput(site) {
  return {
    mjtunnus: site.mjtunnus,
    description: site.description
  }
}

export function buildOpenAIRequest({
  site,
  model = OPENAI_CONFIG.model,
  reasoningEffort = OPENAI_CONFIG.reasoningEffort
}) {
  const input = buildModelInput(site)

  return {
    model,
    instructions: MOUND_EXTRACTION_INSTRUCTIONS,
    input: JSON.stringify(input),
    reasoning: {
      effort: reasoningEffort,
      context: "current_turn"
    },
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "mound_dimensions",
        description: "Arkeologisen kohteen röykkiöiden rakenteiset mittatiedot",
        strict: true,
        schema: MOUND_EXTRACTION_JSON_SCHEMA
      }
    },
    max_output_tokens: OPENAI_CONFIG.maxOutputTokens,
    prompt_cache_key: `mound-dimensions-prompt-v${MOUND_EXTRACTION_PROMPT_VERSION}`,
    store: false,
    metadata: {
      mjtunnus: site.mjtunnus,
      prompt_version: String(MOUND_EXTRACTION_PROMPT_VERSION),
      schema_version: String(MOUND_EXTRACTION_SCHEMA_VERSION)
    }
  }
}

export async function extractMoundDimensions({
  client,
  site,
  model = OPENAI_CONFIG.model,
  reasoningEffort = OPENAI_CONFIG.reasoningEffort
}) {
  const request = buildOpenAIRequest({ site, model, reasoningEffort })
  const response = await client.responses.create(request)

  if (response.status !== "completed") {
    throw new Error(
      `OpenAI-vastaus ei valmistunut: ${response.status ?? "tuntematon tila"}`
    )
  }
  if (!response.output_text) {
    throw new Error("OpenAI-vastauksesta puuttuu output_text")
  }

  let result
  try {
    result = JSON.parse(response.output_text)
  } catch (error) {
    throw new Error(`OpenAI-vastauksen JSON-jäsennys epäonnistui: ${error.message}`, {
      cause: error
    })
  }
  assertMoundExtractionResult(result, site.mjtunnus)

  return {
    result,
    response: {
      id: response.id,
      model: response.model,
      status: response.status,
      usage: response.usage ?? null
    }
  }
}

export function buildExtractionCacheKey({ site, model }) {
  const cacheInput = {
    model,
    promptVersion: MOUND_EXTRACTION_PROMPT_VERSION,
    schemaVersion: MOUND_EXTRACTION_SCHEMA_VERSION,
    input: buildModelInput(site)
  }
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(cacheInput))
    .digest("hex")
}
