import {
  AhvenanmaaLayer,
  GtkLayer,
  HelsinkiLayer,
  Language,
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer,
  MaannousuInfoLayer,
  MaannousuInfoLayerIndex,
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
  linkedFeature: undefined,
  identifiedMapFeatures: undefined,
  search: {
    features: []
  },
  initialMapZoom: 8,
  language: getInitialLang(),
  maanmittauslaitos: {
    basemap: {
      selectedLayer: MMLPohjakarttaLayer.Taustakartta,
      url: {
        WMTSCapabilities:
          "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml"
      },
      /**
       * This API key is just for the free avoin-karttakuva.maanmittauslaitos.fi
       */
      apiKey: "0593cc3c-e12f-489c-b8d6-c9a6965b4bfe",
      enabled: true
    },
    vanhatKartat: {
      selectedLayers: [
        MMLVanhatKartatLayer.Venäläinen_topografinen_kartta_1870_1944
      ],
      url: {
        wms: "https://paituli.csc.fi/geoserver/paituli/wms"
      },
      opacity: 1,
      enabled: false
    }
  },
  maannousuInfo: {
    selectedLayer: MaannousuInfoLayer.Vuosi6000eaa,
    url: {
      geotiff: "https://maannousu.info/api/v2"
    },
    placement: MaannousuInfoLayerIndex.Bottom,
    opacity: 1,
    enabled: false
  },
  museovirasto: {
    selectedLayers: [
      MuseovirastoLayer.Muinaisjaannokset_piste,
      MuseovirastoLayer.Muinaisjaannokset_alue,
      MuseovirastoLayer.Suojellut_rakennukset_piste,
      MuseovirastoLayer.Suojellut_rakennukset_alue,
      MuseovirastoLayer.RKY_alue,
      MuseovirastoLayer.RKY_piste,
      MuseovirastoLayer.RKY_viiva,
      MuseovirastoLayer.Maailmanperinto_piste,
      MuseovirastoLayer.Maailmanperinto_alue,
      MuseovirastoLayer.Muu_kulttuuriperintokohde_alue,
      MuseovirastoLayer.Muu_kulttuuriperintokohde_piste,
      MuseovirastoLayer.VARK_alueet,
      MuseovirastoLayer.VARK_pisteet,
      MuseovirastoLayer.Löytöpaikka_piste,
      MuseovirastoLayer.Löytöpaikka_alue
    ],
    selectedMuinaisjaannosTypes: Object.values(MuinaisjaannosTyyppi),
    selectedMuinaisjaannosDatings: Object.values(MuinaisjaannosAjoitus),
    url: {
      // Proxies to geoserver.museovirasto.fi. Adds 24h server WMS tile cache and 2h browser cache.
      wms: "https://museovirasto-wms-proxy.muinaismuistot.info/geoserver/ows",
      wfs: "https://geoserver.museovirasto.fi/geoserver/ows"
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
    url: {
      geojson: "./3d/3d.json"
    },
    enabled: true
  },
  maisemanMuisti: {
    url: {
      geojson: "./maisemanmuisti/maisemanmuisti.json"
    },
    enabled: true
  },
  viabundus: {
    selectedYear: 1650,
    url: {
      geojson: "./viabundus/Viabundus-finland.geojson"
    },
    opacity: 1,
    enabled: false
  },
  gtk: {
    selectedLayers: [GtkLayer.muinaisrannat],
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
