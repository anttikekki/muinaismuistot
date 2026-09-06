import { defineConfig } from "@playwright/test"

// Uses the existing test runner without starting a browser or contacting services.
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: "list",
  outputDir: "test-results/unit"
})
