import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  ChangeLayerOpacityAction,
  CHANGE_LAYER_OPACITY
} from "../store/actionTypes"
import { filter, tap, ignoreElements } from "rxjs/operators"
import { layerOpacityChanged } from "../map"

export const changeLayerOpacityEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    filter(
      (action): action is ChangeLayerOpacityAction =>
        action.type === CHANGE_LAYER_OPACITY
    ),
    tap((action) => layerOpacityChanged(action.layerGroup)),
    ignoreElements()
  )
