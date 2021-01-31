import { Reducer } from "redux"
import MuinaismuistotMap from "../map/MuinaismuistotMap"
import { PageId, Settings } from "./storeTypes"
import {
  ActionTypes,
  CENTER_TO_CURRENT_POSITION,
  FEATURES_SELECTED_ON_MAP,
  FETCH_DATA_LATESTS_UPDATE_DATES,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"

export const createRootReducer = (map: MuinaismuistotMap): Reducer => {
  return (state: Settings, action: ActionTypes) => {
    if (action.type === ZOOM_IN) {
      map.zoomIn()
      return state
    } else if (action.type === ZOOM_OUT) {
      map.zoomOut()
      return state
    } else if (action.type === CENTER_TO_CURRENT_POSITION) {
      map.centerToCurrentPositions()
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
      map.fetchDataLatestUpdateDates(state)
      return state
    } else if (action.type === FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE) {
      return {
        ...state,
        dataLatestUpdateDates: action.payload
      }
    }
    return state
  }
}
