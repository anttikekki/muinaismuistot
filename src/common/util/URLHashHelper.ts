import { parse, stringify } from "query-string"

export const createLocationHash = (coordinates: [number, number]) => {
  return `#${stringify({
    ...parse(window.location.hash), // Keep old params
    x: coordinates[0],
    y: coordinates[1]
  })}`
}

export const parseCoordinatesFromURL = (): [number, number] | null => {
  const hash = window.location.hash.replace(";", "&") // Old format used ";" as separator
  const urlParams = parse(hash)
  const x = parseFloat(String(urlParams.x))
  const y = parseFloat(String(urlParams.y))

  if (!isNaN(x) && !isNaN(y)) {
    return [x, y]
  }
  return null
}
