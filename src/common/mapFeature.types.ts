import { AhvenanmaaFeature } from "./ahvenanmaa.types"
import { MaalinnoitusFeature } from "./maalinnoitusHelsinki.types"
import { MaisemanMuistiFeature } from "./maisemanMuisti.types"
import { MuseovirastoFeature } from "./museovirasto.types"
import { ViabundusFeature } from "./viabundus.types"

export type MapFeature = GeoJSONFeature | AhvenanmaaFeature

export type GeoJSONFeature =
  | MuseovirastoFeature
  | MaalinnoitusFeature
  | MaisemanMuistiFeature
  | ViabundusFeature

export const isGeoJSONFeature = (
  feature: MapFeature
): feature is GeoJSONFeature => "properties" in feature

export type EsriJSONFeature = AhvenanmaaFeature

export const isEsriJSONFeature = (
  feature: MapFeature
): feature is EsriJSONFeature => "attributes" in feature
