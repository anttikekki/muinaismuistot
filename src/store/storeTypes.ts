import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit"
import { ModelFeature } from "../common/3dModels.types"
import {
  AhvenanmaaLayer,
  FeatureLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer,
  MaannousuInfoLayer,
  MaannousuInfoLayerIndex,
  MuseovirastoLayer
} from "../common/layers.types"
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

export interface IdentifiedMapFeatures {
  requestTimestamp: number
  features: MapFeature[]
  models: ModelFeature[]
}

export type LinkedFeature = {
  /** [x, y] */
  coordinates: [number, number]
  layer?: FeatureLayer
  /**
   * Featuren rekisteri-id. Tämä ei ole uniikki id.
   */
  id?: string
  name?: string
}

export interface Settings {
  concurrentPendingJobsCounter: number
  showLoadingAnimation: boolean
  visiblePage?: PageId
  identifiedMapFeatures?: IdentifiedMapFeatures
  search: {
    features: MapFeature[]
  }
  linkedFeature?: LinkedFeature
  initialMapZoom: number
  language: Language
  maanmittauslaitos: {
    basemap: {
      selectedLayer: MMLPohjakarttaLayer
      url: {
        WMTSCapabilities: string
      }
      apiKey: string
      enabled: boolean
    }
    vanhatKartat: {
      selectedLayers: MMLVanhatKartatLayer[]
      url: {
        wms: string
      }
      opacity: number
      enabled: boolean
    }
  }
  maannousuInfo: {
    selectedLayer: MaannousuInfoLayer
    url: {
      geotiff: string
    }
    placement: MaannousuInfoLayerIndex
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
    url: {
      geojson: string
    }
    enabled: boolean
  }
  maisemanMuisti: {
    url: {
      geojson: string
    }
    enabled: boolean
  }
  viabundus: {
    selectedYear: number
    url: {
      geojson: string
    }
    opacity: number
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
