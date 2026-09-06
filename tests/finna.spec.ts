import { expect, test } from "@playwright/test"
import { fetchFinnaImageCount } from "../src/common/util/finnaImageCount"

const originalFetch = globalThis.fetch

test.afterEach(() => {
  globalThis.fetch = originalFetch
})

test("Finna network failures resolve without rejecting React's promise", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch")
  }
  await expect(fetchFinnaImageCount(123)).resolves.toBeNull()
})

test("Finna HTTP errors are ignored even if the body looks successful", async () => {
  for (const status of [404, 429, 500, 503]) {
    globalThis.fetch = async () =>
      Response.json({ resultCount: 12 }, { status })
    await expect(fetchFinnaImageCount(123)).resolves.toBeNull()
  }
})

test("Finna malformed JSON and invalid counts are ignored", async () => {
  globalThis.fetch = async () => new Response("not JSON")
  await expect(fetchFinnaImageCount(123)).resolves.toBeNull()

  for (const body of [
    null,
    {},
    { resultCount: "12" },
    { resultCount: -1 },
    { resultCount: 1.5 }
  ]) {
    globalThis.fetch = async () => Response.json(body)
    await expect(fetchFinnaImageCount(123)).resolves.toBeNull()
  }
})

test("Finna valid counts are preserved and the request identifies the selected site", async () => {
  for (const resultCount of [0, 12]) {
    globalThis.fetch = async (input) => {
      const url = new URL(String(input))
      expect(url.origin).toBe("https://api.finna.fi")
      expect(url.searchParams.getAll("filter[]")).toContain(
        'geographic_id_str_mv:"(mjr)123"'
      )
      return Response.json({ resultCount, status: "OK" })
    }
    await expect(fetchFinnaImageCount(123)).resolves.toBe(resultCount)
  }
})
