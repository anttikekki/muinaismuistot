import { LayerGroup } from "../../common/layers.types"
import { layerOpacityChanged } from "../../map"
import { ActionTypeEnum } from "../../store/actionTypes"
import { updateSettingsToURL } from "../../url"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const changeLayerOpacityThunk =
  (opacity: number, layerGroup: LayerGroup): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.CHANGE_LAYER_OPACITY,
      opacity,
      layerGroup
    })
    layerOpacityChanged(layerGroup)
    updateSettingsToURL(initialSettings, getState())
  }
