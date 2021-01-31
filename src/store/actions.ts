import {
  CenterToCurrentPosition,
  CENTER_TO_CURRENT_POSITION,
  ZoomInAction,
  ZoomOutAction,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"

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
