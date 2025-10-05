import { isModelFeature } from "./3dModels.types"
import { AhvenanmaaFeature, isAhvenanmaaFeature } from "./ahvenanmaa.types"
import {
  FeatureLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  ViabundusLayer
} from "./layers.types"
import {
  getMaalinnoitusFeatureLayerName,
  isMaalinnoitusFeature,
  MaalinnoitusFeature
} from "./maalinnoitusHelsinki.types"
import {
  isMaisemanMuistiFeature,
  MaisemanMuistiFeature
} from "./maisemanMuisti.types"
import {
  getMuseovirastoFeatureLayerName,
  isMuseovirastoFeature,
  MuseovirastoFeature
} from "./museovirasto.types"
import { isViabundusFeature, ViabundusFeature } from "./viabundus.types"

export type MapFeature = GeoJSONFeature | AhvenanmaaFeature

export type GeoJSONFeature =
  | MuseovirastoFeature
  | MaalinnoitusFeature
  | MaisemanMuistiFeature
  | ViabundusFeature

export const isGeoJSONFeature = (
  feature: MapFeature
): feature is GeoJSONFeature =>
  isMuseovirastoFeature(feature) ||
  isMaalinnoitusFeature(feature) ||
  isMaisemanMuistiFeature(feature) ||
  isViabundusFeature(feature)

export type EsriJSONFeature = AhvenanmaaFeature

export const isEsriJSONFeature = (
  feature: MapFeature
): feature is EsriJSONFeature => isAhvenanmaaFeature(feature)

export const getFeatureLayer = (feature: MapFeature): FeatureLayer => {
  if (isGeoJSONFeature(feature)) {
    if (isMuseovirastoFeature(feature)) {
      return getMuseovirastoFeatureLayerName(feature)
    }
    if (isMaalinnoitusFeature(feature)) {
      return getMaalinnoitusFeatureLayerName(feature)
    }
    if (isMaisemanMuistiFeature(feature)) {
      return MaisemanMuistiLayer.MaisemanMuisti
    }
    if (isModelFeature(feature)) {
      return ModelLayer.ModelLayer
    }
    if (isViabundusFeature(feature)) {
      return ViabundusLayer.Viabundus
    }
  }
  if (isAhvenanmaaFeature(feature)) {
    return feature.layerName
  }
  throw new Error(`Tuntematon feature ${JSON.stringify(feature)}`)
}
