import assert from "node:assert/strict"
import test from "node:test"
import { parseDocumentRecordPage } from "../lib/document-parser.mjs"

test("parseDocumentRecordPage löytää ja deduplikoi PDF-liitteet", () => {
  const html = `<span id="liite"><table>
    <tr><td><a href="hae_liite.aspx?ttyyppi=pdf&id=100979&kansio_id=531"><img></a></td><td>Nakkila Inventointi 2001</td></tr>
    <tr><td><a href="hae_liite.aspx?id=100979&kansio_id=531&ttyyppi=pdf"><img></a></td><td>Sama</td></tr>
    <tr><td><a href="kuva.jpg">kuva</a></td></tr>
  </table></span>`
  const documents = parseDocumentRecordPage(html, "https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_raportti_det.aspx")
  assert.equal(documents.length, 1)
  assert.equal(documents[0].title, "Nakkila Inventointi 2001")
  assert.match(documents[0].url, /hae_liite\.aspx\?id=100979&kansio_id=531&ttyyppi=pdf$/)
})
