import "core-js/stable"
import "elm-pep"

import {
  centerToCurrentPositions,
  createMap,
  setMapLocation,
  showSelectedLocationMarker
} from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import { getSettingsFromURL } from "./url"
import { configureStore } from "./store/configureStore"
import { rootReducer } from "./store/reducers"
import { initialSettings } from "./store/initialSettings"

const determineStartLocation = () => {
  if (parseCoordinatesFromURL()) {
    setMapLocationFromURLHash()
  } else {
    centerToCurrentPositions()
  }
}

const setMapLocationFromURLHash = () => {
  const coordinates = parseCoordinatesFromURL()
  if (coordinates) {
    setMapLocation(coordinates)
    showSelectedLocationMarker(coordinates)
  }
}

const settings = getSettingsFromURL(initialSettings)
const store = configureStore(settings, rootReducer)

createMap(store)

const ui = new MuinaismuistotUI(store)

window.onhashchange = () => {
  setMapLocationFromURLHash()
}

determineStartLocation()
