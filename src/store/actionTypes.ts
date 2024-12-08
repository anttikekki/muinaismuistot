import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  LayerGroup,
  MaanmittauslaitosLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import { MapFeature } from "../common/mapFeature.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { PageId, SelectedFeaturesOnMap } from "./storeTypes"

export enum ActionTypeEnum {
  CENTER_MAP_TO_CURRENT_POSITION = "CENTER_MAP_TO_CURRENT_POSITION",
  SEARCH_FEATURES = "SEARCH_FEATURES",
  SEARCH_FEATURES_COMPLETE = "SEARCH_FEATURES_COMPLETE",
  CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE = "CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE",
  SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER = "SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER",
  SELECT_VISIBLE_GTK_LAYERS = "SELECT_VISIBLE_GTK_LAYERS",
  CHANGE_LAYER_OPACITY = "CHANGE_LAYER_OPACITY",
  SELECT_VISIBLE_MUSEOVIRASTO_LAYERS = "SELECT_VISIBLE_MUSEOVIRASTO_LAYERS",
  SELECT_VISIBLE_AHVENANMAA_LAYERS = "SELECT_VISIBLE_AHVENANMAA_LAYERS",
  SELECT_VISIBLE_MODELS_LAYERS = "SELECT_VISIBLE_MODELS_LAYERS",
  SELECT_VISIBLE_HELSINKI_LAYERS = "SELECT_VISIBLE_HELSINKI_LAYERS",
  SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS = "SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS",
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE = "SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE",
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING = "SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
  SHOW_LOADING_ANIMATION = "SHOW_LOADING_ANIMATION",
  SHOW_PAGE = "SHOW_PAGE"
}

export interface CenterMapToCurrentPositionAction {
  type: ActionTypeEnum.CENTER_MAP_TO_CURRENT_POSITION
}

export interface SearchFeaturesAction {
  type: ActionTypeEnum.SEARCH_FEATURES
  searchText: string
}

export interface SearchFeaturesCompleteAction {
  type: ActionTypeEnum.SEARCH_FEATURES_COMPLETE
  searchResultFeatures: Array<MapFeature>
}

export interface ClickedMapFeatureIdentificationCompleteAction {
  type: ActionTypeEnum.CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE
  payload: SelectedFeaturesOnMap
}

export interface SelectVisibleMaanmittauslaitosLayerAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MAANMITTAUSLAITOS_LAYER
  layer: MaanmittauslaitosLayer
}

export interface SelectVisibleGTKLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_GTK_LAYERS
  layers: Array<GtkLayer>
}

export interface ChangeLayerOpacityAction {
  type: ActionTypeEnum.CHANGE_LAYER_OPACITY
  opacity: number
  layerGroup: LayerGroup
}

export interface SelectVisibleMuseovirastoLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MUSEOVIRASTO_LAYERS
  layers: Array<MuseovirastoLayer>
}

export interface SelectVisibleAhvenanmaaLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_AHVENANMAA_LAYERS
  layers: Array<AhvenanmaaLayer>
}

export interface SelectVisibleHelsinkiLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_HELSINKI_LAYERS
  layers: Array<HelsinkiLayer>
}

export interface SelectVisibleModelsLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MODELS_LAYERS
  layers: Array<ModelLayer>
}

export interface SelectVisibleMaisemanMuistiLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MAISEMAN_MUISTI_LAYERS
  layers: Array<MaisemanMuistiLayer>
}

export interface SelectVisibleMuinaisjäännösTypeAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE
  types: Array<MuinaisjaannosTyyppi>
}

export interface SelectVisibleMuinaisjäännösDatingAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING
  datings: Array<MuinaisjaannosAjoitus>
}

export interface ChangeLanguageAction {
  type: ActionTypeEnum.CHANGE_LANGUAGE
  language: Language
}

export interface ShowLoadingAnimationAction {
  type: ActionTypeEnum.SHOW_LOADING_ANIMATION
  show: boolean
}

export interface ShowPageAction {
  type: ActionTypeEnum.SHOW_PAGE
  pageId?: PageId
}

export type ActionTypes =
  | CenterMapToCurrentPositionAction
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
