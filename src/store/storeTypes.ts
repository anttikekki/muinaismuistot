import {
  AhvenanmaaLayer,
  ArgisFeature,
  DataLatestUpdateDates,
  GeoJSONFeature,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MaalinnoitusFeature,
  MaankohoaminenLayer,
  MaanmittauslaitosLayer,
  MaisemanMuistiFeatureProperties,
  MaisemanMuistiLayer,
  ModelFeatureProperties,
  ModelLayer,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoLayer
} from "../common/types"

export enum PageId {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

export interface SelectedFeaturesOnMap {
  features: Array<ArgisFeature>
  models: Array<GeoJSONFeature<ModelFeatureProperties>>
  maisemanMuistiFeatures: Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
  maalinnoitusFeatures: Array<MaalinnoitusFeature>
}

export interface Settings {
  showLoadingAnimation: boolean
  visiblePage?: PageId
  selectedFeaturesOnMap: SelectedFeaturesOnMap
  search: {
    searchResults?: Array<ArgisFeature>
  }
  dataLatestUpdateDates?: DataLatestUpdateDates
  initialMapZoom: number
  language: Language
  maanmittauslaitos: {
    selectedLayer: MaanmittauslaitosLayer
    url: {
      WMTSCapabilities: string
    }
    apiKey: string
  }
  maankohoaminen: {
    selectedLayer: MaankohoaminenLayer | undefined
    url: {
      wms: string
    }
    opacity: number
  }
  museovirasto: {
    selectedLayers: Array<MuseovirastoLayer>
    selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
    selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
    url: {
      export: string
      identify: string
      find: string
      updateDate: string
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
      forminnenUpdateDate: string
      maritimtKulturarvUpdateDate: string
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
