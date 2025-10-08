import MuinaismuistotMap from "./map"
import { addStoreListener, createStore } from "./store"
import { ActionTypeEnum } from "./store/actionTypes"
import { createUI } from "./ui"
import URLUtil from "./url"

const preloadedState = URLUtil.getSettingsFromURL()
const store = createStore(preloadedState)

const map = new MuinaismuistotMap(store)
addStoreListener(map.mapUpdaterStoreListener)

createUI(store)

addStoreListener(URLUtil.urlSettingsUpdaterStoreListener)

// Päivitetään kaikki asetukset, kun käyttäjä muuttaa käsin hash-osaa URLista
window.onhashchange = () => {
  store.dispatch({
    type: ActionTypeEnum.URL_CHANGED_BY_USER,
    newSettingsFromURL: URLUtil.getSettingsFromURL()
  })
}
