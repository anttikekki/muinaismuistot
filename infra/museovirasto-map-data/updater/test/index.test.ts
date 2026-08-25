import { describe, expect, it, vi } from "vitest"
import { handleRequest } from "../src/request"

function env(overrides: Record<string, unknown> = {}) {
  return {
    TARGET_ENV: "preview",
    BASE_URL: "https://example.test",
    UPDATER_TOKEN: "secret",
    UPDATE_WORKFLOW: { create: vi.fn() },
    UPDATE_CONTAINER: {},
    CLOUDFLARE_API_TOKEN: "api-token",
    CLOUDFLARE_ACCOUNT_ID: "account-id",
    ...overrides,
  } as never
}

describe("updater HTTP API", () => {
  it("exposes an unauthenticated health check", async () => {
    const response = await handleRequest(new Request("https://updater.test/health"), env(), vi.fn())
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true, targetEnvironment: "preview" })
  })

  it("protects update operations", async () => {
    const response = await handleRequest(new Request("https://updater.test/runs", { method: "POST" }), env(), vi.fn())
    expect(response.status).toBe(401)
  })

  it("starts a workflow only for the configured environment", async () => {
    const status = vi.fn().mockResolvedValue({ status: "queued" })
    const create = vi.fn().mockResolvedValue({ id: "run-1", status })
    const request = new Request("https://updater.test/runs", {
      method: "POST",
      headers: { authorization: "Bearer secret" },
    })
    const response = await handleRequest(request, env({ UPDATE_WORKFLOW: { create } }), vi.fn())
    expect(response.status).toBe(202)
    expect(create).toHaveBeenCalledWith({ params: { targetEnvironment: "preview" } })
    await expect(response.json()).resolves.toMatchObject({ id: "run-1" })
  })
})
