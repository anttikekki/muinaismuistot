import assert from "node:assert/strict"
import test from "node:test"

import { KYPPI_CONFIG } from "../config.mjs"
import {
  createRequestRateLimiter,
  downloadKyppiPage,
  validateKyppiHtml
} from "../lib/kyppi-download.mjs"

const VALID_HTML = `<!DOCTYPE HTML>
<html lang="fi">
<head><title>Kulttuuriymp&auml;rist&ouml;n palveluikkuna</title></head>
<body><span id="kuvaus">Röykkiön halkaisija on 11 m.</span></body>
</html>`

test("downloadKyppiPage palauttaa HTML:n ja uudelleenohjauksen jälkeisen URL:n", async () => {
  const result = await downloadKyppiPage({
    sourceUrl: "https://www.kyppi.fi/to.aspx?id=112.4010002",
    config: { ...KYPPI_CONFIG, retryCount: 0 },
    fetchImpl: async (_url, options) => {
      assert.equal(options.redirect, "follow")
      assert.equal(options.headers.Accept, "text/html,application/xhtml+xml")
      return htmlResponse(VALID_HTML, {
        url: "https://www.kyppi.fi/palveluikkuna/kohde/4010002"
      })
    }
  })

  assert.equal(result.httpStatus, 200)
  assert.equal(result.attempts, 1)
  assert.equal(
    result.finalUrl,
    "https://www.kyppi.fi/palveluikkuna/kohde/4010002"
  )
  assert.equal(result.contents.toString("utf8"), VALID_HTML)
  assert.match(result.sha256, /^[a-f0-9]{64}$/)
})

test("downloadKyppiPage yrittää tilapäisen HTTP-virheen jälkeen uudelleen", async () => {
  let requestCount = 0
  const waits = []

  const result = await downloadKyppiPage({
    sourceUrl: "https://www.kyppi.fi/to.aspx?id=112.4010002",
    config: { ...KYPPI_CONFIG, retryCount: 1, retryDelayMs: 25 },
    sleep: async (milliseconds) => waits.push(milliseconds),
    fetchImpl: async () => {
      requestCount += 1
      if (requestCount === 1) return errorResponse(503)
      return htmlResponse(VALID_HTML)
    }
  })

  assert.equal(result.attempts, 2)
  assert.equal(requestCount, 2)
  assert.deepEqual(waits, [25])
})

test("downloadKyppiPage ei yritä virheellistä sisältöä toistuvasti", async () => {
  let requestCount = 0

  await assert.rejects(
    downloadKyppiPage({
      sourceUrl: "https://www.kyppi.fi/to.aspx?id=112.4010002",
      config: { ...KYPPI_CONFIG, retryCount: 2 },
      fetchImpl: async () => {
        requestCount += 1
        return htmlResponse("<html><body>Kirjaudu sisään</body></html>")
      }
    }),
    (error) => {
      assert.equal(error.attempts, 1)
      assert.match(error.message, /ei näytä arkeologisen kohteen sivulta/)
      return true
    }
  )

  assert.equal(requestCount, 1)
})

test("validateKyppiHtml hylkää muun kuin HTML-sisältötyypin", () => {
  assert.throws(
    () => validateKyppiHtml(Buffer.from(VALID_HTML), "application/json"),
    /sisältötyyppi ei ole HTML/
  )
})

test("createRequestRateLimiter pitää pyyntöjen välissä asetetun ajan", async () => {
  let currentTime = 1_000
  const waits = []
  const limiter = createRequestRateLimiter({
    delayMs: 250,
    now: () => currentTime,
    sleep: async (milliseconds) => {
      waits.push(milliseconds)
      currentTime += milliseconds
    }
  })

  await limiter()
  await limiter()
  await limiter()

  assert.deepEqual(waits, [250, 250])
})

function htmlResponse(
  html,
  {
    status = 200,
    url = "https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx"
  } = {}
) {
  const bytes = new TextEncoder().encode(html)
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
    arrayBuffer: async () => bytes.buffer
  }
}

function errorResponse(status) {
  return {
    ok: false,
    status,
    url: "https://www.kyppi.fi/error",
    headers: new Headers()
  }
}
