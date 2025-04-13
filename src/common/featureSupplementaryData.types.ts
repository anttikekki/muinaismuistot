import { ModelFeatureProperties } from "./3dModels.types"
import { GeoJSONFeature } from "./geojson.types"
import { MaisemanMuistiFeatureProperties } from "./maisemanMuisti.types"

/**
 * 3D models and Maiseman muisti supplemetary data for Museovirasto search/identify feature
 */
export interface FeatureSupplementaryData {
  models: GeoJSONFeature<ModelFeatureProperties>[]
  maisemanMuisti: GeoJSONFeature<MaisemanMuistiFeatureProperties>[]
}
