import { ArgisFeature, DataLatestUpdateDates } from "../common/types"
import { SelectedFeaturesOnMap } from "./storeTypes"

export const ZOOM_IN = "ZOOM_IN"
export const ZOOM_OUT = "ZOOM_OUT"
export const CENTER_TO_CURRENT_POSITION = "CENTER_TO_CURRENT_POSITION"
export const FEATURES_SELECTED_ON_MAP = "FEATURES_SELECTED_ON_MAP"
export const FETCH_DATA_LATESTS_UPDATE_DATES = "FETCH_DATA_LATESTS_UPDATE_DATES"
export const FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE =
  "FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE"
export const SEARCH_FEATURES_COMPLETE = "SEARCH_FEATURES_COMPLETE"

export interface ZoomInAction {
  type: typeof ZOOM_IN
}

export interface ZoomOutAction {
  type: typeof ZOOM_OUT
}

export interface CenterToCurrentPosition {
  type: typeof CENTER_TO_CURRENT_POSITION
}

export interface FeaturesSelectedOnMap {
  type: typeof FEATURES_SELECTED_ON_MAP
  payload: SelectedFeaturesOnMap
}

export interface FetchDataLatestUpdateDates {
  type: typeof FETCH_DATA_LATESTS_UPDATE_DATES
}

export interface FetchDataLatestUpdateDatesComplete {
  type: typeof FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE
  payload: DataLatestUpdateDates
}

export interface SearchFeaturesComplete {
  type: typeof SEARCH_FEATURES_COMPLETE
  searchResultFeatures: Array<ArgisFeature>
}

export type ActionTypes =
  | ZoomInAction
  | ZoomOutAction
  | CenterToCurrentPosition
  | FeaturesSelectedOnMap
  | FetchDataLatestUpdateDates
  | FetchDataLatestUpdateDatesComplete
  | SearchFeaturesComplete
