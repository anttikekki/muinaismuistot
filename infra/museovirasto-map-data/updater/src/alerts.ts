import type { UpdaterEnv } from "./index"

export async function sendAlert(env: UpdaterEnv, subject: string, text: string): Promise<void> {
  await env.ALERT_EMAIL.send({
    from: env.ALERT_EMAIL_FROM,
    to: env.ALERT_EMAIL_TO,
    subject,
    text,
  })
}

export async function checkSourceFreshness(env: UpdaterEnv, now = new Date()): Promise<void> {
  let metadata: { sourceLastModified?: string; publishedAt?: string; version?: string }
  let sourceTimestamp: string
  let ageHours: number
  let maximumAgeHours: number
  try {
    const response = await fetch(`${env.BASE_URL}/api/museovirasto/meta`, {
      headers: { accept: "application/json" },
    })
    if (!response.ok) throw new Error(`Metadata endpoint returned HTTP ${response.status}`)

    metadata = await response.json() as { sourceLastModified?: string; publishedAt?: string; version?: string }
    const timestamps = [metadata.sourceLastModified, metadata.publishedAt].filter((value): value is string => Boolean(value))
    if (timestamps.length === 0) throw new Error("Metadata has no source timestamp")
    const parsedTimestamps = timestamps.map((value) => ({ value, time: Date.parse(value) }))
    const invalidTimestamp = parsedTimestamps.find(({ time }) => !Number.isFinite(time))
    if (invalidTimestamp) throw new Error(`Invalid source timestamp: ${invalidTimestamp.value}`)
    const oldestTimestamp = parsedTimestamps.reduce((oldest, current) => current.time < oldest.time ? current : oldest)
    sourceTimestamp = oldestTimestamp.value
    const sourceTime = oldestTimestamp.time
    ageHours = (now.getTime() - sourceTime) / 3_600_000
    maximumAgeHours = Number(env.MAX_SOURCE_AGE_HOURS)
    if (!Number.isFinite(maximumAgeHours) || maximumAgeHours <= 0) throw new Error("Invalid MAX_SOURCE_AGE_HOURS")
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await sendAlert(
      env,
      `[muinaismuistot.info] Museoviraston aineiston tuoreustarkistus epäonnistui`,
      `Ympäristö: ${env.TARGET_ENV}\nVirhe: ${message}\nMetadata: ${env.BASE_URL}/api/museovirasto/meta`,
    )
    throw error
  }
  if (ageHours <= maximumAgeHours) return

  await sendAlert(
    env,
    `[muinaismuistot.info] Julkaistu Museoviraston aineisto on vanhentunut`,
    [
      `Ympäristö: ${env.TARGET_ENV}`,
      `Aineistoversio: ${metadata.version ?? "tuntematon"}`,
      `Julkaistun aineiston vanhin lähdeaikaleima: ${sourceTimestamp}`,
      `Blob Last-Modified: ${metadata.sourceLastModified ?? "ei saatavilla"}`,
      `ZIP-aineistopäivä: ${metadata.publishedAt ?? "ei saatavilla"}`,
      `Julkaistun aineiston ikä: ${ageHours.toFixed(1)} tuntia`,
      `Sallittu enimmäisikä: ${maximumAgeHours} tuntia`,
      `Huomio: hälytys koskee ympäristössä julkaistua versiota, ei Museoviraston lähdepalvelun nykytilaa.`,
      `Metadata: ${env.BASE_URL}/api/museovirasto/meta`,
    ].join("\n"),
  )
}
