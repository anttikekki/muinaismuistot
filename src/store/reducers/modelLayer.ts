import { ModelLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateModelSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<ModelLayer>
): Settings => {
  return {
    ...settings,
    models: {
      ...settings.models,
      selectedLayers
    }
  }
}

export const updateModelLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    models: {
      ...settings.models,
      enabled
    }
  }
}
