import { MaanmittauslaitosVanhatKartatLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateMaanmittauslaitosVanhatKartatSelectedLayer = (
  settings: Settings,
  selectedLayers: Array<MaanmittauslaitosVanhatKartatLayer>
): Settings => {
  return {
    ...settings,
    maanmittauslaitosVanhatKartat: {
      ...settings.maanmittauslaitosVanhatKartat,
      selectedLayers
    }
  }
}

export const updateMaanmittauslaitosVanhatKartatLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    maanmittauslaitosVanhatKartat: {
      ...settings.maanmittauslaitosVanhatKartat,
      opacity
    }
  }
}

export const updateMaanmittauslaitosVanhatKartatLayerEnabled = (
  settings: Settings,
  enabled: boolean
): Settings => {
  return {
    ...settings,
    maanmittauslaitosVanhatKartat: {
      ...settings.maanmittauslaitosVanhatKartat,
      enabled
    }
  }
}
