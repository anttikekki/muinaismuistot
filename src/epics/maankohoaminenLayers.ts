import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  MAANKOHOAMINEN_ADD_YEARS,
  SELECT_VISIBLE_HELSINKI_LAYERS
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/types"

export const selectVisibleHelsinkiLayersEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(MAANKOHOAMINEN_ADD_YEARS),
    tap(() => selectedFeatureLayersChanged(LayerGroup.Helsinki)),
    ignoreElements()
  )
