import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  CHANGE_GTK_LAYER_OPACITY,
  SELECT_VISIBLE_GTK_LAYERS
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { gtkLayerOpacityChanged, selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/types"

export const selectVisibleGtkLayersEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_GTK_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.GTK)),
    ignoreElements()
  )

export const changeGtkLayerOpacityEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(CHANGE_GTK_LAYER_OPACITY),
    tap(() => gtkLayerOpacityChanged()),
    ignoreElements()
  )
