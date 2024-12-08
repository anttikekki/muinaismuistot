import { LayerGroup, ModelLayer } from "../../common/layers.types"
import { selectedFeatureLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleModelsLayerThunk =
  (layers: Array<ModelLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_MODELS_LAYERS,
      layers
    })
    selectedFeatureLayersChanged(LayerGroup.Models)
    updateSettingsToURL(initialSettings, getState())
  }
