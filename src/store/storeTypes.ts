import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit"
import { ModelFeatureProperties } from "../common/3dModels.types"
import { GeoJSONFeature } from "../common/geojson.types"
import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MaanmittauslaitosLayer,
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
  features: Array<MapFeature>
  models: Array<GeoJSONFeature<ModelFeatureProperties>>
  maisemanMuistiFeatures: Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
}

export interface Settings {
  concurrentPendingJobsCounter: number
  showLoadingAnimation: boolean
  visiblePage?: PageId
  selectedFeaturesOnMap: SelectedFeaturesOnMap
  search: {
    features: Array<MapFeature>
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
  museovirasto: {
    selectedLayers: Array<MuseovirastoLayer>
    selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
    selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
    url: {
      wms: string
      wfs: string
    }
    opacity: number
  }
  ahvenanmaa: {
    selectedLayers: Array<AhvenanmaaLayer>
    url: {
      export: string
      identify: string
      find: string
      typeAndDating: string
    }
    opacity: number
  }
  models: {
    selectedLayers: Array<ModelLayer>
    url: {
      geojson: string
    }
  }
  maisemanMuisti: {
    selectedLayers: Array<MaisemanMuistiLayer>
    url: {
      geojson: string
    }
  }
  gtk: {
    selectedLayers: Array<GtkLayer>
    url: {
      export: string
    }
    opacity: number
  }
  helsinki: {
    selectedLayers: Array<HelsinkiLayer>
    url: {
      wms: string
    }
    opacity: number
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
