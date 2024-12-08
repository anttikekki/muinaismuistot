import { LayerGroup, MuseovirastoLayer } from "../../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../../common/museovirasto.types"
import {
  selectedFeatureLayersChanged,
  selectedMuinaisjaannosDatingsChanged,
  selectedMuinaisjaannosTypesChanged
} from "../../map"
import { updateSettingsToURL } from "../../url"
import { ActionTypeEnum } from "../actionTypes"
import { initialSettings } from "../initialSettings"
import { AppThunk } from "../storeTypes"

export const selectVisibleMuseovirastoLayerThunk =
  (layers: Array<MuseovirastoLayer>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_MUSEOVIRASTO_LAYERS,
      layers
    })
    selectedFeatureLayersChanged(LayerGroup.Museovirasto)
    updateSettingsToURL(initialSettings, getState())
  }

export const selectVisibleMuinaisjäännösTypeThunk =
  (types: Array<MuinaisjaannosTyyppi>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
      types
    })
    selectedMuinaisjaannosTypesChanged()
    updateSettingsToURL(initialSettings, getState())
  }

export const selectVisibleMuinaisjäännösDatingThunk =
  (datings: Array<MuinaisjaannosAjoitus>): AppThunk =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
      datings
    })
    selectedMuinaisjaannosDatingsChanged()
    updateSettingsToURL(initialSettings, getState())
  }
