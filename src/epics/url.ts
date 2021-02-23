import { Epic } from "redux-observable"
import {
  ActionTypes,
  CHANGE_GTK_LAYER_OPACITY,
  CHANGE_LANGUAGE,
  SELECT_VISIBLE_AHVENANMAA_LAYERS,
  SELECT_VISIBLE_GTK_LAYERS,
  SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER,
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS,
  SELECT_VISIBLE_MODELS_LAYERS,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
  SELECT_VISIBLE_MUSEOVIRASTO_LAYERS
} from "../store/actionTypes"
import { filter, tap, ignoreElements, withLatestFrom } from "rxjs/operators"
import { updateSettingsToURL } from "../url"
import { initialSettings } from "../store/initialSettings"
import { Settings } from "../store/storeTypes"

const actionThatUpdateUrlParams: ReadonlyArray<string> = [
  SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER,
  SELECT_VISIBLE_GTK_LAYERS,
  CHANGE_GTK_LAYER_OPACITY,
  SELECT_VISIBLE_MUSEOVIRASTO_LAYERS,
  SELECT_VISIBLE_AHVENANMAA_LAYERS,
  SELECT_VISIBLE_MODELS_LAYERS,
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
  CHANGE_LANGUAGE
]

export const updateUrlParametersEpic: Epic<
  ActionTypes,
  ActionTypes,
  Settings
> = (action$, state$) =>
  action$.pipe(
    filter((action) => actionThatUpdateUrlParams.includes(action.type)),
    withLatestFrom(state$),
    tap(([_, settings]) => updateSettingsToURL(initialSettings, settings)),
    ignoreElements()
  )
