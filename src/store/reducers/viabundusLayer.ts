import { Settings } from "../storeTypes"

export const updateViabundusLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    viabundus: {
      ...settings.viabundus,
      opacity
    }
  }
}

export const updateViabundusLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    viabundus: {
      ...settings.viabundus,
      enabled
    }
  }
}

export const updateViabundusYear = (
  settings: Settings,
  selectedYear: number
): Settings => {
  return {
    ...settings,
    viabundus: {
      ...settings.viabundus,
      selectedYear
    }
  }
}
