import {
  AhvenanmaaLayer,
  HelsinkiLayer,
  Language,
  MaanmittauslaitosLayer,
  MaanmittauslaitosVanhatKartatLayer,
  MaisemanMuistiLayer,
  ModelLayer,
  MuseovirastoLayer
} from "../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../common/museovirasto.types"
import { Settings } from "./storeTypes"

const getInitialLang = (): Language => {
  const lang = navigator.language?.substr(0, 2)
  if (Object.values(Language).some((v) => v === lang)) {
    return lang as Language
  }
  return Language.FI
}

export const initialSettings: Settings = {
  concurrentPendingJobsCounter: 0,
  showLoadingAnimation: false,
  visiblePage: undefined,
  selectedFeaturesOnMap: {
    features: [],
    models: [],
    maisemanMuistiFeatures: []
  },
  search: {
    features: []
  },
  initialMapZoom: 8,
  language: getInitialLang(),
  maanmittauslaitos: {
    selectedLayer: MaanmittauslaitosLayer.Taustakartta,
    url: {
      WMTSCapabilities:
        "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml"
    },
    /**
     * This API key is just for the free avoin-karttakuva.maanmittauslaitos.fi
     */
    apiKey: "0593cc3c-e12f-489c-b8d6-c9a6965b4bfe"
  },
  maanmittauslaitosVanhatKartat: {
    selectedLayers: Object.values([
      MaanmittauslaitosVanhatKartatLayer.Venäläinen_topografinen_kartta_1870_1944
    ]),
    url: {
      wms: "https://paituli.csc.fi/geoserver/paituli/wms"
    },
    opacity: 1,
    enabled: false
  },
  museovirasto: {
    selectedLayers: Object.values(MuseovirastoLayer),
    selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
    selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
    url: {
      wms: "https://geoserver.museovirasto.fi/geoserver/rajapinta_suojellut/wms",
      wfs: "https://geoserver.museovirasto.fi/geoserver/rajapinta_suojellut/wfs"
    },
    opacity: 0.7,
    enabled: true
  },
  ahvenanmaa: {
    selectedLayers: Object.values(AhvenanmaaLayer),
    url: {
      export:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer",
      identify:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/identify",
      find: "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/find",
      typeAndDating:
        "https://opendata.arcgis.com/datasets/4fa828b46a0740b18960cf3e91d35431_2.geojson"
    },
    opacity: 0.7,
    enabled: true
  },
  models: {
    selectedLayers: Object.values(ModelLayer),
    url: {
      geojson: "./3d/3d.json"
    },
    enabled: true
  },
  maisemanMuisti: {
    selectedLayers: Object.values(MaisemanMuistiLayer),
    url: {
      geojson: "./maisemanmuisti/maisemanmuisti.json"
    },
    enabled: true
  },
  gtk: {
    selectedLayers: [],
    url: {
      export:
        "https://gtkdata.gtk.fi/arcgis/rest/services/Rajapinnat/GTK_Maapera_WMS/MapServer"
    },
    opacity: 0.7,
    enabled: false
  },
  helsinki: {
    selectedLayers: Object.values([
      HelsinkiLayer.Maalinnoitus_karttatekstit,
      HelsinkiLayer.Maalinnoitus_kohteet,
      HelsinkiLayer.Maalinnoitus_yksikot
    ]),
    url: {
      wms: "https://kartta.hel.fi/ws/geoserver/avoindata/wms"
    },
    opacity: 0.8,
    enabled: true
  }
}
