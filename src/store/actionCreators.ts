import { ArgisFeature, DataLatestUpdateDates } from "../common/types"
import {
  CenterToCurrentPosition,
  CENTER_TO_CURRENT_POSITION,
  FeaturesSelectedOnMap,
  FEATURES_SELECTED_ON_MAP,
  FetchDataLatestUpdateDates,
  FetchDataLatestUpdateDatesComplete,
  FETCH_DATA_LATESTS_UPDATE_DATES,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  SearchFeatures,
  SearchFeaturesComplete,
  SEARCH_FEATURES,
  SEARCH_FEATURES_COMPLETE,
  ZoomInAction,
  ZoomOutAction,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"
import { SelectedFeaturesOnMap } from "./storeTypes"

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

export const searchFeatures = (searchText: string): SearchFeatures => {
  return {
    type: SEARCH_FEATURES,
    searchText
  }
}

export const searchFeaturesComplete = (
  searchResultFeatures: Array<ArgisFeature>
): SearchFeaturesComplete => {
  return {
    type: SEARCH_FEATURES_COMPLETE,
    searchResultFeatures
  }
}
