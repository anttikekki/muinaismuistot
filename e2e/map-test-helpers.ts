import { expect, Page } from "@playwright/test"

export async function openSearch(page: Page, text: string): Promise<void> {
  await page.locator("#map-button-search button").click()
  await page.locator("form input[type=text]").fill(text)
  await page.locator("form button[type=submit]").click()
  await expect(page.locator(".accordion-item").first()).toBeVisible({ timeout: 60_000 })
}

export async function exportedFeature(page: Page): Promise<{
  geometry?: { type?: string; coordinates?: unknown }
}> {
  const link = page.locator("a[download]").first()
  await expect(link).toHaveAttribute("href", /^blob:/)
  const href = await link.getAttribute("href")
  return page.evaluate(async (url) => {
    const collection = await fetch(url).then((response) => response.json())
    return collection.features[0]
  }, href as string)
}

export async function permanentLink(page: Page): Promise<string> {
  const href = await page.locator(".accordion-header a").first().getAttribute("href")
  expect(href).toBeTruthy()
  return new URL(href as string, page.url()).href
}

export async function openLinkedFeatureDetails(page: Page): Promise<void> {
  await page.locator("#map-button-linked-feature button").click()
  await page.locator(".popover button").nth(1).click()
  await expect(page.locator(".accordion-item").first()).toBeVisible()
}

export async function clickMapCenter(page: Page): Promise<void> {
  const bounds = await page.locator(".ol-viewport").boundingBox()
  if (!bounds) throw new Error("Map viewport is missing")
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
}
