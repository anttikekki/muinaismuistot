import { expect, test } from "@playwright/test"
import {
  clickMapCenter,
  exportedFeature,
  openLinkedFeatureDetails,
  openSearch,
  permanentLink
} from "./map-test-helpers"

const vectorQuery = ""

test("PMTiles/D1 map, search, export, permanent link and identify", async ({ page }) => {
  const pmtilesResponse = page.waitForResponse((response) =>
    response.url().includes("/api/museovirasto/pmtiles") && response.status() === 206
  )
  await page.goto(`${vectorQuery}#center=385000%2C7200000&zoom=2`)
  await pmtilesResponse
  await expect(page.locator(".ol-viewport")).toBeVisible()

  const searchResponse = page.waitForResponse((response) =>
    response.url().includes("/api/museovirasto/search") && response.status() === 200
  )
  const detailsResponse = page.waitForResponse((response) =>
    response.url().includes("/api/museovirasto/features/by-register") && response.status() === 200
  )
  await openSearch(page, "turun")
  await Promise.all([searchResponse, detailsResponse])
  expect(await page.locator(".accordion-item").count()).toBeGreaterThan(50)

  const exported = await exportedFeature(page)
  expect(exported.geometry?.type).toBe("Polygon")
  expect(exported.geometry?.coordinates).toBeTruthy()

  const link = await permanentLink(page)
  await page.goto(link)
  const linkedResponse = page.waitForResponse((response) =>
    response.url().includes("/api/museovirasto/features/by-register") && response.status() === 200
  )
  await openLinkedFeatureDetails(page)
  await linkedResponse

  const clickTiles = page.waitForResponse((response) =>
    response.url().includes("/api/museovirasto/pmtiles") && response.status() === 206
  )
  await page.goto(`?mapClickTest=1#center=181688.6237%2C6712269.1593&zoom=14`)
  await clickTiles
  await expect(page.locator(".ol-viewport")).toBeVisible()
  await page.waitForTimeout(3_000)
  const identifyResponse = page.waitForResponse((response) =>
    response.url().includes("/api/museovirasto/features/batch") && response.status() === 200
  )
  await clickMapCenter(page)
  await identifyResponse
  await expect(page.locator(".accordion-item").first()).toBeVisible()
})

test("search and map click identify an archaeological point", async ({ page }) => {
  const registryId = "1000097130"
  const pointLayer = "rajapinta_suojellut:muinaisjaannos_piste"
  await page.goto(`${vectorQuery}#center=402431%2C6748200&zoom=12`)
  await openSearch(page, registryId)

  expect(await page.locator(".accordion-item").count()).toBe(1)
  expect((await exportedFeature(page)).properties).toEqual(expect.objectContaining({
    mjtunnus: 1000097130,
    tyyppi: expect.any(String),
    alatyyppi: expect.any(String),
    ajoitus: expect.any(String)
  }))
  const link = new URL(await permanentLink(page))
  const parameters = new URLSearchParams(link.hash.slice(1))
  expect(Number(parameters.get("x"))).toBeGreaterThan(50_000)
  expect(Number(parameters.get("x"))).toBeLessThan(800_000)
  expect(Number(parameters.get("y"))).toBeGreaterThan(6_500_000)
  expect(Number(parameters.get("y"))).toBeLessThan(7_800_000)
  expect(parameters.get("linkedFeatureLayer")).toBe(pointLayer)

  // Use the point's coordinates without opening a linked feature or enabling area layers.
  const mapParameters = new URLSearchParams({
    center: `${parameters.get("x")},${parameters.get("y")}`,
    zoom: "14",
    museovirastoLayer: pointLayer
  })
  await page.goto(`/#${mapParameters}`)
  await expect(page.locator(".ol-viewport")).toBeVisible()
  const pointDetails = page.locator(
    `.accordion-header a[href*="linkedFeatureId=${registryId}"]`
  )
  await expect(async () => {
    await clickMapCenter(page)
    await expect(pointDetails).toBeVisible({ timeout: 2_000 })
  }).toPass({ timeout: 30_000 })
})
