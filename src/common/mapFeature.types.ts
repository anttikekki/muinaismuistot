import {
  AhvenanmaaArcgisFeature,
  isAhvenanmaaArcgisFeature
} from "./ahvenanmaa.types"
import { FeatureLayer } from "./layers.types"
import {
  MaalinnoitusFeature,
  getMaalinnoitusFeatureLayerName,
  isMaalinnoitusFeature
} from "./maalinnoitusHelsinki.types"
import {
  MuseovirastoFeature,
  getMuseovirastoFeatureLayerName,
  isMuseovirastoFeature
} from "./museovirasto.types"

export type MapFeature =
  | MuseovirastoFeature
  | AhvenanmaaArcgisFeature
  | MaalinnoitusFeature

export const isGeoJSONFeature = (
  feature: MapFeature
): feature is MuseovirastoFeature | MaalinnoitusFeature =>
  isMuseovirastoFeature(feature) || isMaalinnoitusFeature(feature)

export const isArcGisFeature = (
  feature: MapFeature
): feature is AhvenanmaaArcgisFeature => isAhvenanmaaArcgisFeature(feature)

export const getFeatureLayerName = (feature: MapFeature): FeatureLayer => {
  if (isGeoJSONFeature(feature)) {
    if (isMuseovirastoFeature(feature)) {
      return getMuseovirastoFeatureLayerName(feature)
    }
    if (isMaalinnoitusFeature(feature)) {
      return getMaalinnoitusFeatureLayerName(feature)
    }
  }
  if (isAhvenanmaaArcgisFeature(feature)) {
    return feature.layerName
  }
  throw new Error(`Tuntematon feature ${JSON.stringify(feature)}`)
}
