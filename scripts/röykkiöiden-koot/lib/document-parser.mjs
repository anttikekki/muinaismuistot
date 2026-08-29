import crypto from "node:crypto"
import { load } from "cheerio"

export function parseDocumentRecordPage(html, recordUrl) {
  const $ = load(html)
  const documents = []
  const seen = new Set()
  $("#liite a[href]").each((_index, element) => {
    const href = $(element).attr("href")
    let url
    try { url = new URL(href, recordUrl) } catch { return }
    if (url.protocol !== "https:" || url.hostname !== "www.kyppi.fi") return
    if (!/hae_liite\.aspx$/i.test(url.pathname) || url.searchParams.get("ttyyppi")?.toLowerCase() !== "pdf") return
    const canonicalUrl = canonicalizeAttachmentUrl(url)
    const documentId = crypto.createHash("sha256").update(canonicalUrl).digest("hex").slice(0, 24)
    if (seen.has(documentId)) return
    seen.add(documentId)
    const row = $(element).closest("tr")
    documents.push({ documentId, url: canonicalUrl, title: row.find("td").last().text().replace(/\s+/g, " ").trim() || null })
  })
  return documents
}

export function canonicalizeAttachmentUrl(urlValue) {
  const url = new URL(urlValue)
  const entries = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b))
  url.search = ""
  for (const [key, value] of entries) url.searchParams.append(key, value)
  url.hash = ""
  return url.href
}
