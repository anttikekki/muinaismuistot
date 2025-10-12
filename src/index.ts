import MuinaismuistotMap from "./map"
import { addStoreListener, createStore } from "./store"
import { ActionTypeEnum } from "./store/actionTypes"
import { createUI } from "./ui"
import URLUtil from "./url"
import { getSettingsFromURL } from "./url/parseURL"

const preloadedState = URLUtil.getSettingsFromURL()
const store = createStore(preloadedState)

const map = new MuinaismuistotMap(store)
addStoreListener(map.mapUpdaterStoreListener)

createUI(store)

addStoreListener(URLUtil.urlSettingsUpdaterStoreListener)

// Päivitetään vain linkitetty kohde, kun käyttäjä muuttaa käsin hash-osaa URLista.
window.onhashchange = () => {
  const { linkedFeature } = getSettingsFromURL()
  store.dispatch({
    type: ActionTypeEnum.SET_LINKED_FEATURE,
    linkedFeature
  })
}
