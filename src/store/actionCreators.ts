import { ThunkAction, ThunkDispatch } from "redux-thunk"
import {
  fetchDataLatestUpdateDatesFromMapLayers,
  searchFeaturesFromMapLayers
} from "../map/MuinaismuistotMap"
import {
  ActionTypes,
  CenterToCurrentPosition,
  CENTER_TO_CURRENT_POSITION,
  FetchDataLatestUpdateDatesComplete,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  SearchFeaturesComplete,
  SEARCH_FEATURES_COMPLETE,
  ZoomInAction,
  ZoomOutAction,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"
import { SelectedFeaturesOnMap, Settings } from "./storeTypes"

export const zoomIn = (): ZoomInAction => {
  return {
    type: ZOOM_IN
  }
}

export const zoomOut = (): ZoomOutAction => {
  return {
    type: ZOOM_OUT
  }
}

export const centerToCurrentPosition = (): CenterToCurrentPosition => {
  return {
    type: CENTER_TO_CURRENT_POSITION
  }
}

export const fetchDataLatestUpdateDates = (): ThunkAction<
  Promise<FetchDataLatestUpdateDatesComplete>,
  Settings,
  {},
  ActionTypes
> => {
  return async (dispatch: ThunkDispatch<Settings, {}, ActionTypes>) => {
    const payload = await fetchDataLatestUpdateDatesFromMapLayers()
    return dispatch({
      type: FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
      payload
    })
  }
}

export const searchFeatures = (
  searchText: string
): ThunkAction<Promise<SearchFeaturesComplete>, Settings, {}, ActionTypes> => {
  return async (dispatch: ThunkDispatch<Settings, {}, ActionTypes>) => {
    const searchResultFeatures = await searchFeaturesFromMapLayers(searchText)
    return dispatch({
      type: SEARCH_FEATURES_COMPLETE,
      searchResultFeatures
    })
  }
}
