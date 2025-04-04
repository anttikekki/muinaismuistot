import { LayerGroup, MaisemanMuistiLayer } from "../../common/layers.types"
import { layerGroupSelectedLayersChanged } from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleMaisemanMuistiLayerThunk =
  (layers: Array<MaisemanMuistiLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS,
      layers
    })
    layerGroupSelectedLayersChanged(LayerGroup.MaisemanMuisti)
    updateSettingsToURL(initialSettings, getState())
  }
