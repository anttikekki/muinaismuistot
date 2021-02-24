import { Epic } from "redux-observable"
import {
  ActionTypes,
  SearchFeaturesAction,
  SEARCH_FEATURES
} from "../store/actionTypes"
import { mergeMap, filter } from "rxjs/operators"
import { searchFeaturesFromMapLayers } from "../map"
import { searchFeaturesComplete } from "../store/actionCreators"

export const searchFeaturesEpic: Epic<ActionTypes> = (action$) =>
  action$.pipe(
    filter(
      (action): action is SearchFeaturesAction =>
        action.type === SEARCH_FEATURES
    ),
    mergeMap(async (action) => {
      const result = await searchFeaturesFromMapLayers(action.searchText)
      return searchFeaturesComplete(result)
    })
  )
