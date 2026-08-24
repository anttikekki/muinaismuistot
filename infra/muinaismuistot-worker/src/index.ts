import { handleMuseovirastoRequest } from "./endpoint/museovirasto"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleMuseovirastoRequest(request, env) ?? new Response("Not found", { status: 404 })
  }
} satisfies ExportedHandler<Env>
