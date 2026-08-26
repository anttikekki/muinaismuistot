const ALLOWED_METHODS = "GET, HEAD, POST, OPTIONS"
const EXPOSED_HEADERS = "Accept-Ranges, Content-Length, Content-Range, ETag"

export function corsHeaders(): Headers {
  return new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": "Range, If-None-Match, Content-Type",
    "Access-Control-Expose-Headers": EXPOSED_HEADERS,
    "Access-Control-Max-Age": "86400",
  })
}

export function errorResponse(message: string, status: number, size?: number): Response {
  const headers = corsHeaders()
  headers.set("Content-Type", "text/plain; charset=utf-8")
  if (status === 416 && size !== undefined) headers.set("Content-Range", `bytes */${size}`)
  return new Response(message, { status, headers })
}

export function methodNotAllowed(allow: string): Response {
  const response = errorResponse("Method not allowed", 405)
  response.headers.set("Allow", allow)
  return response
}

export function preflightResponse(): Response {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
