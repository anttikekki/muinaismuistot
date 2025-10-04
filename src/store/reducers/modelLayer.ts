import { Settings } from "../storeTypes"

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
