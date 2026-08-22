import layerMapping from "../../layer-mapping.json"

const ARCHIVE_PATH = "/pmtiles/museovirasto-poc.pmtiles"
const ARCHIVE_KEY = "museovirasto-poc.pmtiles"
const ALLOWED_METHODS = "GET, HEAD, OPTIONS"
const EXPOSED_HEADERS = "Accept-Ranges, Content-Length, Content-Range, ETag"

type ByteRange = { offset: number; length: number }

function corsHeaders(): Headers {
  return new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": "Range, If-None-Match",
    "Access-Control-Expose-Headers": EXPOSED_HEADERS,
    "Access-Control-Max-Age": "86400",
  })
}

function errorResponse(message: string, status: number, size?: number): Response {
  const headers = corsHeaders()
  headers.set("Content-Type", "text/plain; charset=utf-8")
  if (status === 416 && size !== undefined) {
    headers.set("Content-Range", `bytes */${size}`)
  }
  return new Response(message, { status, headers })
}

export function parseSingleRange(value: string, size: number): ByteRange | null {
  if (!Number.isSafeInteger(size) || size <= 0 || value.includes(",")) return null

  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim())
  if (!match || (!match[1] && !match[2])) return null

  if (!match[1]) {
    const suffixLength = Number(match[2])
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null
    const length = Math.min(suffixLength, size)
    return { offset: size - length, length }
  }

  const offset = Number(match[1])
  if (!Number.isSafeInteger(offset) || offset >= size) return null

  const requestedEnd = match[2] ? Number(match[2]) : size - 1
  if (!Number.isSafeInteger(requestedEnd) || requestedEnd < offset) return null
  const end = Math.min(requestedEnd, size - 1)
  return { offset, length: end - offset + 1 }
}

async function serveArchive(request: Request, env: Env): Promise<Response> {
  const metadata = await env.MAP_DATA.head(ARCHIVE_KEY)
  if (!metadata) return errorResponse("PMTiles archive not found", 404)

  const baseHeaders = corsHeaders()
  baseHeaders.set("Accept-Ranges", "bytes")
  baseHeaders.set("Content-Type", "application/vnd.pmtiles")
  baseHeaders.set("ETag", metadata.httpEtag)
  baseHeaders.set("Cache-Control", "public, max-age=3600")

  if (request.method === "HEAD") {
    baseHeaders.set("Content-Length", String(metadata.size))
    return new Response(null, { status: 200, headers: baseHeaders })
  }

  const rangeHeader = request.headers.get("Range")
  if (!rangeHeader) return errorResponse("A single byte Range is required", 400)

  const range = parseSingleRange(rangeHeader, metadata.size)
  if (!range) return errorResponse("Range not satisfiable", 416, metadata.size)

  const object = await env.MAP_DATA.get(ARCHIVE_KEY, { range })
  if (!object || !object.body) return errorResponse("PMTiles archive not found", 404)

  const end = range.offset + range.length - 1
  baseHeaders.set("Content-Range", `bytes ${range.offset}-${end}/${metadata.size}`)
  baseHeaders.set("Content-Length", String(range.length))
  return new Response(object.body, { status: 206, headers: baseHeaders })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }
    if (!ALLOWED_METHODS.split(", ").includes(request.method)) {
      const response = errorResponse("Method not allowed", 405)
      response.headers.set("Allow", ALLOWED_METHODS)
      return response
    }
    if (url.pathname === ARCHIVE_PATH) return serveArchive(request, env)
    if (url.pathname === "/api/layers") {
      return Response.json(layerMapping.logicalLayers, {
        headers: { ...Object.fromEntries(corsHeaders()), "Cache-Control": "no-store" },
      })
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
