import {
  LayerGroup,
  MaanmittauslaitosVanhatKartatLayer
} from "../../common/layers.types"
import { layerGroupSelectedLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleMaanmittauslaitosVanhatKartatLayerThunk =
  (layers: MaanmittauslaitosVanhatKartatLayer[]): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
      layerGroup: LayerGroup.MaanmittauslaitosVanhatKartat,
      layers
    })

    layerGroupSelectedLayersChanged(LayerGroup.MaanmittauslaitosVanhatKartat)
    updateSettingsToURL(initialSettings, getState())
  }
