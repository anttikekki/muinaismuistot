import { parse, stringify, StringifiableRecord } from "query-string"

export const parseURLParams = () => {
  const hash = window.location.hash.replace(";", "&") // Old format used ";" as separator
  return parse(hash, {
    parseNumbers: true,
    arrayFormat: "comma"
  })
}

export const stringifyURLParamsToHash = (params: StringifiableRecord): string =>
  `#${stringify(params, {
    arrayFormat: "comma"
  })}`

export const createLocationHash = (coordinates: [number, number]) => {
  return stringifyURLParamsToHash({
    ...parseURLParams(), // Keep old params
    x: coordinates[0],
    y: coordinates[1]
  })
}

export const parseCoordinatesFromURL = (): [number, number] | null => {
  const urlParams = parseURLParams()
  const x = parseFloat(String(urlParams.x))
  const y = parseFloat(String(urlParams.y))

  if (!isNaN(x) && !isNaN(y)) {
    return [x, y]
  }
  return null
}
