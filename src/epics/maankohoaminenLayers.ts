import { Epic, ofType } from "redux-observable"
import { ActionTypes, MAANKOHOAMINEN_CHANGE_YEAR } from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedFeatureLayersChanged } from "../map"
import { LayerGroup } from "../common/types"

export const selectVisibleMaankohoaminenLayersEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(MAANKOHOAMINEN_CHANGE_YEAR),
    tap(() => selectedFeatureLayersChanged(LayerGroup.Maankohoaminen)),
    ignoreElements()
  )
