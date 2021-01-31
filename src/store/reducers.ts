import { Reducer } from "redux"
import { Settings } from "../common/types"
import MuinaismuistotMap from "../map/MuinaismuistotMap"
import {
  ActionTypes,
  CENTER_TO_CURRENT_POSITION,
  ZOOM_IN,
  ZOOM_OUT
} from "./types"

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
