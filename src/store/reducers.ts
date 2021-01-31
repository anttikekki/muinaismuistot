import { Reducer } from "redux"
import MuinaismuistotMap from "../map/MuinaismuistotMap"
import { Settings } from "./storeTypes"
import {
  ActionTypes,
  CENTER_TO_CURRENT_POSITION,
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
    }
    return state
  }
}
