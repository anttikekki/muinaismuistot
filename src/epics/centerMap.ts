import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  CENTER_MAP_TO_CURRENT_POSITION
} from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { centerToCurrentPositions } from "../map"

export const centerMapEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(CENTER_MAP_TO_CURRENT_POSITION),
    tap(() => centerToCurrentPositions()),
    ignoreElements()
  )
