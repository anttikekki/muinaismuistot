import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

const ARCHIVE_KEY = "current.pmtiles"
type ByteRange = { offset: number; length: number }

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

export async function handlePmtiles(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (!["GET", "HEAD"].includes(request.method)) return methodNotAllowed("GET, HEAD, OPTIONS")

  const metadata = await env.MAP_DATA.head(ARCHIVE_KEY)
  if (!metadata) return errorResponse("PMTiles archive not found", 404)
  const headers = corsHeaders()
  headers.set("Accept-Ranges", "bytes")
  headers.set("Content-Type", "application/vnd.pmtiles")
  headers.set("ETag", metadata.httpEtag)
  headers.set("Cache-Control", "public, max-age=300")

  if (request.method === "HEAD") {
    headers.set("Content-Length", String(metadata.size))
    return new Response(null, { status: 200, headers })
  }
  const rangeHeader = request.headers.get("Range")
  if (!rangeHeader) return errorResponse("A single byte Range is required", 400)
  const range = parseSingleRange(rangeHeader, metadata.size)
  if (!range) return errorResponse("Range not satisfiable", 416, metadata.size)
  const object = await env.MAP_DATA.get(ARCHIVE_KEY, { range })
  if (!object?.body) return errorResponse("PMTiles archive not found", 404)

  const end = range.offset + range.length - 1
  headers.set("Content-Range", `bytes ${range.offset}-${end}/${metadata.size}`)
  headers.set("Content-Length", String(range.length))
  return new Response(object.body, { status: 206, headers })
}
