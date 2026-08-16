import { load } from "cheerio"

export const PARSED_SITE_SCHEMA_VERSION = 3

export function parseKyppiPage(html, { expectedMjtunnus } = {}) {
  const $ = load(html)
  const warnings = []
  const descriptionSectionFound = $("#kuvaus").length > 0
  const description = extractDescription($)

  if (!descriptionSectionFound) warnings.push("Sivulta puuttuu Kuvaus-osio")
  if (!description) warnings.push("Kuvaus-osio on tyhjä")

  return {
    schemaVersion: PARSED_SITE_SCHEMA_VERSION,
    mjtunnus: expectedMjtunnus ?? null,
    description,
    parsing: {
      descriptionSectionFound,
      needsReview: warnings.length > 0,
      warnings
    }
  }
}

function extractDescription($) {
  const descriptions = []

  $("#kuvaus td.norm").each((_index, element) => {
    const text = elementTextWithLineBreaks($, element)
    if (text) descriptions.push(text)
  })

  return descriptions.length > 0 ? descriptions.join("\n\n") : null
}

function elementTextWithLineBreaks($, element) {
  const clone = $(element).clone()
  clone.find("br").replaceWith("\n")
  return normalizeParagraphText(clone.text())
}

function normalizeParagraphText(value) {
  const lines = value
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())

  const normalized = []
  for (const line of lines) {
    if (line || normalized.at(-1) !== "") normalized.push(line)
  }

  return normalized.join("\n").trim()
}
