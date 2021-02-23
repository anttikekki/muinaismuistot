import { Epic, ofType } from "redux-observable"
import { ActionTypes, ZOOM_IN, ZOOM_OUT } from "../store/actionTypes"
import { tap } from "rxjs/operators"
import { zoomIn, zoomOut } from "../map/MuinaismuistotMap"

export const zoomInEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(ZOOM_IN),
    tap(() => zoomIn())
  )

export const zoomOutEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(ZOOM_OUT),
    tap(() => zoomOut())
  )
