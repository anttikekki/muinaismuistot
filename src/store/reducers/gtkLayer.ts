import { GtkLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateGtkSelectedLayers = (
  settings: Settings,
  selectedLayers: GtkLayer[]
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      selectedLayers
    }
  }
}

export const updateGtkLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      opacity
    }
  }
}

export const updateGtkLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      enabled
    }
  }
}
