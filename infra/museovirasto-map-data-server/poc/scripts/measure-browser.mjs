#!/usr/bin/env node

import { spawn } from "node:child_process"

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const views = ["finland", "bronze", "city", "near"]
const runId = `${Date.now()}-${process.pid}`

async function waitForTarget(port) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
      const page = targets.find((target) => target.type === "page")
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error("Chrome DevTools target did not start")
}

async function measure(view, index) {
  const port = 9322 + index
  const process = spawn(chrome, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/museovirasto-benchmark-${runId}-${view}`,
    `http://localhost:8787/?benchmark=${view}`,
  ], { stdio: "ignore" })
  try {
    const socket = new WebSocket(await waitForTarget(port))
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true })
      socket.addEventListener("error", reject, { once: true })
    })
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Measurement timed out: ${view}`)), 30_000)
      socket.addEventListener("message", (event) => {
        const message = JSON.parse(String(event.data))
        if (message.id !== 1) return
        clearTimeout(timeout)
        if (message.error) reject(new Error(message.error.message))
        else resolve(message.result.result.value)
      })
      socket.send(JSON.stringify({
        id: 1,
        method: "Runtime.evaluate",
        params: {
          expression: `new Promise((resolve) => { const timer = setInterval(() => { if (document.body.dataset.benchmarkReady === "true") { clearInterval(timer); resolve(JSON.parse(document.getElementById("benchmark-result").textContent)); } }, 50); })`,
          awaitPromise: true,
          returnByValue: true,
        },
      }))
    })
    socket.close()
    return result
  } finally {
    process.kill("SIGTERM")
  }
}

const results = []
for (const [index, view] of views.entries()) results.push(await measure(view, index))
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`)
