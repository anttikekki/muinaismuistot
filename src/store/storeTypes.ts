import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit"
import { ModelFeatureProperties } from "../common/3dModels.types"
import { GeoJSONFeature } from "../common/geojson.types"
import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MaanmittauslaitosLayer,
  MaanmittauslaitosVanhatKartatLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import { MaisemanMuistiFeatureProperties } from "../common/maisemanMuisti.types"
import { MapFeature } from "../common/mapFeature.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { ActionTypes } from "./actionTypes"

export enum PageId {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

export interface SelectedFeaturesOnMap {
  features: MapFeature[]
  models: GeoJSONFeature<ModelFeatureProperties>[]
  maisemanMuistiFeatures: GeoJSONFeature<MaisemanMuistiFeatureProperties>[]
}

export interface Settings {
  concurrentPendingJobsCounter: number
  showLoadingAnimation: boolean
  visiblePage?: PageId
  selectedFeaturesOnMap: SelectedFeaturesOnMap
  search: {
    features: MapFeature[]
  }
  initialMapZoom: number
  language: Language
  maanmittauslaitos: {
    selectedLayer: MaanmittauslaitosLayer
    url: {
      WMTSCapabilities: string
    }
    apiKey: string
  }
  maanmittauslaitosVanhatKartat: {
    selectedLayers: MaanmittauslaitosVanhatKartatLayer[]
    url: {
      wms: string
    }
    opacity: number
    enabled: boolean
  }
  museovirasto: {
    selectedLayers: MuseovirastoLayer[]
    selectedMuinaisjaannosTypes: MuinaisjaannosTyyppi[]
    selectedMuinaisjaannosDatings: MuinaisjaannosAjoitus[]
    url: {
      wms: string
      wfs: string
    }
    opacity: number
    enabled: boolean
  }
  ahvenanmaa: {
    selectedLayers: AhvenanmaaLayer[]
    url: {
      export: string
      identify: string
      find: string
      typeAndDating: string
    }
    opacity: number
    enabled: boolean
  }
  models: {
    selectedLayers: ModelLayer[]
    url: {
      geojson: string
    }
    enabled: boolean
  }
  maisemanMuisti: {
    selectedLayers: MaisemanMuistiLayer[]
    url: {
      geojson: string
    }
    enabled: boolean
  }
  gtk: {
    selectedLayers: GtkLayer[]
    url: {
      export: string
    }
    opacity: number
    enabled: boolean
  }
  helsinki: {
    selectedLayers: HelsinkiLayer[]
    url: {
      wms: string
    }
    opacity: number
    enabled: boolean
  }
}

export type RootState = Settings
export type AppDispatch = ThunkDispatch<Settings, undefined, ActionTypes>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  ActionTypes
>
