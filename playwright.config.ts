import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.E2E_BASE_URL ??
  "https://muinaismuistot-preview.antti-kekki.workers.dev"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "pmtiles",
      testMatch: "pmtiles.spec.ts",
      timeout: 90_000,
      use: { ...devices["Desktop Chrome"], channel: "chrome" }
    },
    {
      name: "wms",
      testMatch: "wms.spec.ts",
      timeout: 150_000,
      use: { ...devices["Desktop Chrome"], channel: "chrome" }
    }
  ]
})
