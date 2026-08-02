const MULTI_VALUE_FIELDS = new Set(["tyyppi", "alatyyppi", "ajoitus"])

export function buildWfsUrl({
  endpoint,
  version,
  typeNames,
  outputFormat,
  cqlFilter,
  count,
  startIndex
}) {
  assertPositiveInteger(count, "count")
  assertNonNegativeInteger(startIndex, "startIndex")

  const url = new URL(endpoint)
  url.search = new URLSearchParams({
    service: "WFS",
    acceptversions: version,
    request: "GetFeature",
    typeNames,
    count: String(count),
    startIndex: String(startIndex),
    outputFormat,
    cql_filter: cqlFilter
  }).toString()

  return url
}

export function normalizeFeature(feature) {
  validateFeature(feature)

  const properties = Object.fromEntries(
    Object.entries(feature.properties).map(([key, value]) => {
      if (MULTI_VALUE_FIELDS.has(key)) {
        return [key, splitMultiValue(value)]
      }

      if (key === "mjtunnus") {
        return [key, String(value)]
      }

      return [key, typeof value === "string" ? value.trim() : value]
    })
  )

  return {
    ...feature,
    geometry: structuredClone(feature.geometry),
    properties
  }
}

export function validateFeature(feature) {
  if (!feature || feature.type !== "Feature") {
    throw new Error("WFS-tuloksen tietue ei ole GeoJSON Feature")
  }

  if (typeof feature.id !== "string" || feature.id.length === 0) {
    throw new Error("WFS Featureltä puuttuu id")
  }

  if (!feature.geometry || typeof feature.geometry !== "object") {
    throw new Error(`WFS Featureltä ${feature.id} puuttuu geometria`)
  }

  if (!feature.properties || typeof feature.properties !== "object") {
    throw new Error(`WFS Featureltä ${feature.id} puuttuvat properties-tiedot`)
  }

  const mjtunnus = String(feature.properties.mjtunnus ?? "")
  if (!/^\d+$/.test(mjtunnus)) {
    throw new Error(`WFS Featurellä ${feature.id} on virheellinen mjtunnus`)
  }

  let url
  try {
    url = new URL(feature.properties.url)
  } catch {
    throw new Error(`WFS Featurellä ${feature.id} on virheellinen Kyppi-URL`)
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`WFS Featurellä ${feature.id} on virheellinen Kyppi-URL`)
  }
}

export function validateFeatureCollection(collection) {
  if (!collection || collection.type !== "FeatureCollection") {
    throw new Error("WFS-vastaus ei ole GeoJSON FeatureCollection")
  }

  if (!Array.isArray(collection.features)) {
    throw new Error("WFS-vastauksesta puuttuu features-taulukko")
  }

  const numberReturned = parseNonNegativeInteger(
    collection.numberReturned,
    "numberReturned"
  )
  const numberMatched = parseNonNegativeInteger(
    collection.numberMatched,
    "numberMatched"
  )

  if (numberReturned !== collection.features.length) {
    throw new Error(
      `WFS-vastauksen numberReturned (${numberReturned}) ei vastaa ` +
        `features-taulukon kokoa (${collection.features.length})`
    )
  }

  for (const feature of collection.features) {
    validateFeature(feature)
  }

  return { numberMatched, numberReturned }
}

export async function fetchSiteIndex({
  config,
  fetchImpl = globalThis.fetch,
  pageSize = config.pageSize,
  limit,
  onPage = async () => {},
  sleep = defaultSleep
}) {
  assertPositiveInteger(pageSize, "pageSize")
  if (limit !== undefined) {
    assertPositiveInteger(limit, "limit")
  }

  const rawFeatures = []
  const normalizedFeatures = []
  const seenMjtunnukset = new Set()
  const pages = []
  let expectedNumberMatched
  let startIndex = 0

  while (expectedNumberMatched === undefined || startIndex < expectedNumberMatched) {
    const remaining = limit === undefined ? pageSize : limit - rawFeatures.length
    if (remaining <= 0) break

    const count = Math.min(pageSize, remaining)
    const url = buildWfsUrl({ ...config, count, startIndex })
    const collection = await fetchWfsPage({
      url,
      config,
      fetchImpl,
      sleep
    })
    const { numberMatched, numberReturned } = validateFeatureCollection(collection)

    if (expectedNumberMatched === undefined) {
      expectedNumberMatched = numberMatched
    } else if (numberMatched !== expectedNumberMatched) {
      throw new Error(
        `WFS-vastauksen numberMatched muuttui kesken haun: ` +
          `${expectedNumberMatched} -> ${numberMatched}`
      )
    }

    for (const feature of collection.features) {
      const mjtunnus = String(feature.properties.mjtunnus)
      if (seenMjtunnukset.has(mjtunnus)) {
        throw new Error(`WFS-vastaus sisälsi mjtunnus-duplikaatin ${mjtunnus}`)
      }

      seenMjtunnukset.add(mjtunnus)
      rawFeatures.push(feature)
      normalizedFeatures.push(normalizeFeature(feature))
    }

    const page = {
      startIndex,
      count,
      numberReturned,
      url: url.toString()
    }
    pages.push(page)
    await onPage({ collection, ...page })

    if (numberReturned === 0) break
    startIndex += numberReturned
  }

  return {
    rawFeatures,
    normalizedFeatures,
    numberMatched: expectedNumberMatched ?? 0,
    pages
  }
}

async function fetchWfsPage({ url, config, fetchImpl, sleep }) {
  let lastError

  for (let attempt = 0; attempt <= config.retryCount; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": config.userAgent
        },
        signal: AbortSignal.timeout(config.requestTimeoutMs)
      })

      if (!response.ok) {
        throw new Error(`WFS palautti HTTP-tilan ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      lastError = error
      if (attempt < config.retryCount) {
        await sleep(config.retryDelayMs * 2 ** attempt)
      }
    }
  }

  throw new Error(`WFS-sivun haku epäonnistui: ${lastError.message}`, {
    cause: lastError
  })
}

function splitMultiValue(value) {
  if (value === null || value === undefined) {
    return []
  }

  if (typeof value !== "string") {
    throw new Error("WFS:n moniarvokentän arvo ei ole merkkijono")
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseNonNegativeInteger(value, name) {
  const parsed = typeof value === "string" ? Number(value) : value
  assertNonNegativeInteger(parsed, name)
  return parsed
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} pitää olla positiivinen kokonaisluku`)
  }
}

function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} pitää olla nolla tai positiivinen kokonaisluku`)
  }
}

function defaultSleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
