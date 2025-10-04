import { Settings } from "../storeTypes"

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
