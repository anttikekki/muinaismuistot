import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  SELECT_VISIBLE_AHVENANMAA_LAYERS
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/layers.types"

export const selectVisibleAhvenanmaaLayerEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_AHVENANMAA_LAYERS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.Ahvenanmaa)),
    ignoreElements()
  )
