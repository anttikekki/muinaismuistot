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

test("parseKyppiPage jäsentää Keskimäen pääkohteen ja yhdeksän alakohdetta", () => {
  const site = parseKyppiPage(exampleHtml, {
    expectedMjtunnus: "531010025"
  })

  assert.equal(site.schemaVersion, 2)
  assert.equal(site.mjtunnus, "531010025")
  assert.equal(site.pageMjtunnus, "531010025")
  assert.equal(site.name, "Keskimäki")
  assert.equal(site.municipality, "Nakkila")
  assert.deepEqual(site.types, ["hautapaikat", "hautaröykkiöt"])
  assert.deepEqual(site.datings, ["pronssikautinen", "ei määritelty"])
  assert.deepEqual(site.coordinates, {
    crs: "EPSG:3067",
    northing: 6815818,
    easting: 235179
  })
  assert.match(site.description, /^Röykkiöt sijaitsevat Kokemäenjoesta/)
  assert.match(site.description, /Korkeus on 0,5 m\./)
  assert.equal(site.subSites.length, 9)
  assert.equal(site.parsing.needsReview, false)
  assert.deepEqual(site.parsing.warnings, [])
})

test("parseKyppiPage säilyttää alakohteiden järjestyksen ja rakenteiset tiedot", () => {
  const site = parseKyppiPage(exampleHtml, {
    expectedMjtunnus: "531010025"
  })
  const first = site.subSites[0]
  const fifth = site.subSites[4]
  const eighth = site.subSites[7]

  assert.deepEqual(first, {
    sourceOrder: 1,
    name: "Röykkiö 1",
    ordinal: 1,
    direction: null,
    types: ["hautapaikat", "hautaröykkiöt"],
    datings: ["pronssikautinen"],
    coordinates: {
      crs: "EPSG:3067",
      northing: 6815818,
      easting: 235179
    },
    description: "Tien länsipuolella oleva, osittain tien leikkaama röykkiön pohja."
  })
  assert.equal(fifth.ordinal, 5)
  assert.equal(fifth.description, null)
  assert.deepEqual(eighth.datings, ["pronssikautinen", "rautakautinen"])
  assert.equal(eighth.coordinates.northing, 6815760)
  assert.equal(eighth.coordinates.easting, 235295)
})

test("parseKyppiPage säilyttää Kuvaus-osion kappalejaon", () => {
  const html = createMinimalHtml({
    description: "Ensimmäinen kappale.<br><br>Toinen   kappale."
  })
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.description, "Ensimmäinen kappale.\n\nToinen kappale.")
})

test("parseKyppiPage tunnistaa kauttaviivalla annetun alakohdenumeron", () => {
  const html = createMinimalHtml({
    description: "Kuvaus.",
    subSites: `<table><tr><td class="bkgr">Hammarsboda 4/2</td></tr></table>`
  })
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.subSites[0].ordinal, 2)
  assert.equal(site.parsing.needsReview, false)
})

test("parseKyppiPage tunnistaa N- ja S-tunnisteet ilmansuunniksi", () => {
  const html = createMinimalHtml({
    description: "Kuvaus.",
    subSites: `
      <table><tr><td class="bkgr">Röykkiö N</td></tr></table>
      <table><tr><td class="bkgr">Röykkiö S</td></tr></table>
    `
  })
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.subSites[0].ordinal, null)
  assert.equal(site.subSites[0].direction, "north")
  assert.equal(site.subSites[1].ordinal, null)
  assert.equal(site.subSites[1].direction, "south")
  assert.equal(site.parsing.needsReview, false)
  assert.deepEqual(site.parsing.warnings, [])
})

test("parseKyppiPage merkitsee puuttuvat osiot ja tunnusristiriidan tarkistettavaksi", () => {
  const html = `<!doctype html><html><body>
    <div id="kohdetunnus">456</div>
    <div id="kohteen_nimi">Testi</div>
  </body></html>`
  const site = parseKyppiPage(html, { expectedMjtunnus: "123" })

  assert.equal(site.parsing.needsReview, true)
  assert.match(site.parsing.warnings.join("\n"), /ei vastaa odotettua tunnusta/)
  assert.match(site.parsing.warnings.join("\n"), /puuttuu Kuvaus-osio/)
  assert.match(site.parsing.warnings.join("\n"), /puuttuu Alakohteet-osio/)
})

function createMinimalHtml({ description, subSites = "" }) {
  return `<!doctype html><html><body>
    <div id="kohteen_sijaintikunta">Testikunta</div>
    <div id="kohteen_nimi">Testikohde</div>
    <div id="kohdetunnus">123</div>
    <table><tr><td class="norm1">Tyyppi:</td><td class="norm">
      <a>hautapaikat</a><a>hautaröykkiöt</a>
    </td></tr><tr><td class="norm">Ajoitus:</td><td class="norm">pronssikautinen</td></tr></table>
    <span id="koordinaatit">ETRS-TM35FIN P: 6800000 I: 250000</span>
    <span id="kuvaus"><table><tr><td class="norm">${description}</td></tr></table></span>
    <span id="alakohdelist">${subSites}</span>
  </body></html>`
}
