import { GtkLayer, LayerGroup } from "../../common/layers.types"
import { layerGroupSelectedLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleGtkLayersThunk =
  (layers: Array<GtkLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_GTK_LAYERS,
      layers
    })
    layerGroupSelectedLayersChanged(LayerGroup.GTK)
    updateSettingsToURL(initialSettings, getState())
  }
