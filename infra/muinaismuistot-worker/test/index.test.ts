import { env } from "cloudflare:workers"
import { describe, expect, it } from "vitest"
import worker from "../src/index"

describe("muinaismuistot Worker", () => {
  it("serves the root page through the Static Assets binding", async () => {
    const response = await env.ASSETS.fetch(new Request("https://muinaismuistot.info/"))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect((await response.text()).toLowerCase()).toContain("<!doctype html>")
  })

  it("serves directory index pages", async () => {
    const response = await env.ASSETS.fetch(new Request("https://muinaismuistot.info/3d/"))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    await response.text()
  })

  it("resolves directory paths without a trailing slash", async () => {
    const response = await env.ASSETS.fetch(new Request("https://muinaismuistot.info/maisemanmuisti?lang=fi"))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    await response.text()
  })

  it("lets Static Assets serve the www hostname without a Worker redirect", async () => {
    const response = await env.ASSETS.fetch(new Request("https://www.muinaismuistot.info/3d/?model=1"))

    expect(response.status).toBe(200)
    expect(response.headers.get("location")).toBeNull()
    await response.text()
  })

  it("serves JSON with the correct content type and an ETag", async () => {
    const response = await env.ASSETS.fetch(new Request("https://muinaismuistot.info/3d/3d.json"))

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("application/json")
    expect(response.headers.get("etag")).not.toBeNull()
    await response.text()
  })

  it("serves HEAD without a response body", async () => {
    const response = await env.ASSETS.fetch(new Request("https://muinaismuistot.info/3d/3d.json", { method: "HEAD" }))

    expect(response.status).toBe(200)
    expect(await response.text()).toBe("")
  })

  it("returns 404 for a missing asset", async () => {
    const response = await env.ASSETS.fetch(new Request("https://muinaismuistot.info/missing.png"))

    expect(response.status).toBe(404)
    await response.text()
  })

  it("returns 404 for an unknown API route", async () => {
    const missing = await worker.fetch(new Request("https://muinaismuistot.info/api/museovirasto/not-found"), env)
    expect(missing.status).toBe(404)
    expect(await missing.text()).toBe("Not found")
  })
})
