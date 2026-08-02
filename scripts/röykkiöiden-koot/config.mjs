import path from "node:path"
import { fileURLToPath } from "node:url"

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))

export const WFS_CONFIG = Object.freeze({
  endpoint: "https://geoserver.museovirasto.fi/geoserver/ows",
  version: "2.0.0",
  typeNames: "rajapinta_suojellut:muinaisjaannos_piste",
  outputFormat: "application/json",
  cqlFilter:
    "tyyppi ILIKE '%hautapaikat%' AND alatyyppi ILIKE '%hautaröykkiöt%'",
  pageSize: 100,
  requestTimeoutMs: 30_000,
  retryCount: 2,
  retryDelayMs: 1_000,
  userAgent:
    "muinaismuistot.info-data-script/1.0 (+https://www.muinaismuistot.info)"
})

export const KYPPI_CONFIG = Object.freeze({
  concurrency: 1,
  maxConcurrency: 3,
  requestDelayMs: 1_000,
  minRequestDelayMs: 250,
  requestTimeoutMs: 30_000,
  retryCount: 2,
  retryDelayMs: 2_000,
  userAgent:
    "muinaismuistot.info-data-script/1.0 (+https://www.muinaismuistot.info)"
})

export const DATA_PATHS = Object.freeze({
  wfsPagesDirectory: path.join(SCRIPT_DIRECTORY, "source-data", "wfs", "pages"),
  wfsFeaturesDirectory: path.join(
    SCRIPT_DIRECTORY,
    "source-data",
    "wfs",
    "features"
  ),
  siteIndexFile: path.join(SCRIPT_DIRECTORY, "intermediate", "1_sites.geojson"),
  manifestFile: path.join(SCRIPT_DIRECTORY, "intermediate", "1_manifest.json"),
  kyppiPagesDirectory: path.join(SCRIPT_DIRECTORY, "source-data", "pages"),
  downloadManifestFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "2_download-manifest.json"
  ),
  parsedSiteContentFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "3_site-content.jsonl"
  ),
  parseReportFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "3_parse-report.json"
  )
})
