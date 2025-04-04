import { MaisemanMuistiLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateMaisemanMuistiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MaisemanMuistiLayer>
): Settings => {
  return {
    ...settings,
    maisemanMuisti: {
      ...settings.maisemanMuisti,
      selectedLayers
    }
  }
}

export const updateMaisemanMuistiLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    maisemanMuisti: {
      ...settings.maisemanMuisti,
      enabled
    }
  }
}
