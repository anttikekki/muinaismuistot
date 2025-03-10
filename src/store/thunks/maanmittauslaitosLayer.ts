import { MaanmittauslaitosLayer } from "../../common/layers.types"
import { selectedMaanmittauslaitosLayerChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleMaanmittauslaitosLayerThunk =
  (layer: MaanmittauslaitosLayer): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER,
      layer
    })
    selectedMaanmittauslaitosLayerChanged()
    updateSettingsToURL(initialSettings, getState())
  }
