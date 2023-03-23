import { Reducer } from "redux"
import { PageId, Settings } from "./storeTypes"
import {
  ActionTypes,
  CHANGE_LAYER_OPACITY,
  CHANGE_LANGUAGE,
  CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  SEARCH_FEATURES,
  SEARCH_FEATURES_COMPLETE,
  SELECT_VISIBLE_AHVENANMAA_LAYERS,
  SELECT_VISIBLE_GTK_LAYERS,
  SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER,
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS,
  SELECT_VISIBLE_MODELS_LAYERS,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
  SELECT_VISIBLE_MUSEOVIRASTO_LAYERS,
  SHOW_LOADING_ANIMATION,
  SHOW_PAGE,
  SELECT_VISIBLE_HELSINKI_LAYERS,
  MAANKOHOAMINEN_CHANGE_YEAR,
  SELECT_VISIBLE_MAANKOHOAMINEN_LAYER
} from "./actionTypes"
import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  Language,
  GtkLayer,
  LayerGroup,
  HelsinkiLayer
} from "../common/types"
import {
  getNextMaankohoaminenLayer,
  maankohoaminenLayers
} from "../common/maankohoaminen"

export const updateLanguage = (
  settings: Settings,
  language: Language
): Settings => {
  return {
    ...settings,
    language
  }
}

export const updateMaanmittauslaitosSelectedLayer = (
  settings: Settings,
  selectedLayer: MaanmittauslaitosLayer
): Settings => {
  return {
    ...settings,
    maanmittauslaitos: {
      ...settings.maanmittauslaitos,
      selectedLayer
    }
  }
}

export const updateGtkSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<GtkLayer>
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      selectedLayers
    }
  }
}

export const updateGtkLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    gtk: {
      ...settings.gtk,
      opacity
    }
  }
}

export const updateHelsinkiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<HelsinkiLayer>
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      selectedLayers
    }
  }
}

export const updateHelsinkiLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    helsinki: {
      ...settings.helsinki,
      opacity
    }
  }
}

export const updateMuseovirastoSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MuseovirastoLayer>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedLayers
    }
  }
}

export const updateMuseovirastoLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      opacity
    }
  }
}

export const updateAhvenanmaaSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<AhvenanmaaLayer>
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      selectedLayers
    }
  }
}

export const updateAhvenanmaaLayerOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  return {
    ...settings,
    ahvenanmaa: {
      ...settings.ahvenanmaa,
      opacity
    }
  }
}

export const updateModelSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<ModelLayer>
): Settings => {
  return {
    ...settings,
    models: {
      ...settings.models,
      selectedLayers
    }
  }
}

export const updateMaisemanMuistiSelectedLayers = (
  settings: Settings,
  selectedLayers: Array<MaisemanMuistiLayer>
): Settings => {
  return {
    ...settings,
    maisemanMuisti: {
      ...settings.maisemanMuisti,
      selectedLayers
    }
  }
}

export const updateSelectMuinaisjaannosTypes = (
  settings: Settings,
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosTypes
    }
  }
}

export const updateSelectMuinaisjaannosDatings = (
  settings: Settings,
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
): Settings => {
  return {
    ...settings,
    museovirasto: {
      ...settings.museovirasto,
      selectedMuinaisjaannosDatings
    }
  }
}

const updateMaankohoaminenLayerFromAddYears = (
  settings: Settings,
  addYears: 100 | -100
): Settings => {
  if (!settings.maankohoaminen.selectedLayer) {
    return settings
  }

  return {
    ...settings,
    maankohoaminen: {
      ...settings.maankohoaminen,
      selectedLayer: getNextMaankohoaminenLayer(
        addYears,
        settings.maankohoaminen.selectedLayer
      )
    }
  }
}

export const updateMaankohoaminenLayer = (
  settings: Settings,
  layer: string | undefined
): Settings => {
  if (layer && !maankohoaminenLayers.find((l) => l.layer === layer)) {
    return settings
  }

  return {
    ...settings,
    maankohoaminen: {
      ...settings.maankohoaminen,
      selectedLayer: layer
    }
  }
}

