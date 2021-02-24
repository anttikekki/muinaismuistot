import { Epic, ofType } from "redux-observable"
import {
  ActionTypes,
  FETCH_DATA_LATESTS_UPDATE_DATES
} from "../store/actionTypes"
import { mergeMap } from "rxjs/operators"
import { fetchDataLatestUpdateDatesFromMapLayers } from "../map"
import { fetchDataLatestUpdateDatesComplete } from "../store/actionCreators"

export const dataUpdateDatesEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    ofType(FETCH_DATA_LATESTS_UPDATE_DATES),
    mergeMap(async () => {
      const result = await fetchDataLatestUpdateDatesFromMapLayers()
      return fetchDataLatestUpdateDatesComplete(result)
    })
  )
