import { LinkedFeature, Settings } from "../storeTypes"

export const updateLinkedFeature = (
  settings: Settings,
  linkedFeature: LinkedFeature | undefined
): Settings => {
  return {
    ...settings,
    linkedFeature
  }
}
