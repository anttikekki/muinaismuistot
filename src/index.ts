import "core-js/stable"
import "elm-pep"

import MuinaismuistotMap from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import { DataLatestUpdateDates } from "./common/types"
import { getSettingsFromURL, updateSettingsToURL } from "./settings"
import { configureStore } from "./store/configureStore"
import { createRootReducer } from "./store/reducers"
import { Settings } from "./store/storeTypes"
import { initialSettings } from "./store/initialSettings"
import {
  featuresSelectedOnMap,
  fetchDataLatestUpdateDatesComplete
} from "./store/actionCreators"

const determineStartLocation = () => {
  if (parseCoordinatesFromURL()) {
    setMapLocationFromURLHash()
  } else {
    map.centerToCurrentPositions()
  }
}

const setMapLocationFromURLHash = () => {
  const coordinates = parseCoordinatesFromURL()
  if (coordinates) {
    map.setMapLocation(coordinates)
    map.showSelectedLocationMarker(coordinates)
  }
}

const updateSettings = (settings: Settings) => {
  settings = settings
  updateSettingsToURL(initialSettings, settings)
}

const settings = getSettingsFromURL(initialSettings)

const map = new MuinaismuistotMap(settings, {
  featuresSelected: (features, models, maisemanMuistiFeatures) => {
    store.dispatch(
      featuresSelectedOnMap({ features, models, maisemanMuistiFeatures })
    )
  },
  showLoadingAnimation: (show) => {
    ui.showLoadingAnimation(show)
  },
  featureSearchReady: (features) => {
    //ui.featureSearchReady(features)
  },
  dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => {
    store.dispatch(fetchDataLatestUpdateDatesComplete(dates))
  }
})

const store = configureStore(settings, createRootReducer(map))

const ui = new MuinaismuistotUI(settings, store, {
  searchFeatures: (searchText) => {
    map.searchFeatures(searchText)
  },
  selectedMaanmittauslaitosLayerChanged: (settings) => {
    updateSettings(settings)
    map.selectedMaanmittauslaitosLayerChanged(settings)
  },
  selectedGtkLayerChanged: (settings, changedLayerGroup) => {
    updateSettings(settings)
    map.selectedFeatureLayersChanged(settings, changedLayerGroup)
  },
  onGtkLayerOpacityChange: (settings: Settings) => {
    updateSettings(settings)
    map.gtkLayerOpacityChanged(settings)
  },
  selectedFeatureLayersChanged: (settings, changedLayerGroup) => {
    updateSettings(settings)
    map.selectedFeatureLayersChanged(settings, changedLayerGroup)
  },
  selectedMuinaisjaannosTypesChanged: (settings) => {
    updateSettings(settings)
    map.selectedMuinaisjaannosTypesChanged(settings)
  },
  selectedMuinaisjaannosDatingsChanged: (settings) => {
    updateSettings(settings)
    map.selectedMuinaisjaannosDatingsChanged(settings)
  },
  selectedLanguageChanged: (settings) => {
    updateSettings(settings)
  }
})

window.onhashchange = () => {
  setMapLocationFromURLHash()
}

determineStartLocation()
