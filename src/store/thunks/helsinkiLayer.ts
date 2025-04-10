import { HelsinkiLayer, LayerGroup } from "../../common/layers.types"
import { layerGroupSelectedLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleHelsinkiLayersThunk =
  (layers: Array<HelsinkiLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
      layerGroup: LayerGroup.Helsinki,
      layers
    })
    layerGroupSelectedLayersChanged(LayerGroup.Helsinki)
    updateSettingsToURL(initialSettings, getState())
  }
