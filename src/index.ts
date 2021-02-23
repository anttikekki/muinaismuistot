import "core-js/stable"
import "elm-pep"

import {
  centerToCurrentPositions,
  createMap,
  gtkLayerOpacityChanged,
  selectedFeatureLayersChanged,
  selectedMaanmittauslaitosLayerChanged,
  selectedMuinaisjaannosDatingsChanged,
  selectedMuinaisjaannosTypesChanged,
  setMapLocation,
  showSelectedLocationMarker
} from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import { getSettingsFromURL, updateSettingsToURL } from "./settings"
import { configureStore } from "./store/configureStore"
import { rootReducer } from "./store/reducers"
import { Settings } from "./store/storeTypes"
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

const updateSettings = (settings: Settings) => {
  settings = settings
  updateSettingsToURL(initialSettings, settings)
}

const settings = getSettingsFromURL(initialSettings)
const store = configureStore(settings, rootReducer)

createMap(store, {
  showLoadingAnimation: (show) => {
    ui.showLoadingAnimation(show)
  }
})

const ui = new MuinaismuistotUI(settings, store, {
  selectedMaanmittauslaitosLayerChanged: (settings) => {
    updateSettings(settings)
    selectedMaanmittauslaitosLayerChanged(settings)
  },
  selectedGtkLayerChanged: (settings, changedLayerGroup) => {
    updateSettings(settings)
    selectedFeatureLayersChanged(changedLayerGroup)
  },
  onGtkLayerOpacityChange: (settings: Settings) => {
    updateSettings(settings)
    gtkLayerOpacityChanged()
  },
  selectedFeatureLayersChanged: (settings, changedLayerGroup) => {
    updateSettings(settings)
    selectedFeatureLayersChanged(changedLayerGroup)
  },
  selectedMuinaisjaannosTypesChanged: (settings) => {
    updateSettings(settings)
    selectedMuinaisjaannosTypesChanged()
  },
  selectedMuinaisjaannosDatingsChanged: (settings) => {
    updateSettings(settings)
    selectedMuinaisjaannosDatingsChanged()
  },
  selectedLanguageChanged: (settings) => {
    updateSettings(settings)
  }
})

window.onhashchange = () => {
  setMapLocationFromURLHash()
}

determineStartLocation()
