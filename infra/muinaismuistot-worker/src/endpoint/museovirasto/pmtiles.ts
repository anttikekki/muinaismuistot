import rangeParser from "range-parser"
import { corsHeaders, errorResponse, methodNotAllowed, preflightResponse } from "./responses"

const ARCHIVE_KEY = "current.pmtiles"
type ByteRange = { offset: number; length: number }

export function parseSingleRange(value: string, size: number): ByteRange | null {
  const ranges = rangeParser(size, value)
  if (ranges === -1 || ranges === -2 || ranges.type !== "bytes" || ranges.length !== 1) return null
  const [{ start, end }] = ranges
  return { offset: start, length: end - start + 1 }
}

export async function handlePmtiles(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") return preflightResponse()
  if (request.method !== "GET") return methodNotAllowed("GET, OPTIONS")
  const rangeHeader = request.headers.get("Range")
  if (!rangeHeader) return errorResponse("A single byte Range is required", 400)

  let object: R2ObjectBody | null
  try {
    object = await env.MAP_DATA.get(ARCHIVE_KEY, { range: request.headers })
  } catch {
    return errorResponse("Range not satisfiable", 416)
  }
  if (!object?.body) return errorResponse("PMTiles archive not found", 404)

  const range = parseSingleRange(rangeHeader, object.size)
  if (!range) {
    await object.body.cancel()
    return errorResponse("Range not satisfiable", 416, object.size)
  }

  const end = range.offset + range.length - 1
  const headers = corsHeaders()
  headers.set("Accept-Ranges", "bytes")
  headers.set("Content-Type", "application/vnd.pmtiles")
  headers.set("ETag", object.httpEtag)
  headers.set("Cache-Control", "public, max-age=300")
  headers.set("Content-Range", `bytes ${range.offset}-${end}/${object.size}`)
  headers.set("Content-Length", String(range.length))
  return new Response(object.body, { status: 206, headers })
}
