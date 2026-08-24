const parameters = new URLSearchParams(window.location.search)

export const museovirastoVectorTilesEnabled =
  parameters.get("museovirastoVectorTiles") === "1"

export const museovirastoApiBase =
  parameters.get("museovirastoApiBase") ?? window.location.origin
