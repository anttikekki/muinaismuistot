import { Feature } from "geojson"
import EsriJSONFormat from "ol/format/EsriJSON"
import GeoJSONFormat from "ol/format/GeoJSON"
import { EsriJSONFeature } from "../mapFeature.types"

const esriFormat = new EsriJSONFormat()
const geojsonFormat = new GeoJSONFormat()

export const convertFeatureFromEsriJSONtoGeoJSON = (
  feature: EsriJSONFeature
): Feature => {
  const geojson = geojsonFormat.writeFeaturesObject(
    esriFormat.readFeatures(feature)
  )
  return geojson.features[0]
}