export const updateMaankohoaminenOpacity = (
  settings: Settings,
  opacity: number
): Settings => {
  if (opacity < 0 || opacity > 1) {
    return settings
  }

  return {
    ...settings,
    maankohoaminen: {
      ...settings.maankohoaminen,
      opacity
    }
  }
}

export const rootReducer: Reducer<Settings, ActionTypes> = (state, action) => {
  if (state == undefined) {
    throw new Error("State must be defined")
  }

  if (action.type === CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE) {
    const selectedFeaturesOnMap = action.payload
    if (
      selectedFeaturesOnMap.features.length === 0 &&
      selectedFeaturesOnMap.maisemanMuistiFeatures.length === 0 &&
      selectedFeaturesOnMap.maalinnoitusFeatures.length === 0
    ) {
      return state
    }
    return {
      ...state,
      visiblePage: PageId.Details,
      selectedFeaturesOnMap
    }
  } else if (action.type === FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE) {
    return {
      ...state,
      dataLatestUpdateDates: action.payload
    }
  } else if (action.type === SEARCH_FEATURES) {
    return {
      ...state,
      search: {
        ...state.search,
        searchResults: undefined
      }
    }
  } else if (action.type === SEARCH_FEATURES_COMPLETE) {
    return {
      ...state,
      search: {
        ...state.search,
        searchResults: action.searchResultFeatures
      }
    }
  } else if (action.type === SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER) {
    return updateMaanmittauslaitosSelectedLayer(state, action.layer)
  } else if (action.type === SELECT_VISIBLE_GTK_LAYERS) {
    return updateGtkSelectedLayers(state, action.layers)
  } else if (action.type === CHANGE_LAYER_OPACITY) {
    switch (action.layerGroup) {
      case LayerGroup.GTK:
        return updateGtkLayerOpacity(state, action.opacity)
      case LayerGroup.Museovirasto:
        return updateMuseovirastoLayerOpacity(state, action.opacity)
      case LayerGroup.Ahvenanmaa:
        return updateAhvenanmaaLayerOpacity(state, action.opacity)
      case LayerGroup.Helsinki:
        return updateHelsinkiLayerOpacity(state, action.opacity)
      case LayerGroup.Maankohoaminen:
        return updateMaankohoaminenOpacity(state, action.opacity)
    }
  } else if (action.type === SELECT_VISIBLE_HELSINKI_LAYERS) {
    return updateHelsinkiSelectedLayers(state, action.layers)
  } else if (action.type === SELECT_VISIBLE_MUSEOVIRASTO_LAYERS) {
    return updateMuseovirastoSelectedLayers(state, action.layers)
  } else if (action.type === SELECT_VISIBLE_AHVENANMAA_LAYERS) {
    return updateAhvenanmaaSelectedLayers(state, action.layers)
  } else if (action.type === SELECT_VISIBLE_MODELS_LAYERS) {
    return updateModelSelectedLayers(state, action.layers)
  } else if (action.type === SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS) {
    return updateMaisemanMuistiSelectedLayers(state, action.layers)
  } else if (action.type === SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE) {
    return updateSelectMuinaisjaannosTypes(state, action.types)
  } else if (action.type === SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING) {
    return updateSelectMuinaisjaannosDatings(state, action.datings)
  } else if (action.type === CHANGE_LANGUAGE) {
    return updateLanguage(state, action.language)
  } else if (action.type === SHOW_LOADING_ANIMATION) {
    return {
      ...state,
      showLoadingAnimation: action.show
    }
  } else if (action.type === SHOW_PAGE) {
    return {
      ...state,
      visiblePage: action.pageId
    }
  } else if (action.type === MAANKOHOAMINEN_CHANGE_YEAR) {
    return updateMaankohoaminenLayerFromAddYears(state, action.addYears)
  } else if (action.type === SELECT_VISIBLE_MAANKOHOAMINEN_LAYER) {
    return updateMaankohoaminenLayer(state, action.layer)
  }
  return state
}
