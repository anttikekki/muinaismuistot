import { handleMuseovirastoRequest } from "../../../muinaismuistot-worker/src/endpoint/museovirasto"

export { handleMuseovirastoRequest, parseSingleRange } from "../../../muinaismuistot-worker/src/endpoint/museovirasto"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleMuseovirastoRequest(request, env) ?? env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
