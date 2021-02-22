import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { ArgisFeature, DataLatestUpdateDates } from "../common/types"
import { searchFeaturesFromMapLayers } from "../map/MuinaismuistotMap"
import {
  ActionTypes,
  CenterToCurrentPosition,
  CENTER_TO_CURRENT_POSITION,
  FeaturesSelectedOnMap,
  FEATURES_SELECTED_ON_MAP,
  FetchDataLatestUpdateDates,
  FetchDataLatestUpdateDatesComplete,
  FETCH_DATA_LATESTS_UPDATE_DATES,
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

export const featuresSelectedOnMap = (
  payload: SelectedFeaturesOnMap
): FeaturesSelectedOnMap => {
  return {
    type: FEATURES_SELECTED_ON_MAP,
    payload
  }
}

export const fetchDataLatestUpdateDates = (): FetchDataLatestUpdateDates => {
  return {
    type: FETCH_DATA_LATESTS_UPDATE_DATES
  }
}

export const fetchDataLatestUpdateDatesComplete = (
  payload: DataLatestUpdateDates
): FetchDataLatestUpdateDatesComplete => {
  return {
    type: FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
    payload
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
