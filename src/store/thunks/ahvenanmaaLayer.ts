import { AhvenanmaaLayer, LayerGroup } from "../../common/layers.types"
import { selectedFeatureLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleAhvenanmaaLayerThunk =
  (layers: Array<AhvenanmaaLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_AHVENANMAA_LAYERS,
      layers
    })
    selectedFeatureLayersChanged(LayerGroup.Ahvenanmaa)
    updateSettingsToURL(initialSettings, getState())
  }
