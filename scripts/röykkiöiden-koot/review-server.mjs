#!/usr/bin/env node

import http from "node:http"
import fs from "node:fs/promises"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { readJsonIfExists, writeJsonAtomic } from "./lib/files.mjs"

const DEFAULT_HOST = "127.0.0.1"
const DEFAULT_PORT = 4173

export function createReviewServer({ paths = DATA_PATHS, now = () => new Date() } = {}) {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host || DEFAULT_HOST}`)
      if (request.method === "GET" && url.pathname === "/") {
        return send(response, 200, await fs.readFile(paths.reviewHtmlFile), "text/html; charset=utf-8")
      }
      if (request.method === "GET" && url.pathname === "/api/acknowledgements") {
        return sendJson(response, 200, await readAcknowledgements(paths.reviewAcknowledgementsFile))
      }

      const match = /^\/api\/acknowledgements\/([a-f0-9]{64})$/.exec(url.pathname)
      if (match && ["POST", "DELETE"].includes(request.method)) {
        const document = await updateAcknowledgement({
          paths,
          observationId: match[1],
          remove: request.method === "DELETE",
          now
        })
        if (!document) return sendJson(response, 404, { error: "Havaintoa ei löydy nykyisestä raportista" })
        return sendJson(response, 200, document)
      }

      sendJson(response, 404, { error: "Reittiä ei löydy" })
    } catch (error) {
      if (error.code === "ENOENT") {
        return sendJson(response, 404, { error: "Aja ensin npm run step:5" })
      }
      console.error(error)
      sendJson(response, 500, { error: "Palvelimen sisäinen virhe" })
    }
  })
}

export async function updateAcknowledgement({ paths = DATA_PATHS, observationId, remove = false, now = () => new Date() }) {
  const observations = await readCurrentObservations(paths.reviewFile)
  const observation = observations.get(observationId)
  if (!observation) return null

  const document = await readAcknowledgements(paths.reviewAcknowledgementsFile)
  if (remove) {
    delete document.acknowledgements[observationId]
  } else {
    document.acknowledgements[observationId] = {
      acknowledgedAt: now().toISOString(),
      mjtunnus: observation.mjtunnus,
      issueCode: observation.issue.code
    }
  }
  document.updatedAt = now().toISOString()
  await writeJsonAtomic(paths.reviewAcknowledgementsFile, document)
  return document
}

async function readAcknowledgements(file) {
  return (await readJsonIfExists(file)) ?? {
    formatVersion: 1,
    updatedAt: null,
    acknowledgements: {}
  }
}

async function readCurrentObservations(file) {
  const report = JSON.parse(await fs.readFile(file, "utf8"))
  return new Map(report.sites.flatMap((site) => site.issues.map((issue) => [
    issue.observationId,
    { mjtunnus: site.mjtunnus, issue }
  ])))
}

function sendJson(response, status, value) {
  send(response, status, `${JSON.stringify(value)}\n`, "application/json; charset=utf-8")
}

function send(response, status, body, contentType) {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  })
  response.end(body)
}

export function parseArguments(args) {
  let port = DEFAULT_PORT
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--port" && /^\d+$/.test(args[index + 1] ?? "")) {
      port = Number(args[index + 1])
      index += 1
    } else {
      throw new Error(`Tuntematon tai virheellinen valinta: ${args[index]}`)
    }
  }
  if (port < 1 || port > 65535) throw new Error("Portin pitää olla väliltä 1–65535")
  return { port }
}

async function main() {
  const { port } = parseArguments(process.argv.slice(2))
  const server = createReviewServer()
  server.listen(port, DEFAULT_HOST, () => {
    console.log(`Tarkistusnäkymä: http://${DEFAULT_HOST}:${port}`)
    console.log("Sulje palvelin painamalla Ctrl+C.")
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1 })
}
