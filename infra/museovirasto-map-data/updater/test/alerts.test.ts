import { afterEach, describe, expect, it, vi } from "vitest"
import { checkSourceFreshness } from "../src/alerts"
import type { UpdaterEnv } from "../src/index"

function env(): UpdaterEnv {
  return {
    TARGET_ENV: "production",
    BASE_URL: "https://example.test",
    MAX_SOURCE_AGE_HOURS: "36",
    ALERT_EMAIL_FROM: "alerts@example.test",
    ALERT_EMAIL_TO: "owner@example.test",
    ALERT_EMAIL: { send: vi.fn().mockResolvedValue(undefined) },
  } as unknown as UpdaterEnv
}

afterEach(() => vi.unstubAllGlobals())

describe("source freshness alerts", () => {
  it("does not alert for fresh source data", async () => {
    const testEnv = env()
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      version: "20260825T000000Z",
      sourceLastModified: "2026-08-25T00:06:33Z",
    })))

    await checkSourceFreshness(testEnv, new Date("2026-08-25T06:00:00Z"))
    expect(testEnv.ALERT_EMAIL.send).not.toHaveBeenCalled()
  })

  it("alerts when the Museovirasto source is stale", async () => {
    const testEnv = env()
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      version: "20260820T000000Z",
      sourceLastModified: "2026-08-20T00:06:33Z",
    })))

    await checkSourceFreshness(testEnv, new Date("2026-08-25T06:00:00Z"))
    expect(testEnv.ALERT_EMAIL.send).toHaveBeenCalledWith(expect.objectContaining({
      subject: expect.stringContaining("vanhentunut"),
    }))
  })

  it("alerts when stale ZIP contents were uploaded again recently", async () => {
    const testEnv = env()
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      version: "20260820T000000Z",
      sourceLastModified: "2026-08-25T00:06:33Z",
      publishedAt: "2026-08-20T00:00:00Z",
    })))

    await checkSourceFreshness(testEnv, new Date("2026-08-25T06:00:00Z"))
    expect(testEnv.ALERT_EMAIL.send).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining("ZIP-aineistopäivä: 2026-08-20T00:00:00Z"),
    }))
  })

  it("alerts and fails when metadata cannot be checked", async () => {
    const testEnv = env()
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })))

    await expect(checkSourceFreshness(testEnv)).rejects.toThrow("HTTP 503")
    expect(testEnv.ALERT_EMAIL.send).toHaveBeenCalledWith(expect.objectContaining({
      subject: expect.stringContaining("tuoreustarkistus epäonnistui"),
    }))
  })
})
