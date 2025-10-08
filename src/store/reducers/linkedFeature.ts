import { Settings } from "../storeTypes"

export const updateLinkedFeatureCoordinates = (
  settings: Settings,
  coordinates: [number, number]
): Settings => {
  return {
    ...settings,
    linkedFeature: {
      coordinates
    }
  }
}
