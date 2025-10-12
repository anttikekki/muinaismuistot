import { Position } from "geojson"
import queryString from "query-string"
import { LinkedFeature } from "../../store/storeTypes"

export const parseURLParams = () => {
  return queryString.parse(window.location.hash, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: "comma"
  })
}

export const stringifyURLParamsToHash = (
  params: queryString.StringifiableRecord
): string =>
  `#${queryString.stringify(params, {
    arrayFormat: "comma"
  })}`

export const createLocationHash = (
  coordinates: [number, number] | Position
) => {
  return stringifyURLParamsToHash({
    ...parseURLParams(), // Keep old params
    x: coordinates[0],
    y: coordinates[1]
  })
}

export const createLinkedFeatureUrl = (linkedFeature: LinkedFeature) => {
  return stringifyURLParamsToHash({
    ...parseURLParams(), // Keep old params
    x: linkedFeature.coordinates[0],
    y: linkedFeature.coordinates[1],
    linkedFeatureLayer: linkedFeature.layer,
    linkedFeatureId: linkedFeature.id,
    linkedFeatureName: linkedFeature.name
  })
}
