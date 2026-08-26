import type { UpdaterEnv } from "./index"
import { sendAlert } from "./alerts"

export async function handleRequest(
  request: Request,
  env: UpdaterEnv,
  getStatus: () => Promise<unknown>,
): Promise<Response> {
  const url = new URL(request.url)
  if (request.method === "GET" && url.pathname === "/health") {
    return Response.json({ ok: true, targetEnvironment: env.TARGET_ENV })
  }
  if (request.headers.get("authorization") !== `Bearer ${env.UPDATER_TOKEN}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }
  if (request.method === "POST" && url.pathname === "/runs") {
    const instance = await env.UPDATE_WORKFLOW.create({ params: { targetEnvironment: env.TARGET_ENV } })
    return Response.json({ id: instance.id, status: await instance.status() }, { status: 202 })
  }
  if (request.method === "GET" && url.pathname === "/status") return Response.json(await getStatus())
  if (request.method === "POST" && url.pathname === "/alerts/test") {
    await sendAlert(
      env,
      `[muinaismuistot.info] Hälytysten testiviesti`,
      `Cloudflare-hälytysten sähköpostilähetys toimii.\nYmpäristö: ${env.TARGET_ENV}\nAika: ${new Date().toISOString()}`,
    )
    return Response.json({ ok: true })
  }
  return Response.json({ error: "not_found" }, { status: 404 })
}
