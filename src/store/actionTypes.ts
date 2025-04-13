import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  LayerGroup,
  MaanmittauslaitosLayer,
  MaanmittauslaitosVanhatKartatLayer,
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
  SET_MAP_LOCATION_AND_SHOW_SELECTED_MARKER = "SET_MAP_LOCATION_AND_SHOW_SELECTED_MARKER",
  SEARCH_FEATURES = "SEARCH_FEATURES",
  SEARCH_FEATURES_COMPLETE = "SEARCH_FEATURES_COMPLETE",
  CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE = "CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE",
  SELECT_VISIBLE_LAYERS = "SELECT_VISIBLE_LAYERS",
  CHANGE_LAYER_OPACITY = "CHANGE_LAYER_OPACITY",
  ENABLE_LAYER_GROUP = "ENABLE_LAYER_GROUP",
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE = "SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE",
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING = "SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
  SHOW_LOADING_ANIMATION = "SHOW_LOADING_ANIMATION",
  SHOW_PAGE = "SHOW_PAGE",
  ZOOM = "ZOOM"
}

export interface ZoomAction {
  type: ActionTypeEnum.ZOOM
  zoomDirection: "in" | "out"
}

export interface CenterMapToCurrentPositionAction {
  type: ActionTypeEnum.CENTER_MAP_TO_CURRENT_POSITION
}

export interface SetMapLocatoinAndShowSelectedMarkerAction {
  type: ActionTypeEnum.SET_MAP_LOCATION_AND_SHOW_SELECTED_MARKER
  coordinates: [number, number]
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

export type SelectVisibleLayersAction =
  | SelectVisibleMaanmittauslaitosLayerAction
  | SelectVisibleMaanmittauslaitosVanhatKartatLayerAction
  | SelectVisibleGTKLayersAction
  | SelectVisibleMuseovirastoLayersAction
  | SelectVisibleAhvenanmaaLayersAction
  | SelectVisibleHelsinkiLayersAction
  | SelectVisibleModelsLayersAction
  | SelectVisibleMaisemanMuistiLayersAction

interface SelectVisibleMaanmittauslaitosLayerAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Maanmittauslaitos
  layer: MaanmittauslaitosLayer
}

interface SelectVisibleMaanmittauslaitosVanhatKartatLayerAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.MaanmittauslaitosVanhatKartat
  layers: Array<MaanmittauslaitosVanhatKartatLayer>
}

interface SelectVisibleGTKLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.GTK
  layers: Array<GtkLayer>
}

interface SelectVisibleMuseovirastoLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Museovirasto
  layers: Array<MuseovirastoLayer>
}

interface SelectVisibleAhvenanmaaLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Ahvenanmaa
  layers: Array<AhvenanmaaLayer>
}

interface SelectVisibleHelsinkiLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Helsinki
  layers: Array<HelsinkiLayer>
}

interface SelectVisibleModelsLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Models
  layers: Array<ModelLayer>
}

interface SelectVisibleMaisemanMuistiLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.MaisemanMuisti
  layers: Array<MaisemanMuistiLayer>
}

export interface ChangeLayerOpacityAction {
  type: ActionTypeEnum.CHANGE_LAYER_OPACITY
  opacity: number
  layerGroup: LayerGroup
}

export interface EnableLayerGroupAction {
  type: ActionTypeEnum.ENABLE_LAYER_GROUP
  enabled: boolean
  layerGroup: LayerGroup
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
  | SetMapLocatoinAndShowSelectedMarkerAction
  | SearchFeaturesAction
  | SearchFeaturesCompleteAction
  | ClickedMapFeatureIdentificationCompleteAction
  | ChangeLayerOpacityAction
  | EnableLayerGroupAction
  | SelectVisibleLayersAction
  | SelectVisibleMuinaisjäännösTypeAction
  | SelectVisibleMuinaisjäännösDatingAction
  | ChangeLanguageAction
  | ShowLoadingAnimationAction
  | ShowPageAction
  | ZoomAction
