import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  MAANKOHOAMINEN_CHANGE_YEAR,
  SELECT_VISIBLE_MAANKOHOAMINEN_LAYER
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/types"

export const selectVisibleMaankohoaminenLayersEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(MAANKOHOAMINEN_CHANGE_YEAR, SELECT_VISIBLE_MAANKOHOAMINEN_LAYER),
    tap(() => selectedFeatureLayersChanged(LayerGroup.Maankohoaminen)),
    ignoreElements()
  )
