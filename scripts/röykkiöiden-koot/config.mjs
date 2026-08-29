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

export const DOCUMENT_CONFIG = Object.freeze({
  ...KYPPI_CONFIG,
  // Maakunta- ja läänikohtaiset inventoinnit voivat olla hyvin suuria.
  maxPdfBytes: 500 * 1024 * 1024
})

export const OPENAI_CONFIG = Object.freeze({
  model: "gpt-5.6-luna",
  reasoningEffort: "medium",
  maxOutputTokens: 8_000,
  requestTimeoutMs: 120_000,
  maxRetries: 2,
  concurrency: 1,
  maxConcurrency: 3
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
  ),
  documentIndexFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "7_document-index.json"
  ),
  documentRecordPagesDirectory: path.join(
    SCRIPT_DIRECTORY,
    "source-data",
    "document-record-pages"
  ),
  documentsDirectory: path.join(SCRIPT_DIRECTORY, "source-data", "documents"),
  documentTextsDirectory: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "document-texts"
  ),
  documentDownloadManifestFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "8_document-download-manifest.json"
  ),
  documentPassagesFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "9_document-passages.jsonl"
  ),
  documentPassagesReportFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "9_document-passages-report.json"
  ),
  documentCoverageReportFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "9_document-coverage.json"
  ),
  reportLlmResponsesDirectory: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "report-llm-responses"
  ),
  reportMoundDimensionsFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "10_report-mound-dimensions.jsonl"
  ),
  reportExtractionReportFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "10_report-extraction-report.json"
  ),
  validatedReportResultsFile: path.join(SCRIPT_DIRECTORY, "intermediate", "11_validated-report-results.jsonl"),
  reportReviewFile: path.join(SCRIPT_DIRECTORY, "intermediate", "11_report-review.json"),
  reportReviewHtmlFile: path.join(SCRIPT_DIRECTORY, "intermediate", "11_report-review.html"),
  reportReviewAcknowledgementsFile: path.join(SCRIPT_DIRECTORY, "intermediate", "11_report-review-acknowledgements.json"),
  reportValidationReportFile: path.join(SCRIPT_DIRECTORY, "intermediate", "11_report-validation-report.json"),
  finalReportMoundsFile: path.join(SCRIPT_DIRECTORY, "results", "12_report-mounds.jsonl"),
  finalReportMoundsGeoJsonFile: path.join(SCRIPT_DIRECTORY, "results", "12_report-mounds.geojson"),
  finalReportBuildReportFile: path.join(SCRIPT_DIRECTORY, "results", "12_report-build-report.json"),
  pipelineReportFile: path.join(SCRIPT_DIRECTORY, "results", "13_pipeline-report.json"),
  pipelineReportHtmlFile: path.join(SCRIPT_DIRECTORY, "results", "13_pipeline-report.html"),
  llmResponsesDirectory: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "llm-responses"
  ),
  moundDimensionsFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "4_mound-dimensions.jsonl"
  ),
  extractionReportFile: path.join(
    SCRIPT_DIRECTORY,
    "intermediate",
    "4_extraction-report.json"
  ),
  validatedResultsFile: path.join(SCRIPT_DIRECTORY, "intermediate", "5_validated.jsonl"),
  reviewFile: path.join(SCRIPT_DIRECTORY, "intermediate", "5_review.json"),
  reviewHtmlFile: path.join(SCRIPT_DIRECTORY, "intermediate", "5_review.html"),
  reviewAcknowledgementsFile: path.join(SCRIPT_DIRECTORY, "intermediate", "5_review-acknowledgements.json"),
  validationReportFile: path.join(SCRIPT_DIRECTORY, "intermediate", "5_validation-report.json"),
  moundsDatabaseFile: path.join(SCRIPT_DIRECTORY, "results", "6_mounds.geojson"),
  moundsDatabaseHtmlFile: path.join(SCRIPT_DIRECTORY, "results", "6_mounds.html"),
  databaseBuildReportFile: path.join(SCRIPT_DIRECTORY, "results", "6_build-report.json")
})
