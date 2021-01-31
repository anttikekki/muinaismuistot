export const ZOOM_IN = "ZOOM_IN"
export const ZOOM_OUT = "ZOOM_OUT"
export const CENTER_TO_CURRENT_POSITION = "CENTER_TO_CURRENT_POSITION"

export interface ZoomInAction {
  type: typeof ZOOM_IN
}

export interface ZoomOutAction {
  type: typeof ZOOM_OUT
}

export interface CenterToCurrentPosition {
  type: typeof CENTER_TO_CURRENT_POSITION
}

export type ActionTypes = ZoomInAction | ZoomOutAction | CenterToCurrentPosition
