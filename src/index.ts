import MuinaismuistotMap from "./map"
import { addStoreListener, createStore } from "./store"
import { createUI } from "./ui"
import URLUtil from "./url"

const preloadedState = URLUtil.getSettingsFromURL()
const store = createStore(preloadedState)

const map = new MuinaismuistotMap(store)
addStoreListener(map.mapUpdaterStoreListener)

createUI(store)

const urlUtil = new URLUtil(store.dispatch)
addStoreListener(urlUtil.urlSettingsUpdaterStoreListener)
