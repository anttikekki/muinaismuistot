import { Epic, ofType } from "redux-observable"
import { ActionTypes, SELECT_VISIBLE_GTK_LAYERS } from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/layers.types"

export const selectVisibleGtkLayersEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_GTK_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.GTK)),
    ignoreElements()
  )
