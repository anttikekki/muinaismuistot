import { MaanmittauslaitosLayer } from "../../common/layers.types"
import { Settings } from "../storeTypes"

export const updateMaanmittauslaitosSelectedLayer = (
  settings: Settings,
  selectedLayer: MaanmittauslaitosLayer
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      selectedLayer
    }
  }
}
