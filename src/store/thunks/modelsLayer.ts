import { LayerGroup, ModelLayer } from "../../common/layers.types"
import { layerGroupSelectedLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleModelsLayerThunk =
  (layers: Array<ModelLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
      layerGroup: LayerGroup.Models,
      layers
    })
    layerGroupSelectedLayersChanged(LayerGroup.Models)
    updateSettingsToURL(initialSettings, getState())
  }
