import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  Language,
  HelsinkiLayer
} from "../common/types"
import { Settings } from "./storeTypes"

const getInitialLang = (): Language => {
  const lang = navigator.language?.substr(0, 2)
  if (Object.values(Language).some((v) => v === lang)) {
    return lang as Language
  }
  return Language.FI
}

export const initialSettings: Settings = {
  showLoadingAnimation: false,
  visiblePage: undefined,
  selectedFeaturesOnMap: {
    features: [],
    models: [],
    maisemanMuistiFeatures: [],
    maalinnoitusFeatures: []
  },
  search: {
    searchResults: undefined
  },
  dataLatestUpdateDates: undefined,
  initialMapZoom: 8,
  language: getInitialLang(),
  maanmittauslaitos: {
    selectedLayer: MaanmittauslaitosLayer.Taustakartta,
    url: {
      WMTSCapabilities:
        "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml"
    },
    /**
     * This API key is just for avoin-karttakuva.maanmittauslaitos.fi
     */
    apiKey: "0593cc3c-e12f-489c-b8d6-c9a6965b4bfe"
  },
  museovirasto: {
    selectedLayers: Object.values(MuseovirastoLayer),
    selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
    selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
    url: {
      export:
        "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/export",
      identify:
        "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/identify",
      find: "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/find",
      /**
       * Custom reverse proxy is required to add Cross origin policy headers to the request so
       * that browser can fetch the XML file from https://paikkatieto.nba.fi/aineistot/MV_inspire_atom.xml
       */
      updateDate: "https://dkfgv6jxivsxz.cloudfront.net/MV_inspire_atom.xml"
    },
    opacity: 0.7
  },
  ahvenanmaa: {
    selectedLayers: Object.values(AhvenanmaaLayer),
    url: {
      export:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/export",
      identify:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/identify",
      find: "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/find",
      typeAndDating:
        "https://opendata.arcgis.com/datasets/4fa828b46a0740b18960cf3e91d35431_2.geojson",
      forminnenUpdateDate:
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Afornminnen-1",
      maritimtKulturarvUpdateDate:
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Amaritimt-kulturarv"
    },
    opacity: 0.7
  },
  models: {
    selectedLayers: Object.values(ModelLayer),
    url: {
      geojson: "./3d/3d.json"
    }
  },
  maisemanMuisti: {
    selectedLayers: Object.values(MaisemanMuistiLayer),
    url: {
      geojson: "./maisemanmuisti/maisemanmuisti.json"
    }
  },
  gtk: {
    selectedLayers: [],
    url: {
      export:
        "https://gtkdata.gtk.fi/arcgis/rest/services/Rajapinnat/GTK_Maapera_WMS/MapServer/export"
    },
    opacity: 0.7
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
    opacity: 0.8
  }
}
