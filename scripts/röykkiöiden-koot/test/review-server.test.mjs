import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { parseArguments, updateAcknowledgement } from "../review-server.mjs"

test("tarkistuspalvelin tallentaa ja poistaa kuittauksen", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "mound-review-server-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const observationId = "a".repeat(64)
  const paths = {
    reviewHtmlFile: path.join(directory, "review.html"),
    reviewFile: path.join(directory, "review.json"),
    reviewAcknowledgementsFile: path.join(directory, "acknowledgements.json")
  }
  await fs.writeFile(paths.reviewHtmlFile, "<!doctype html><title>Testi</title>")
  await fs.writeFile(paths.reviewFile, JSON.stringify({ sites: [{
    mjtunnus: "123",
    issues: [{ observationId, code: "model_review" }]
  }] }))

  const saved = await updateAcknowledgement({
    paths,
    observationId,
    now: () => new Date("2026-08-16T12:00:00Z")
  })
  assert.equal(saved.acknowledgements[observationId].issueCode, "model_review")
  const document = JSON.parse(await fs.readFile(paths.reviewAcknowledgementsFile, "utf8"))
  assert.equal(document.acknowledgements[observationId].mjtunnus, "123")

  const removed = await updateAcknowledgement({ paths, observationId, remove: true })
  assert.deepEqual(removed.acknowledgements, {})
  assert.deepEqual(JSON.parse(await fs.readFile(paths.reviewAcknowledgementsFile, "utf8")).acknowledgements, {})
})

test("parseArguments lukee portin", () => {
  assert.deepEqual(parseArguments([]), { port: 4173 })
  assert.deepEqual(parseArguments(["--port", "5000"]), { port: 5000 })
  assert.throws(() => parseArguments(["--port", "70000"]), /1–65535/)
})
