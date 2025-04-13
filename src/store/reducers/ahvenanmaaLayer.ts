import { AhvenanmaaLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateAhvenanmaaSelectedLayers = (
  settings: Settings,
  selectedLayers: AhvenanmaaLayer[]
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      selectedLayers
    }
  }
}

export const updateAhvenanmaaLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      opacity
    }
  }
}

export const updateAhvenanmaaLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      enabled
    }
  }
}
