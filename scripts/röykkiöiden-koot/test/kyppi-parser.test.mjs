import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { parseKyppiPage } from "../lib/kyppi-parser.mjs"

const TEST_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))
const EXAMPLE_DIRECTORY = path.join(TEST_DIRECTORY, "..", "kyppi-esimerkkisivu")
const [exampleFileName] = (await fs.readdir(EXAMPLE_DIRECTORY)).filter((name) =>
  name.endsWith(".htm")
)
const exampleHtml = await fs.readFile(
  path.join(EXAMPLE_DIRECTORY, exampleFileName),
  "utf8"
)

test("parseKyppiPage jäsentää Keskimäen Kuvaus-osion leipätekstin", () => {
  const site = parseKyppiPage(exampleHtml, {
    expectedMjtunnus: "531010025"
  })

  assert.equal(site.schemaVersion, 4)
  assert.equal(site.mjtunnus, "531010025")
  assert.match(site.description, /^Röykkiöt sijaitsevat Kokemäenjoesta/)
  assert.match(site.description, /Korkeus on 0,5 m\./)
  assert.equal(site.parsing.needsReview, false)
  assert.deepEqual(site.materialLinks.map((link) => link.recordId), [
    "113.9650",
    "129.135743",
    "129.126003"
  ])
  assert.deepEqual(site.parsing.warnings, [])
  assert.deepEqual(Object.keys(site).sort(), [
    "description",
    "materialLinks",
    "mjtunnus",
    "parsing",
    "schemaVersion"
  ])
})

test("parseKyppiPage säilyttää Kuvaus-osion kappalejaon", () => {
  const html = createMinimalHtml({
    description: "Ensimmäinen kappale.<br><br>Toinen   kappale."
  })
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.description, "Ensimmäinen kappale.\n\nToinen kappale.")
})

test("parseKyppiPage ohittaa muut HTML-osiot kokonaan", () => {
  const html = createMinimalHtml({
    description: "Kuvaus.",
    extra: `<span id="muu-osio">Tätä sisältöä ei jäsennetä.</span>`
  })
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.description, "Kuvaus.")
  assert.equal("otherContent" in site, false)
  assert.equal(site.parsing.needsReview, false)
})

test("parseKyppiPage merkitsee puuttuvan kuvauksen tarkistettavaksi", () => {
  const html = `<!doctype html><html><body>
    <div id="kohdetunnus">456</div>
    <div id="kohteen_nimi">Testi</div>
  </body></html>`
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.parsing.needsReview, true)
  assert.match(site.parsing.warnings.join("\n"), /puuttuu Kuvaus-osio/)
})

function createMinimalHtml({ description, extra = "" }) {
  return `<!doctype html><html><body>
    <div id="kohteen_sijaintikunta">Testikunta</div>
    <div id="kohteen_nimi">Testikohde</div>
    <div id="kohdetunnus">123</div>
    <table><tr><td class="norm1">Tyyppi:</td><td class="norm">
      <a>hautapaikat</a><a>hautaröykkiöt</a>
    </td></tr><tr><td class="norm">Ajoitus:</td><td class="norm">pronssikautinen</td></tr></table>
    <span id="koordinaatit">ETRS-TM35FIN P: 6800000 I: 250000</span>
    <span id="kuvaus"><table><tr><td class="norm">${description}</td></tr></table></span>
    ${extra}
  </body></html>`
}
