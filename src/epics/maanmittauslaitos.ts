import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { selectedMaanmittauslaitosLayerChanged } from "../map"

export const selectVisibleMaanmittauslaitosLayerEpic: Epic<ActionTypes> = (
  action$
) =>
  action$.pipe(
    ofType(SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER),
    tap(() => selectedMaanmittauslaitosLayerChanged()),
    ignoreElements()
  )
