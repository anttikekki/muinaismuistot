import {
  AhvenanmaaLayer,
  ArgisFeature,
  DataLatestUpdateDates,
  GtkLayer,
  Language,
  MaanmittauslaitosLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoLayer
} from "../common/types"
import {
  CenterMapToCurrentPositionAction,
  CENTER_MAP_TO_CURRENT_POSITION,
  ChangeGTKLayerOpacityAction,
  ChangeLanguageAction,
  CHANGE_GTK_LAYER_OPACITY,
  CHANGE_LANGUAGE,
  ClickedMapFeatureIdentificationCompleteAction,
  CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE,
  FetchDataLatestUpdateDatesAction,
  FetchDataLatestUpdateDatesCompleteAction,
  FETCH_DATA_LATESTS_UPDATE_DATES,
  FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
  SearchFeaturesAction,
  SearchFeaturesCompleteAction,
  SEARCH_FEATURES,
  SEARCH_FEATURES_COMPLETE,
  SelectVisibleAhvenanmaaLayersAction,
  SelectVisibleGTKLayersAction,
  SelectVisibleMaanmittauslaitosLayerAction,
  SelectVisibleMaisemanMuistiLayersAction,
  SelectVisibleModelsLayersAction,
  SelectVisibleMuinaisjäännösDatingAction,
  SelectVisibleMuinaisjäännösTypeAction,
  SelectVisibleMuseovirastoLayersAction,
  SELECT_VISIBLE_AHVENANMAA_LAYERS,
  SELECT_VISIBLE_GTK_LAYERS,
  SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER,
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS,
  SELECT_VISIBLE_MODELS_LAYERS,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
  SELECT_VISIBLE_MUSEOVIRASTO_LAYERS,
  ShowLoadingAnimationAction,
  ShowPageAction,
  SHOW_LOADING_ANIMATION,
  SHOW_PAGE,
  ZoomInAction,
  ZoomOutAction,
  ZOOM_IN,
  ZOOM_OUT
} from "./actionTypes"
import { PageId, SelectedFeaturesOnMap } from "./storeTypes"

export const zoomIn = (): ZoomInAction => {
  return {
    type: ZOOM_IN
  }
}

export const zoomOut = (): ZoomOutAction => {
  return {
    type: ZOOM_OUT
  }
}

export const centerToCurrentPosition = (): CenterMapToCurrentPositionAction => {
  return {
    type: CENTER_MAP_TO_CURRENT_POSITION
  }
}

export const fetchDataLatestUpdateDates = (): FetchDataLatestUpdateDatesAction => {
  return {
    type: FETCH_DATA_LATESTS_UPDATE_DATES
  }
}

export const fetchDataLatestUpdateDatesComplete = (
  payload: DataLatestUpdateDates
): FetchDataLatestUpdateDatesCompleteAction => {
  return {
    type: FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE,
    payload
  }
}

export const searchFeatures = (searchText: string): SearchFeaturesAction => {
  return {
    type: SEARCH_FEATURES,
    searchText
  }
}

export const searchFeaturesComplete = (
  searchResultFeatures: Array<ArgisFeature>
): SearchFeaturesCompleteAction => {
  return {
    type: SEARCH_FEATURES_COMPLETE,
    searchResultFeatures
  }
}

export const clickedMapFeatureIdentificationComplete = (
  payload: SelectedFeaturesOnMap
): ClickedMapFeatureIdentificationCompleteAction => {
  return {
    type: CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE,
    payload
  }
}

export const selectMaanmittauslaitosLayer = (
  layer: MaanmittauslaitosLayer
): SelectVisibleMaanmittauslaitosLayerAction => {
  return {
    type: SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER,
    layer
  }
}

export const selectGTKLayer = (
  layers: Array<GtkLayer>
): SelectVisibleGTKLayersAction => {
  return {
    type: SELECT_VISIBLE_GTK_LAYERS,
    layers
  }
}

export const changeGtkLayerOpacity = (
  opacity: number
): ChangeGTKLayerOpacityAction => {
  return {
    type: CHANGE_GTK_LAYER_OPACITY,
    opacity
  }
}

export const selectMuseovirastoLayers = (
  layers: Array<MuseovirastoLayer>
): SelectVisibleMuseovirastoLayersAction => {
  return {
    type: SELECT_VISIBLE_MUSEOVIRASTO_LAYERS,
    layers
  }
}

export const selectAhvenanmaaLayers = (
  layers: Array<AhvenanmaaLayer>
): SelectVisibleAhvenanmaaLayersAction => {
  return {
    type: SELECT_VISIBLE_AHVENANMAA_LAYERS,
    layers
  }
}

export const selectModelLayers = (
  layers: Array<ModelLayer>
): SelectVisibleModelsLayersAction => {
  return {
    type: SELECT_VISIBLE_MODELS_LAYERS,
    layers
  }
}

export const selectMaisemanMuistiLayers = (
  layers: Array<MaisemanMuistiLayer>
): SelectVisibleMaisemanMuistiLayersAction => {
  return {
    type: SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS,
    layers
  }
}

export const selectMuinaisjaannosType = (
  types: Array<MuinaisjaannosTyyppi>
): SelectVisibleMuinaisjäännösTypeAction => {
  return {
    type: SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
    types
  }
}

export const selectMuinaisjaannosDating = (
  datings: Array<MuinaisjaannosAjoitus>
): SelectVisibleMuinaisjäännösDatingAction => {
  return {
    type: SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
    datings
  }
}

export const changeLanguage = (language: Language): ChangeLanguageAction => {
  return {
    type: CHANGE_LANGUAGE,
    language
  }
}

export const showLoadingAnimation = (
  show: boolean
): ShowLoadingAnimationAction => {
  return {
    type: SHOW_LOADING_ANIMATION,
    show
  }
}

export const showPage = (pageId?: PageId): ShowPageAction => {
  return {
    type: SHOW_PAGE,
    pageId
  }
}
