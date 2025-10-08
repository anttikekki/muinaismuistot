import debounce from "debounce"
import { StoreListener } from "../store"
import { ActionTypeEnum } from "../store/actionTypes"
import { initialSettings } from "../store/initialSettings"
import { getSettingsFromURL } from "./parseURL"
import { updateSettingsToURL } from "./stringifyToURL"

export default class URLUtil {
  public static urlSettingsUpdaterStoreListener: StoreListener = {
    predicate: (action) => {
      switch (action.type) {
        case ActionTypeEnum.CHANGE_LANGUAGE:
        case ActionTypeEnum.CHANGE_LAYER_OPACITY:
        case ActionTypeEnum.SELECT_VISIBLE_LAYERS:
        case ActionTypeEnum.ENABLE_LAYER_GROUP:
        case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE:
        case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING:
        case ActionTypeEnum.MOVE_MAANNOUSU_LAYER:
        case ActionTypeEnum.SELECT_VIABUNDUS_YEAR:
        case ActionTypeEnum.SET_LINKED_FEATURE:
          return true
        default:
          return false
      }
    },
    /**
     * Viivätä URL-päivityksiä 300ms. Läpinäkyvyyden liukusäädin
     * lähettää niin monta päivitystä, että Firefox alkaa heittää virhettä.
     */
    effect: debounce((action, listenerApi) => {
      // Kytketään hash-muutoksen kuuntelija pois päältä
      // URLin päivityksen ajaksi.
      const onhashchange = window.onhashchange
      window.onhashchange = null

      updateSettingsToURL(initialSettings, listenerApi.getState())

      // Palautetaan kuuntelija asynkronisesti URLin päivityksen jälkeen
      window.setTimeout(() => {
        window.onhashchange = onhashchange
      })
    }, 300)
  }

  public static getSettingsFromURL = () => getSettingsFromURL()
}
