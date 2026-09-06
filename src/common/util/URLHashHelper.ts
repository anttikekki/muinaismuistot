import { Position } from "geojson"
import queryString from "query-string"
import { LinkedFeature } from "../../store/storeTypes"

const parseOptions = {
  arrayFormat: "comma",
  // Conversion belongs to the URL schema. Text can contain numbers or commas.
  types: {
    linkedFeatureId: "string",
    linkedFeatureName: "string",
    museovirastoApiBase: "string"
  }
} as const

export const parseURLParams = () => ({
  ...queryString.parse(window.location.search, parseOptions),
  ...queryString.parse(window.location.hash, parseOptions)
})

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
