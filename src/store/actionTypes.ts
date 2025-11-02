import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  LayerGroup,
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer,
  MaannousuInfoLayer,
  MaannousuInfoLayerIndex,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import { MapFeature } from "../common/mapFeature.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { IdentifiedMapFeatures, LinkedFeature, PageId } from "./storeTypes"

export enum ActionTypeEnum {
  FIRST_USER_LOCATION_DETECTION_COMPLETE = "FIRST_USER_LOCATION_DETECTION_COMPLETE",
  CENTER_MAP_TO_CURRENT_POSITION = "CENTER_MAP_TO_CURRENT_POSITION",
  SET_LINKED_FEATURE = "SET_LINKED_FEATURE",
  CENTER_MAP_TO_LINKED_FEATURE = "CENTER_MAP_TO_LINKED_FEATURE",
  SEARCH_FEATURES = "SEARCH_FEATURES",
  SEARCH_FEATURES_COMPLETE = "SEARCH_FEATURES_COMPLETE",
  IDENTIFY_MAP_FEATURES_ON_COORDINATE = "IDENTIFY_MAP_FEATURES_ON_COORDINATE",
  MAP_FEATURE_IDENTIFICATION_COMPLETE = "MAP_FEATURE_IDENTIFICATION_COMPLETE",
  SELECT_VISIBLE_LAYERS = "SELECT_VISIBLE_LAYERS",
  CHANGE_LAYER_OPACITY = "CHANGE_LAYER_OPACITY",
  ENABLE_LAYER_GROUP = "ENABLE_LAYER_GROUP",
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE = "SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE",
  SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING = "SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
  SHOW_LOADING_ANIMATION = "SHOW_LOADING_ANIMATION",
  SHOW_PAGE = "SHOW_PAGE",
  ZOOM = "ZOOM",
  ZOOM_CHANGED = "ZOOM_CHANGED",
  MAP_CENTER_CHANGED = "MAP_CENTER_CHANGED",
  MOVE_MAANNOUSU_LAYER = "MOVE_MAANNOUSU_LAYER",
  SELECT_VIABUNDUS_YEAR = "SELECT_VIABUNDUS_YEAR"
}

export interface ZoomAction {
  type: ActionTypeEnum.ZOOM
  zoomDirection: "in" | "out"
}

export interface ZoomChangedAction {
  type: ActionTypeEnum.ZOOM_CHANGED
  zoom: number
}

export interface MapCenterChangedAction {
  type: ActionTypeEnum.MAP_CENTER_CHANGED
  coordinates: [number, number] // [x, y]
}

export interface FirstUserLocationDetectionComplete {
  type: ActionTypeEnum.FIRST_USER_LOCATION_DETECTION_COMPLETE
}

export interface CenterMapToCurrentPositionAction {
  type: ActionTypeEnum.CENTER_MAP_TO_CURRENT_POSITION
}

export interface SetLinkedFeature {
  type: ActionTypeEnum.SET_LINKED_FEATURE
  linkedFeature: LinkedFeature | undefined
}

export interface CenterMapToLinkedFeature {
  type: ActionTypeEnum.CENTER_MAP_TO_LINKED_FEATURE
}

export interface SearchFeaturesAction {
  type: ActionTypeEnum.SEARCH_FEATURES
  searchText: string
}

export interface SearchFeaturesCompleteAction {
  type: ActionTypeEnum.SEARCH_FEATURES_COMPLETE
  searchResultFeatures: MapFeature[]
}

export interface IdentifyMapFeaturesOnCoordinateAction {
  type: ActionTypeEnum.IDENTIFY_MAP_FEATURES_ON_COORDINATE
  requestTimestamp: number
  coordinates: [number, number] // [x, y]
}

export interface MapFeatureIdentificationCompleteAction {
  type: ActionTypeEnum.MAP_FEATURE_IDENTIFICATION_COMPLETE
  identifiedMapFeatures: IdentifiedMapFeatures
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
  | SelectVisibleMaannousuInfoLayersAction

interface SelectVisibleMaanmittauslaitosLayerAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.MMLPohjakartta
  layer: MMLPohjakarttaLayer
}

interface SelectVisibleMaanmittauslaitosVanhatKartatLayerAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.MMLVanhatKartat
  layers: MMLVanhatKartatLayer[]
}

interface SelectVisibleGTKLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.GTK
  layers: GtkLayer[]
}

interface SelectVisibleMuseovirastoLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Museovirasto
  layers: MuseovirastoLayer[]
}

interface SelectVisibleAhvenanmaaLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Ahvenanmaa
  layers: AhvenanmaaLayer[]
}

interface SelectVisibleHelsinkiLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Helsinki
  layers: HelsinkiLayer[]
}

interface SelectVisibleModelsLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.Models
  layers: ModelLayer[]
}

interface SelectVisibleMaisemanMuistiLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.MaisemanMuisti
  layers: MaisemanMuistiLayer[]
}

interface SelectVisibleMaannousuInfoLayersAction {
  type: ActionTypeEnum.SELECT_VISIBLE_LAYERS
  layerGroup: LayerGroup.MaannousuInfo
  layer: MaannousuInfoLayer
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
  types: MuinaisjaannosTyyppi[]
}

export interface SelectVisibleMuinaisjäännösDatingAction {
  type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING
  datings: MuinaisjaannosAjoitus[]
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

export interface MoveMaannousuLayerAction {
  type: ActionTypeEnum.MOVE_MAANNOUSU_LAYER
  placement: MaannousuInfoLayerIndex
}

export interface SelectViabundusYearAction {
  type: ActionTypeEnum.SELECT_VIABUNDUS_YEAR
  year: number
}

export type ActionTypes =
  | FirstUserLocationDetectionComplete
  | CenterMapToCurrentPositionAction
  | SetLinkedFeature
  | CenterMapToLinkedFeature
  | SearchFeaturesAction
  | SearchFeaturesCompleteAction
  | IdentifyMapFeaturesOnCoordinateAction
  | MapFeatureIdentificationCompleteAction
  | ChangeLayerOpacityAction
  | EnableLayerGroupAction
  | SelectVisibleLayersAction
  | SelectVisibleMuinaisjäännösTypeAction
  | SelectVisibleMuinaisjäännösDatingAction
  | ChangeLanguageAction
  | ShowLoadingAnimationAction
  | ShowPageAction
  | ZoomAction
  | ZoomChangedAction
  | MapCenterChangedAction
  | MoveMaannousuLayerAction
  | SelectViabundusYearAction
