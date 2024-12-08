import { zoomIn, zoomOut } from "../../map"
import { AppThunk } from "../storeTypes"

export const zoomInThunk = (): AppThunk => () => {
  zoomIn()
}

export const zoomOutThunk = (): AppThunk => () => {
  zoomOut()
}
