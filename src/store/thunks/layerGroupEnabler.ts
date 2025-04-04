import { LayerGroup } from "../../common/layers.types"
import { layerVisibilityChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const enableLayerGroupThunk =
  (enabled: boolean, layerGroup: LayerGroup): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.ENABLE_LAYER_GROUP,
      enabled,
      layerGroup
    })
    layerVisibilityChanged(layerGroup)
    updateSettingsToURL(initialSettings, getState())
  }
