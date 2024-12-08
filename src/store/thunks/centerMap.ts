import { centerToCurrentPositions } from "../../map"
import { AppThunk } from "../storeTypes"

export const centerMapThunk = (): AppThunk => () => {
  centerToCurrentPositions()
}
