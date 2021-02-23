import { Reducer } from "redux"
import { PageId, Settings } from "./storeTypes"
import {
  ActionTypes,
  CENTER_TO_CURRENT_POSITION,
  CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  SEARCH_FEATURES_COMPLETE,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"
import {
  centerToCurrentPositions,
  zoomIn,
  zoomOut
} from "../map/MuinaismuistotMap"

export const rootReducer: Reducer<Settings, ActionTypes> = (state, action) => {
  if (state == undefined) {
    throw new Error("State must be defined")
  }

  if (action.type === ZOOM_IN) {
    zoomIn()
    return state
  } else if (action.type === ZOOM_OUT) {
    zoomOut()
    return state
  } else if (action.type === CENTER_TO_CURRENT_POSITION) {
    centerToCurrentPositions()
    return state
  } else if (action.type === CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE) {
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
  } else if (action.type === FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE) {
    return {
      ...state,
      dataLatestUpdateDates: action.payload
    }
  } else if (action.type === SEARCH_FEATURES_COMPLETE) {
    return {
      ...state,
      search: {
        ...state.search,
        searchResults: action.searchResultFeatures
      }
    }
  }
  return state
}
