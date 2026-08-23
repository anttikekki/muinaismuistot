import { env } from "cloudflare:workers"
import { describe, expect, it } from "vitest"
import worker from "../src/index"

describe("muinaismuistot Worker", () => {
  it("serves the root page through the Static Assets binding", async () => {
    const response = await worker.fetch(new Request("https://muinaismuistot.info/"), env)

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect((await response.text()).toLowerCase()).toContain("<!doctype html>")
  })

  it("serves directory index pages", async () => {
    const response = await worker.fetch(new Request("https://muinaismuistot.info/3d/"), env)

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    await response.text()
  })

  it("resolves directory paths without a trailing slash", async () => {
    const response = await worker.fetch(
      new Request("https://muinaismuistot.info/maisemanmuisti?lang=fi"),
      env
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    await response.text()
  })

  it("redirects www to the canonical hostname", async () => {
    const response = await worker.fetch(
      new Request("https://www.muinaismuistot.info/3d/?model=1"),
      env
    )

    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe("https://muinaismuistot.info/3d/?model=1")
  })

  it("serves JSON with the correct content type and an ETag", async () => {
    const response = await worker.fetch(new Request("https://muinaismuistot.info/3d/3d.json"), env)

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("application/json")
    expect(response.headers.get("etag")).not.toBeNull()
    await response.text()
  })

  it("serves HEAD without a response body", async () => {
    const response = await worker.fetch(
      new Request("https://muinaismuistot.info/3d/3d.json", { method: "HEAD" }),
      env
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toBe("")
  })

  it("returns 404 for a missing asset", async () => {
    const response = await worker.fetch(new Request("https://muinaismuistot.info/missing.png"), env)

    expect(response.status).toBe(404)
    await response.text()
  })
})
