#!/usr/bin/env node

import http from "node:http"
import fs from "node:fs/promises"
import { pathToFileURL } from "node:url"

import { DATA_PATHS } from "./config.mjs"
import { readJsonIfExists, writeJsonAtomic } from "./lib/files.mjs"

const DEFAULT_HOST = "127.0.0.1"
const DEFAULT_PORT = 4173
const DEFAULT_PATHS = {
  ...DATA_PATHS,
  reviewHtmlFile: DATA_PATHS.reportReviewHtmlFile,
  reviewFile: DATA_PATHS.reportReviewFile,
  reviewAcknowledgementsFile: DATA_PATHS.reportReviewAcknowledgementsFile
}

export function createReviewServer({ paths = DEFAULT_PATHS, now = () => new Date() } = {}) {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host || DEFAULT_HOST}`)
      if (request.method === "GET" && url.pathname === "/") {
        return send(response, 200, await fs.readFile(paths.reviewHtmlFile), "text/html; charset=utf-8")
      }
      if (request.method === "GET" && url.pathname === "/api/acknowledgements") {
        return sendJson(response, 200, await readReviewState(paths))
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

      const moundDecisionMatch = /^\/api\/mound-decisions\/(\d+)\/(\d+)$/.exec(url.pathname)
      if (moundDecisionMatch && ["POST", "DELETE"].includes(request.method)) {
        const document = await updateMoundDecision({
          paths,
          mjtunnus: moundDecisionMatch[1],
          sourceOrder: Number(moundDecisionMatch[2]),
          remove: request.method === "DELETE",
          now
        })
        if (!document) return sendJson(response, 404, { error: "Röykkiötä ei löydy nykyisestä tarkistusraportista" })
        return sendJson(response, 200, document)
      }

      sendJson(response, 404, { error: "Reittiä ei löydy" })
    } catch (error) {
      if (error.code === "ENOENT") {
        return sendJson(response, 404, { error: "Aja ensin npm run step:11" })
      }
      console.error(error)
      sendJson(response, 500, { error: "Palvelimen sisäinen virhe" })
    }
  })
}

export async function updateAcknowledgement({ paths = DEFAULT_PATHS, observationId, remove = false, now = () => new Date() }) {
  const observations = await readCurrentObservations(paths.reviewFile)
  const observation = observations.get(observationId)
  if (!observation) return null

  const document = await readReviewState(paths)
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

export async function updateMoundDecision({ paths = DEFAULT_PATHS, mjtunnus, sourceOrder, remove = false, now = () => new Date() }) {
  const report = JSON.parse(await fs.readFile(paths.reviewFile, "utf8"))
  const site = report.sites.find((item) => item.mjtunnus === mjtunnus)
  if (!site?.mounds?.some((mound) => mound.sourceOrder === sourceOrder)) return null
  const document = await readReviewState(paths)
  document.moundDecisions ??= {}
  const key = `${mjtunnus}:${sourceOrder}`
  if (remove) delete document.moundDecisions[key]
  else document.moundDecisions[key] = {
    status: "permanently_skipped",
    reason: "unresolved_conflict",
    mjtunnus,
    sourceOrder,
    skippedAt: now().toISOString()
  }
  document.updatedAt = now().toISOString()
  await writeJsonAtomic(paths.reviewAcknowledgementsFile, document)
  return document
}

async function readAcknowledgements(file) {
  return (await readJsonIfExists(file)) ?? {
    formatVersion: 1,
    updatedAt: null,
    acknowledgements: {},
    moundDecisions: {}
  }
}

export async function readReviewState(paths = DEFAULT_PATHS) {
  const document = await readAcknowledgements(paths.reviewAcknowledgementsFile)
  document.moundDecisions ??= {}
  const legacyDecisions = document.siteDecisions ?? {}
  if (Object.keys(legacyDecisions).length === 0) return document
  const report = JSON.parse(await fs.readFile(paths.reviewFile, "utf8"))
  for (const [mjtunnus, decision] of Object.entries(legacyDecisions)) {
    if (decision.status !== "permanently_skipped") continue
    const site = report.sites.find((item) => item.mjtunnus === mjtunnus)
    const issueOrders = [...new Set((site?.issues ?? []).map((issue) => issue.mound).filter(Number.isInteger))]
    const orders = issueOrders.length > 0
      ? issueOrders
      : (site?.mounds ?? []).map((mound) => mound.sourceOrder).filter(Number.isInteger)
    for (const sourceOrder of orders) {
      document.moundDecisions[`${mjtunnus}:${sourceOrder}`] ??= {
        status: "permanently_skipped", reason: decision.reason ?? "unresolved_conflict",
        mjtunnus, sourceOrder, skippedAt: decision.skippedAt ?? new Date().toISOString()
      }
    }
  }
  delete document.siteDecisions
  await writeJsonAtomic(paths.reviewAcknowledgementsFile, document)
  return document
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
