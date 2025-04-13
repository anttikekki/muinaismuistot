import { parseCoordinatesFromURL } from "../common/util/URLHashHelper"
import { StoreListener } from "../store"
import { ActionTypeEnum } from "../store/actionTypes"
import { initialSettings } from "../store/initialSettings"
import { AppDispatch } from "../store/storeTypes"
import { getSettingsFromURL } from "./parseURL"
import { updateSettingsToURL } from "./stringifyToURL"

export default class URLUtil {
  private prevCoordinatesFromURL: [number, number] | undefined

  public constructor(dispatch: AppDispatch) {
    window.onhashchange = () => {
      this.setMapLocationFromURLHash(dispatch)
    }
    this.determineStartLocation(dispatch)
  }

  public urlSettingsUpdaterStoreListener: StoreListener = {
    predicate: (action) => {
      switch (action.type) {
        case ActionTypeEnum.CHANGE_LANGUAGE:
        case ActionTypeEnum.CHANGE_LAYER_OPACITY:
        case ActionTypeEnum.SELECT_VISIBLE_LAYERS:
        case ActionTypeEnum.ENABLE_LAYER_GROUP:
        case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE:
        case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING:
          return true
        default:
          return false
      }
    },
    effect: (action, listenerApi) => {
      updateSettingsToURL(initialSettings, listenerApi.getState())
    }
  }

  private determineStartLocation = (dispatch: AppDispatch) => {
    if (parseCoordinatesFromURL()) {
      this.setMapLocationFromURLHash(dispatch)
    } else {
      dispatch({
        type: ActionTypeEnum.CENTER_MAP_TO_CURRENT_POSITION
      })
    }
  }

  private setMapLocationFromURLHash = (dispatch: AppDispatch) => {
    const coordinates = parseCoordinatesFromURL()
    /**
     * Do not move map to URL coordines multiple times. URL updates when settings are changed
     * so it would move map back to original target.
     */
    const sameAsPrevCoordinates =
      this.prevCoordinatesFromURL && coordinates
        ? this.prevCoordinatesFromURL[0] === coordinates[0] &&
          this.prevCoordinatesFromURL[1] === coordinates[1]
        : false
    if (coordinates && !sameAsPrevCoordinates) {
      dispatch({
        type: ActionTypeEnum.SET_MAP_LOCATION_AND_SHOW_SELECTED_MARKER,
        coordinates
      })
      this.prevCoordinatesFromURL = coordinates
    }
  }

  public static getSettingsFromURL = () => getSettingsFromURL()
}
