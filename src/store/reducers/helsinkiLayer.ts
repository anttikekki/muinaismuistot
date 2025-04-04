import { HelsinkiLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateHelsinkiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<HelsinkiLayer>
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      selectedLayers
    }
  }
}

export const updateHelsinkiLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      opacity
    }
  }
}

export const updateHelsinkiLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      enabled
    }
  }
}
