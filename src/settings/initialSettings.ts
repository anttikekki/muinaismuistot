import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  Settings,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  Language
} from "../common/types"

const getInitialLang = (): Language => {
  const lang = navigator.language?.substr(0, 2)
  if (Object.values(Language).some((v) => v === lang)) {
    return lang as Language
  }
  return Language.FI
}

export const initialSettings: Settings = {
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
      find:
        "https://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer/find",
      /**
       * Custom reverse proxy is required to add Cross origin policy headers to the request so
       * that browser can fetch the XML file from https://paikkatieto.nba.fi/aineistot/MV_inspire_atom.xml
       */
      updateDate: "https://dkfgv6jxivsxz.cloudfront.net/MV_inspire_atom.xml"
    }
  },
  ahvenanmaa: {
    selectedLayers: Object.values(AhvenanmaaLayer),
    url: {
      export:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/export",
      identify:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/identify",
      find:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/find",
      typeAndDating:
        "https://opendata.arcgis.com/datasets/4fa828b46a0740b18960cf3e91d35431_2.geojson",
      forminnenUpdateDate:
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Afornminnen",
      maritimtKulturarvUpdateDate:
        "https://opendata.arcgis.com/api/v3/datasets?filter%5Bslug%5D=aland%3A%3Amaritimt-kulturarv-vrak"
    }
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
  }
}
