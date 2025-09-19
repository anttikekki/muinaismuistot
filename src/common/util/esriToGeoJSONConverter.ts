import { Feature } from "geojson"
import EsriJSONFormat from "ol/format/EsriJSON"
import GeoJSONFormat from "ol/format/GeoJSON"

const esriFormat = new EsriJSONFormat()
const geojsonFormat = new GeoJSONFormat()

export const convertFeatureFromEsriJSONtoGeoJSON = (
  feature: unknown
): Feature => {
  const geojson = geojsonFormat.writeFeaturesObject(
    esriFormat.readFeatures(feature)
  )
  return geojson.features[0]
}
