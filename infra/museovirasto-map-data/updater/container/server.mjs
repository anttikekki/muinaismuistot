import { spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import { createServer } from "node:http"

const port = Number(process.env.PORT ?? 8080)
let running = false

function send(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" })
  response.end(`${JSON.stringify(body)}\n`)
}

function runUpdate(environment, mode) {
  return new Promise((resolve) => {
    const child = spawn(
      "/workspace/infra/museovirasto-map-data/updater/container/run-update.sh",
      [environment, mode],
      { env: process.env, stdio: ["ignore", "pipe", "pipe"] },
    )
    let output = ""
    const append = (chunk) => {
      const text = chunk.toString()
      process.stdout.write(text)
      output = `${output}${text}`.slice(-64 * 1024)
    }
    child.stdout.on("data", append)
    child.stderr.on("data", append)
    child.on("close", (code, signal) => resolve({ code: code ?? 1, signal, output }))
  })
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`)
  if (request.method === "GET" && ["/", "/ping", "/health"].includes(url.pathname)) {
    return send(response, 200, { ok: true, running, architecture: process.arch })
  }
  if (request.method !== "POST" || url.pathname !== "/run") {
    return send(response, 404, { error: "not_found" })
  }
  if (running) return send(response, 409, { error: "update_already_running" })

  const environment = process.env.TARGET_ENV
  const mode = process.env.UPDATE_MODE ?? "publish"
  if (!['preview', 'production'].includes(environment ?? '') || !['build', 'publish'].includes(mode)) {
    return send(response, 500, { error: "invalid_container_configuration" })
  }

  running = true
  const startedAt = new Date().toISOString()
  response.writeHead(200, { "content-type": "application/json; charset=utf-8" })
  // Keep the Container-to-Worker request active while the batch job is silent.
  // Leading JSON whitespace is harmless when the final response is parsed.
  const heartbeat = setInterval(() => response.write("\n"), 10_000)
  try {
    const result = await runUpdate(environment, mode)
    let version
    try {
      const metadata = JSON.parse(await readFile("/workspace/infra/museovirasto-map-data/data/build/current-metadata.json", "utf8"))
      version = metadata.version
    } catch {}
    const body = { ok: result.code === 0, startedAt, finishedAt: new Date().toISOString(), version, ...result }
    response.end(`${JSON.stringify(body)}\n`)
  } finally {
    clearInterval(heartbeat)
    running = false
  }
}).listen(port, "0.0.0.0", () => console.log(`Updater listening on ${port} (${process.arch})`))
