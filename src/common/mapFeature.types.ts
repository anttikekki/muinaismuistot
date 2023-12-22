import {
  AhvenanmaaArcgisFeature,
  isAhvenanmaaArcgisFeature
} from "./ahvenanmaa.types"
import {
  MaalinnoitusWmsFeature,
  getMaalinnoitusWmsFeatureLayerName,
  isMaalinnoitusWmsFeature
} from "./maalinnoitusHelsinki.types"
import {
  MuseovirastoWmsFeature,
  getMuseovirastoWmsFeatureLayerName,
  isMuseovirastoWmsFeature
} from "./museovirasto.types"
import { FeatureLayer } from "./types"

export type MapFeature =
  | MuseovirastoWmsFeature
  | AhvenanmaaArcgisFeature
  | MaalinnoitusWmsFeature

export const isWmsFeature = (
  feature: MapFeature
): feature is MuseovirastoWmsFeature | MaalinnoitusWmsFeature =>
  isMuseovirastoWmsFeature(feature) || isMaalinnoitusWmsFeature(feature)

export const isArcGisFeature = (
  feature: MapFeature
): feature is AhvenanmaaArcgisFeature => isAhvenanmaaArcgisFeature(feature)

export const getFeatureLayerName = (feature: MapFeature): FeatureLayer => {
  if (isWmsFeature(feature)) {
    if (isMuseovirastoWmsFeature(feature)) {
      return getMuseovirastoWmsFeatureLayerName(feature)
    }
    if (isMaalinnoitusWmsFeature(feature)) {
      return getMaalinnoitusWmsFeatureLayerName(feature)
    }
  }
  if (isAhvenanmaaArcgisFeature(feature)) {
    return feature.layerName
  }
  throw new Error(`Tuntematon feature ${feature}`)
}
