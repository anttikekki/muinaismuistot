import { configureStore } from "@reduxjs/toolkit"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import {
  centerToCurrentPositions,
  createMap,
  setMapLocation,
  showSelectedLocationMarker
} from "./map"
import { initialSettings } from "./store/initialSettings"
import { rootReducer } from "./store/rootReducer"
import { createUI } from "./ui"
import { getSettingsFromURL } from "./url"

const determineStartLocation = () => {
  if (parseCoordinatesFromURL()) {
    setMapLocationFromURLHash()
  } else {
    centerToCurrentPositions()
  }
}

let prevCoordinatesFromURL: [number, number] | undefined
const setMapLocationFromURLHash = () => {
  const coordinates = parseCoordinatesFromURL()
  /**
   * Do not move map to URL coordines multiple times. URL updates when settings are changed
   * so it would move map back to original target.
   */
  const sameAsPrevCoordinates =
    prevCoordinatesFromURL && coordinates
      ? prevCoordinatesFromURL.every((v, i) => v === coordinates[i])
      : false
  if (coordinates && !sameAsPrevCoordinates) {
    setMapLocation(coordinates)
    showSelectedLocationMarker(coordinates)
    prevCoordinatesFromURL = coordinates
  }
}

const settings = getSettingsFromURL(initialSettings)
const store = configureStore({
  reducer: rootReducer,
  preloadedState: settings
})

createMap(store)
createUI(store)

window.onhashchange = () => {
  setMapLocationFromURLHash()
}

determineStartLocation()
