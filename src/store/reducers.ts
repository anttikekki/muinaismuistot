import { Reducer } from "redux"
import { PageId, Settings } from "./storeTypes"
import {
  ActionTypes,
  CENTER_TO_CURRENT_POSITION,
  FEATURES_SELECTED_ON_MAP,
  FETCH_DATA_LATESTS_UPDATE_DATES,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  SEARCH_FEATURES,
  SEARCH_FEATURES_COMPLETE,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"
import {
  centerToCurrentPositions,
  fetchDataLatestUpdateDates,
  searchFeatures,
  zoomIn,
  zoomOut
} from "../map/MuinaismuistotMap"

export const rootReducer: Reducer = (state: Settings, action: ActionTypes) => {
  if (action.type === ZOOM_IN) {
    zoomIn()
    return state
  } else if (action.type === ZOOM_OUT) {
    zoomOut()
    return state
  } else if (action.type === CENTER_TO_CURRENT_POSITION) {
    centerToCurrentPositions()
    return state
  } else if (action.type === FEATURES_SELECTED_ON_MAP) {
    const selectedFeaturesOnMap = action.payload
    if (
      selectedFeaturesOnMap.features.length === 0 &&
      selectedFeaturesOnMap.maisemanMuistiFeatures.length === 0
    ) {
      return state
    }
    return {
      ...state,
      visiblePage: PageId.Details,
      selectedFeaturesOnMap
    }
  } else if (action.type === FETCH_DATA_LATESTS_UPDATE_DATES) {
    fetchDataLatestUpdateDates(state)
    return state
  } else if (action.type === FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE) {
    return {
      ...state,
      dataLatestUpdateDates: action.payload
    }
  } else if (action.type === SEARCH_FEATURES) {
    searchFeatures(action.searchText)
    return {
      ...state,
      searchResultFeatures: undefined
    }
  } else if (action.type === SEARCH_FEATURES_COMPLETE) {
    return {
      ...state,
      searchResultFeatures: action.searchResultFeatures
    }
  }
  return state
}
