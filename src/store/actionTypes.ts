import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import {
  AhvenanmaaLayer,
  DataLatestUpdateDates,
  GtkLayer,
  HelsinkiLayer,
  Language,
  LayerGroup,
  MaanmittauslaitosLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/types"
import { PageId, SelectedFeaturesOnMap } from "./storeTypes"

export const ZOOM_IN = "ZOOM_IN"
export const ZOOM_OUT = "ZOOM_OUT"
export const CENTER_MAP_TO_CURRENT_POSITION = "CENTER_MAP_TO_CURRENT_POSITION"
export const FETCH_DATA_LATESTS_UPDATE_DATES = "FETCH_DATA_LATESTS_UPDATE_DATES"
export const FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE =
  "FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE"
export const SEARCH_FEATURES = "SEARCH_FEATURES"
export const SEARCH_FEATURES_COMPLETE = "SEARCH_FEATURES_COMPLETE"
export const CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE =
  "CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE"
export const SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER =
  "SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER"
export const SELECT_VISIBLE_GTK_LAYERS = "SELECT_VISIBLE_GTK_LAYERS"
export const CHANGE_LAYER_OPACITY = "CHANGE_LAYER_OPACITY"
export const SELECT_VISIBLE_MUSEOVIRASTO_LAYERS =
  "SELECT_VISIBLE_MUSEOVIRASTO_LAYERS"
export const SELECT_VISIBLE_AHVENANMAA_LAYERS =
  "SELECT_VISIBLE_AHVENANMAA_LAYERS"
export const SELECT_VISIBLE_MODELS_LAYERS = "SELECT_VISIBLE_MODELS_LAYERS"
export const SELECT_VISIBLE_HELSINKI_LAYERS = "SELECT_VISIBLE_HELSINKI_LAYERS"
export const SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS =
  "SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS"
export const SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE =
  "SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE"
export const SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING =
  "SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING"
export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE"
export const SHOW_LOADING_ANIMATION = "SHOW_LOADING_ANIMATION"
export const SHOW_PAGE = "SHOW_PAGE"

export interface ZoomInAction {
  type: typeof ZOOM_IN
}

export interface ZoomOutAction {
  type: typeof ZOOM_OUT
}

export interface CenterMapToCurrentPositionAction {
  type: typeof CENTER_MAP_TO_CURRENT_POSITION
}

export interface FetchDataLatestUpdateDatesAction {
  type: typeof FETCH_DATA_LATESTS_UPDATE_DATES
}

export interface FetchDataLatestUpdateDatesCompleteAction {
  type: typeof FETCH_DATA_LATESTS_UPDATE_DATES_COMPLETE
  payload: DataLatestUpdateDates
}

export interface SearchFeaturesAction {
  type: typeof SEARCH_FEATURES
  searchText: string
}

export interface SearchFeaturesCompleteAction {
  type: typeof SEARCH_FEATURES_COMPLETE
  searchResultFeatures: Array<ArgisFeature>
}

export interface ClickedMapFeatureIdentificationCompleteAction {
  type: typeof CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE
  payload: SelectedFeaturesOnMap
}

export interface SelectVisibleMaanmittauslaitosLayerAction {
  type: typeof SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER
  layer: MaanmittauslaitosLayer
}

export interface SelectVisibleGTKLayersAction {
  type: typeof SELECT_VISIBLE_GTK_LAYERS
  layers: Array<GtkLayer>
}

export interface ChangeLayerOpacityAction {
  type: typeof CHANGE_LAYER_OPACITY
  opacity: number
  layerGroup: LayerGroup
}

export interface SelectVisibleMuseovirastoLayersAction {
  type: typeof SELECT_VISIBLE_MUSEOVIRASTO_LAYERS
  layers: Array<MuseovirastoLayer>
}

export interface SelectVisibleAhvenanmaaLayersAction {
  type: typeof SELECT_VISIBLE_AHVENANMAA_LAYERS
  layers: Array<AhvenanmaaLayer>
}

export interface SelectVisibleHelsinkiLayersAction {
  type: typeof SELECT_VISIBLE_HELSINKI_LAYERS
  layers: Array<HelsinkiLayer>
}

export interface SelectVisibleModelsLayersAction {
  type: typeof SELECT_VISIBLE_MODELS_LAYERS
  layers: Array<ModelLayer>
}

export interface SelectVisibleMaisemanMuistiLayersAction {
  type: typeof SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS
  layers: Array<MaisemanMuistiLayer>
}

export interface SelectVisibleMuinaisjäännösTypeAction {
  type: typeof SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE
  types: Array<MuinaisjaannosTyyppi>
}

export interface SelectVisibleMuinaisjäännösDatingAction {
  type: typeof SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING
  datings: Array<MuinaisjaannosAjoitus>
}

export interface ChangeLanguageAction {
  type: typeof CHANGE_LANGUAGE
  language: Language
}

export interface ShowLoadingAnimationAction {
  type: typeof SHOW_LOADING_ANIMATION
  show: boolean
}

export interface ShowPageAction {
  type: typeof SHOW_PAGE
  pageId?: PageId
}

export type ActionTypes =
  | ZoomInAction
  | ZoomOutAction
  | CenterMapToCurrentPositionAction
  | FetchDataLatestUpdateDatesAction
  | FetchDataLatestUpdateDatesCompleteAction
  | SearchFeaturesAction
  | SearchFeaturesCompleteAction
  | ClickedMapFeatureIdentificationCompleteAction
  | SelectVisibleMaanmittauslaitosLayerAction
  | SelectVisibleGTKLayersAction
  | ChangeLayerOpacityAction
  | SelectVisibleMuseovirastoLayersAction
  | SelectVisibleAhvenanmaaLayersAction
  | SelectVisibleHelsinkiLayersAction
  | SelectVisibleModelsLayersAction
  | SelectVisibleMaisemanMuistiLayersAction
  | SelectVisibleMuinaisjäännösTypeAction
  | SelectVisibleMuinaisjäännösDatingAction
  | ChangeLanguageAction
  | ShowLoadingAnimationAction
  | ShowPageAction
