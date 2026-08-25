import { expect, test } from "@playwright/test"
import {
  clickMapCenter,
  exportedFeature,
  openLinkedFeatureDetails,
  openSearch,
  permanentLink
} from "./map-test-helpers"

test("legacy WMS/WFS fallback remains functional", async ({ page }) => {
  const customApiRequests: string[] = []
  page.on("request", (request) => {
    if (request.url().includes("/api/museovirasto/")) customApiRequests.push(request.url())
  })
  const wmsResponse = page.waitForResponse((response) =>
    response.url().includes("geoserver.museovirasto.fi") &&
    response.url().toLowerCase().includes("request=getmap") &&
    response.ok()
  )
  await page.goto("/#center=235000%2C6710000&zoom=10")
  await wmsResponse
  await expect(page.locator(".ol-viewport")).toBeVisible()

  await openSearch(page, "Turun linna")
  expect(await page.locator(".accordion-item").count()).toBeGreaterThan(0)
  expect((await exportedFeature(page)).geometry?.type).toBeTruthy()

  const link = await permanentLink(page)
  await page.goto(link)
  const linkedIdentify = page.waitForResponse((response) =>
    response.url().toLowerCase().includes("request=getfeatureinfo")
  )
  await openLinkedFeatureDetails(page)
  await linkedIdentify

  await page.goto("/?wmsClickTest=1#center=238571%2C6710001&zoom=14")
  await expect(page.locator(".ol-viewport")).toBeVisible()
  const clickIdentify = page.waitForResponse((response) =>
    response.url().toLowerCase().includes("request=getfeatureinfo")
  )
  await clickMapCenter(page)
  await clickIdentify
  await expect(page.locator(".accordion-item").first()).toBeVisible()
  expect(customApiRequests).toEqual([])
})
