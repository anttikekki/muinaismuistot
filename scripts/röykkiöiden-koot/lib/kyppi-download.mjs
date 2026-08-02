import crypto from "node:crypto"

export async function downloadKyppiPage({
  sourceUrl,
  config,
  fetchImpl = globalThis.fetch,
  waitForRequest = async () => {},
  sleep = defaultSleep
}) {
  validateSourceUrl(sourceUrl)
  let lastError
  let attempts = 0

  for (let attempt = 1; attempt <= config.retryCount + 1; attempt += 1) {
    attempts = attempt
    await waitForRequest()

    try {
      const response = await fetchImpl(sourceUrl, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": config.userAgent
        },
        redirect: "follow",
        signal: AbortSignal.timeout(config.requestTimeoutMs)
      })

      if (!response.ok) {
        const error = new Error(`Kyppi palautti HTTP-tilan ${response.status}`)
        error.httpStatus = response.status
        error.retryable = response.status === 429 || response.status >= 500
        throw error
      }

      const contentType = response.headers.get("content-type") ?? ""
      const contents = Buffer.from(await response.arrayBuffer())
      validateKyppiHtml(contents, contentType)

      return {
        contents,
        sourceUrl,
        finalUrl: response.url || sourceUrl,
        httpStatus: response.status,
        contentType,
        attempts: attempt,
        sha256: crypto.createHash("sha256").update(contents).digest("hex")
      }
    } catch (error) {
      lastError = error
      const retryable = error.retryable !== false
      if (!retryable || attempt > config.retryCount) break
      await sleep(config.retryDelayMs * 2 ** (attempt - 1))
    }
  }

  const error = new Error(`Kyppi-sivun lataus epäonnistui: ${lastError.message}`, {
    cause: lastError
  })
  error.attempts = attempts
  error.httpStatus = lastError.httpStatus ?? null
  throw error
}

export function validateKyppiHtml(contents, contentType) {
  if (!/^text\/html(?:;|$)|^application\/xhtml\+xml(?:;|$)/i.test(contentType)) {
    const error = new Error(
      `Kyppi-vastauksen sisältötyyppi ei ole HTML: ${contentType || "puuttuu"}`
    )
    error.retryable = false
    throw error
  }

  const html = decodeHtml(contents, contentType)
  const isHtml = /<!doctype\s+html|<html(?:\s|>)/i.test(html)
  const isSitePage =
    /id=["']kuvaus["']/i.test(html) &&
    /Kulttuuriymp(?:ä|&auml;)rist(?:ö|&ouml;)n palveluikkuna/i.test(html)

  if (!isHtml || !isSitePage) {
    const error = new Error("Kyppi-vastaus ei näytä arkeologisen kohteen sivulta")
    error.retryable = false
    throw error
  }
}

export function createRequestRateLimiter({
  delayMs,
  now = () => Date.now(),
  sleep = defaultSleep
}) {
  let nextRequestAt = 0
  let queue = Promise.resolve()

  return () => {
    const turn = queue.then(async () => {
      const waitMs = Math.max(0, nextRequestAt - now())
      if (waitMs > 0) await sleep(waitMs)
      nextRequestAt = now() + delayMs
    })
    queue = turn.catch(() => {})
    return turn
  }
}

function validateSourceUrl(sourceUrl) {
  let url
  try {
    url = new URL(sourceUrl)
  } catch {
    throw new Error(`Virheellinen Kyppi-URL: ${sourceUrl}`)
  }

  if (url.protocol !== "https:" || url.hostname !== "www.kyppi.fi") {
    throw new Error(`Kyppi-URL ei osoita sallittuun palveluun: ${sourceUrl}`)
  }
}

function decodeHtml(contents, contentType) {
  const charset = /charset\s*=\s*["']?([^;"'\s]+)/i.exec(contentType)?.[1]
  try {
    return new TextDecoder(charset || "utf-8").decode(contents)
  } catch {
    return new TextDecoder("utf-8").decode(contents)
  }
}

function defaultSleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
