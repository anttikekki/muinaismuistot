import "core-js/stable"
import "elm-pep"

import {
  centerToCurrentPositions,
  createMap,
  gtkLayerOpacityChanged,
  searchFeatures,
  selectedFeatureLayersChanged,
  selectedMaanmittauslaitosLayerChanged,
  selectedMuinaisjaannosDatingsChanged,
  selectedMuinaisjaannosTypesChanged,
  setMapLocation,
  showSelectedLocationMarker
} from "./map/MuinaismuistotMap"
import MuinaismuistotUI from "./ui/MuinaismuistotUI"
import { parseCoordinatesFromURL } from "./common/util/URLHashHelper"
import { DataLatestUpdateDates } from "./common/types"
import { getSettingsFromURL, updateSettingsToURL } from "./settings"
import { configureStore } from "./store/configureStore"
import { rootReducer } from "./store/reducers"
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

createMap(settings, {
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

const store = configureStore(settings, rootReducer)

const ui = new MuinaismuistotUI(settings, store, {
  searchFeatures: (searchText) => {
    searchFeatures(searchText)
  },
  selectedMaanmittauslaitosLayerChanged: (settings) => {
    updateSettings(settings)
    selectedMaanmittauslaitosLayerChanged(settings)
  },
  selectedGtkLayerChanged: (settings, changedLayerGroup) => {
    updateSettings(settings)
    selectedFeatureLayersChanged(settings, changedLayerGroup)
  },
  onGtkLayerOpacityChange: (settings: Settings) => {
    updateSettings(settings)
    gtkLayerOpacityChanged(settings)
  },
  selectedFeatureLayersChanged: (settings, changedLayerGroup) => {
    updateSettings(settings)
    selectedFeatureLayersChanged(settings, changedLayerGroup)
  },
  selectedMuinaisjaannosTypesChanged: (settings) => {
    updateSettings(settings)
    selectedMuinaisjaannosTypesChanged(settings)
  },
  selectedMuinaisjaannosDatingsChanged: (settings) => {
    updateSettings(settings)
    selectedMuinaisjaannosDatingsChanged(settings)
  },
  selectedLanguageChanged: (settings) => {
    updateSettings(settings)
  }
})

window.onhashchange = () => {
  setMapLocationFromURLHash()
}

determineStartLocation()
