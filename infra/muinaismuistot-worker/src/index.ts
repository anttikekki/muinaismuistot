import { handleMuseovirastoRequest } from "./endpoint/museovirasto"

const previewHostname = "muinaismuistot-preview.antti-kekki.workers.dev"
const robotsHeader = "noindex, nofollow, noarchive"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response =
      (await handleMuseovirastoRequest(request, env)) ??
      new Response("Not found", { status: 404 })

    if (new URL(request.url).hostname !== previewHostname) return response

    const previewResponse = new Response(response.body, response)
    previewResponse.headers.set("X-Robots-Tag", robotsHeader)
    return previewResponse
  }
} satisfies ExportedHandler<Env>
