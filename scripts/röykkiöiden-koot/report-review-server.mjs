#!/usr/bin/env node
import { pathToFileURL } from "node:url"
import { DATA_PATHS } from "./config.mjs"
import { createReviewServer, parseArguments } from "./review-server.mjs"

const paths = { ...DATA_PATHS, reviewHtmlFile: DATA_PATHS.reportReviewHtmlFile, reviewFile: DATA_PATHS.reportReviewFile, reviewAcknowledgementsFile: DATA_PATHS.reportReviewAcknowledgementsFile }
async function main() { const { port } = parseArguments(process.argv.slice(2)); const server = createReviewServer({ paths }); server.listen(port, "127.0.0.1", () => { console.log(`Raporttitulosten tarkistusnäkymä: http://127.0.0.1:${port}`); console.log("Sulje palvelin painamalla Ctrl+C.") }) }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error) => { console.error(error); process.exitCode = 1 })
