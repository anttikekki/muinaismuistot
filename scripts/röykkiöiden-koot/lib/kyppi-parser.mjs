import { load } from "cheerio"

export const PARSED_SITE_SCHEMA_VERSION = 2

export function parseKyppiPage(html, { expectedMjtunnus } = {}) {
  const $ = load(html)
  const warnings = []
  const pageMjtunnus = normalizeInlineText($("#kohdetunnus").first().text()) || null
  const name = normalizeInlineText($("#kohteen_nimi").first().text()) || null
  const municipality =
    normalizeInlineText($("#kohteen_sijaintikunta").first().text()) || null
  const descriptionSectionFound = $("#kuvaus").length > 0
  const subSitesSectionFound = $("#alakohdelist").length > 0
  const description = extractDescription($)
  const subSites = extractSubSites($, warnings)

  if (!pageMjtunnus) warnings.push("Sivulta puuttuu kohdetunnus")
  if (expectedMjtunnus && pageMjtunnus !== expectedMjtunnus) {
    warnings.push(
      `Sivun kohdetunnus ${pageMjtunnus ?? "puuttuu"} ei vastaa ` +
        `odotettua tunnusta ${expectedMjtunnus}`
    )
  }
  if (!name) warnings.push("Sivulta puuttuu kohteen nimi")
  if (!descriptionSectionFound) warnings.push("Sivulta puuttuu Kuvaus-osio")
  if (!description) warnings.push("Kuvaus-osio on tyhjä")
  if (!subSitesSectionFound) warnings.push("Sivulta puuttuu Alakohteet-osio")

  return {
    schemaVersion: PARSED_SITE_SCHEMA_VERSION,
    mjtunnus: expectedMjtunnus ?? pageMjtunnus,
    pageMjtunnus,
    name,
    municipality,
    types: extractMainTypes($),
    datings: extractMainDatings($),
    coordinates: extractCoordinates($("#koordinaatit").text()),
    description,
    subSites,
    parsing: {
      descriptionSectionFound,
      subSitesSectionFound,
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

function extractSubSites($, warnings) {
  const subSites = []

  $("#alakohdelist > table").each((index, table) => {
    const name = normalizeInlineText($(table).find("td.bkgr").first().text()) || null
    const ordinalMatch =
      /röykkiö\s+(\d+)/i.exec(name ?? "") ?? /\/(\d+)$/.exec(name ?? "")
    const directionMatch = /röykkiö\s+([NS])$/i.exec(name ?? "")
    const types = []
    const datings = []
    let coordinates = null
    let description = null

    $(table)
      .find("td.norm")
      .each((_rowIndex, cell) => {
        const text = normalizeInlineText($(cell).text())
        if (!text) return

        if (/^Tyyppi:/i.test(text)) {
          types.push(...splitCommaSeparated(text.replace(/^Tyyppi:\s*/i, "")))
        } else if (/^Ajoitus:/i.test(text)) {
          datings.push(...splitCommaSeparated(text.replace(/^Ajoitus:\s*/i, "")))
        } else if (/^Koordinaatit\s+ETRS-TM35FIN/i.test(text)) {
          coordinates = extractCoordinates(text)
        } else if (/^Kuvaus:/i.test(text)) {
          description = normalizeParagraphText(text.replace(/^Kuvaus:\s*/i, "")) || null
        }
      })

    const ordinal = ordinalMatch ? Number(ordinalMatch[1]) : null
    const direction =
      directionMatch?.[1].toUpperCase() === "N"
        ? "north"
        : directionMatch?.[1].toUpperCase() === "S"
          ? "south"
          : null
    if (ordinal === null && direction === null) {
      warnings.push(`Alakohteen ${index + 1} järjestysnumeroa ei voitu päätellä`)
    }

    subSites.push({
      sourceOrder: index + 1,
      name,
      ordinal,
      direction,
      types: unique(types),
      datings: unique(datings),
      coordinates,
      description
    })
  })

  return subSites
}

function extractMainTypes($) {
  const label = $("td.norm1")
    .filter((_index, element) => normalizeInlineText($(element).text()) === "Tyyppi:")
    .first()
  if (label.length === 0) return []

  const valueCell = label.next("td")
  const links = valueCell
    .find("a")
    .map((_index, element) => normalizeInlineText($(element).text()))
    .get()
    .filter(Boolean)

  return unique(links.length > 0 ? links : splitCommaSeparated(valueCell.text()))
}

function extractMainDatings($) {
  const values = []

  $("td.norm").each((_index, element) => {
    if (normalizeInlineText($(element).text()) !== "Ajoitus:") return
    values.push(...splitCommaSeparated($(element).next("td").text()))
  })

  return unique(values)
}

function extractCoordinates(text) {
  const match = /ETRS-TM35FIN\s+P:\s*([\d.,]+)\s+I:\s*([\d.,]+)/i.exec(text)
  if (!match) return null

  const northing = parseCoordinate(match[1])
  const easting = parseCoordinate(match[2])
  if (!Number.isFinite(northing) || !Number.isFinite(easting)) return null

  return {
    crs: "EPSG:3067",
    northing,
    easting
  }
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

function normalizeInlineText(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim()
}

function splitCommaSeparated(value) {
  return value
    .split(",")
    .map(normalizeInlineText)
    .filter(Boolean)
}

function parseCoordinate(value) {
  return Number(value.replace(",", "."))
}

function unique(values) {
  return [...new Set(values)]
}
