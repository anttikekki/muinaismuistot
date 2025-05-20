import { MaannousuInfoLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateMaannousuInfoSelectedLayer = (
  settings: Settings,
  selectedLayer: MaannousuInfoLayer
): Settings => {
  return {
    ...settings,
    maannousuInfo: {
      ...settings.maannousuInfo,
      selectedLayer
    }
  }
}

export const updateMaannousuInfoLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    maannousuInfo: {
      ...settings.maannousuInfo,
      opacity
    }
  }
}

export const updateMaannousuInfoLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    maannousuInfo: {
      ...settings.maannousuInfo,
      enabled
    }
  }
}
