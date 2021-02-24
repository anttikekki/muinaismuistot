import { Epic, ofType } from "redux-observable"
import { ActionTypes, ZOOM_IN, ZOOM_OUT } from "../store/actionTypes"
import { tap, ignoreElements } from "rxjs/operators"
import { zoomIn, zoomOut } from "../map"

export const zoomInEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(ZOOM_IN),
    tap(() => zoomIn()),
    ignoreElements()
  )

export const zoomOutEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(ZOOM_OUT),
    tap(() => zoomOut()),
    ignoreElements()
  )
