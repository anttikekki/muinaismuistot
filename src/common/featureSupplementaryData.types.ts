import { ModelFeature } from "./3dModels.types"
import { MaisemanMuistiFeature } from "./maisemanMuisti.types"

/**
 * 3D models and Maiseman muisti supplemetary data for search/identify feature
 */
export interface FeatureSupplementaryData {
  models: ModelFeature[]
  maisemanMuisti: MaisemanMuistiFeature[]
}
