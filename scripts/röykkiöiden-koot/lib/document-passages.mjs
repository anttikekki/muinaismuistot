export function extractSitePassages(text, site, { contextPages = 1, maxPages = 12 } = {}) {
  const pages = text.replace(/\r/g, "").split("\f")
  const id = String(site.mjtunnus ?? "").replace(/\D/g, "")
  const directMatches = []

  for (let index = 0; index < pages.length; index += 1) {
    if (id && containsSiteId(pages[index], id)) directMatches.push({ index, matchedBy: ["mjtunnus"] })
  }

  const selected = new Map()
  for (const match of directMatches) {
    for (let index = match.index; index <= Math.min(pages.length - 1, match.index + contextPages); index += 1) {
      if (index > match.index && containsDifferentSiteId(pages[index], id)) break
      const existing = selected.get(index) ?? new Set()
      for (const reason of match.matchedBy) existing.add(reason)
      if (index !== match.index) existing.add("konteksti")
      selected.set(index, existing)
    }
  }

  return [...selected.entries()]
    .sort(([first], [second]) => first - second)
    .slice(0, maxPages)
    .map(([index, matchedBy]) => ({
      page: index + 1,
      matchedBy: [...matchedBy],
      text: pages[index].trim(),
      quality: assessTextQuality(pages[index])
    }))
}

function containsSiteId(text, id) {
  const variants = [...new Set([id, id.padStart(9, "0")])]
  return variants.some((variant) => new RegExp(`(?<!\\d)${[...variant].join("[\\s-]*")}(?!\\d)`, "u").test(text))
}

function containsDifferentSiteId(text, targetId) {
  const candidates = String(text).match(/(?<!\d)(?:\d[\s-]*){7,9}(?!\d)/gu) ?? []
  return candidates.some((candidate) => {
    const digits = candidate.replace(/\D/g, "")
    return digits !== targetId && digits.replace(/^0+/, "") !== targetId.replace(/^0+/, "")
  })
}

export function assessTextQuality(text) {
  const compact = text.replace(/\s/g, "")
  const letters = compact.match(/\p{L}/gu)?.length ?? 0
  const replacementCharacters = (text.match(/�/g) ?? []).length
  const alphabeticRatio = compact.length ? letters / compact.length : 0
  const warnings = []
  if (compact.length < 80) warnings.push("vähän_tekstiä")
  if (alphabeticRatio < 0.45) warnings.push("heikko_merkkilaatu")
  if (replacementCharacters > 0) warnings.push("korvausmerkkejä")
  return { needsReview: warnings.length > 0, alphabeticRatio: Number(alphabeticRatio.toFixed(3)), replacementCharacters, warnings }
}
