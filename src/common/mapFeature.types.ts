import { AhvenanmaaFeature, isAhvenanmaaFeature } from "./ahvenanmaa.types"
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

export type MapFeature = GeoJSONFeature | AhvenanmaaFeature

export type GeoJSONFeature = MuseovirastoFeature | MaalinnoitusFeature

export const isGeoJSONFeature = (
  feature: MapFeature
): feature is GeoJSONFeature =>
  isMuseovirastoFeature(feature) || isMaalinnoitusFeature(feature)

export type EsriJSONFeature = AhvenanmaaFeature

export const isEsriJSONFeature = (
  feature: MapFeature
): feature is EsriJSONFeature => isAhvenanmaaFeature(feature)

export const getFeatureLayerName = (feature: MapFeature): FeatureLayer => {
  if (isGeoJSONFeature(feature)) {
    if (isMuseovirastoFeature(feature)) {
      return getMuseovirastoFeatureLayerName(feature)
    }
    if (isMaalinnoitusFeature(feature)) {
      return getMaalinnoitusFeatureLayerName(feature)
    }
  }
  if (isAhvenanmaaFeature(feature)) {
    return feature.layerName
  }
  throw new Error(`Tuntematon feature ${JSON.stringify(feature)}`)
}
