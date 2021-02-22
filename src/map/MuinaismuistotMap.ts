import "ol/ol.css"
import proj4 from "proj4"
import Map from "ol/Map"
import View from "ol/View"
import { register as registerProj4 } from "ol/proj/proj4"
import { get as getProjection } from "ol/proj"
import Collection from "ol/Collection"
import { ScaleLine } from "ol/control"
import Geolocation from "ol/Geolocation"
import MaanmittauslaitosTileLayer from "./layer/MaanmittauslaitosTileLayer"
import AhvenanmaaTileLayer from "./layer/AhvenanmaaTileLayer"
import MuseovirastoTileLayer from "./layer/MuseovirastoTileLayer"
import CurrentPositionAndSelectedLocationMarkerLayer from "./layer/CurrentPositionAndSelectedLocationMarkerLayer"
import {
  ArgisFeature,
  DataLatestUpdateDates,
  ModelFeatureProperties,
  LayerGroup,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties,
  MuseovirastoLayer
} from "../common/types"
import MapBrowserEvent from "ol/MapBrowserEvent"
import { Coordinate } from "ol/coordinate"
import { Extent } from "ol/extent"
import ModelsLayer from "./layer/ModelsLayer"
import Layer from "ol/layer/Layer"
import Source from "ol/source/Source"
import MaisemanMuistiLayer from "./layer/MaisemanMuistiLayer"
import { Pixel } from "ol/pixel"
import VectorLayer from "ol/layer/Vector"
import GtkTileLayer from "./layer/GtkTileLayer"
import { Settings } from "../store/storeTypes"

export interface MapEventListener {
  featuresSelected: (
    features: Array<ArgisFeature>,
    models: Array<GeoJSONFeature<ModelFeatureProperties>>,
    maisemanMuistiFeatures: Array<
      GeoJSONFeature<MaisemanMuistiFeatureProperties>
    >
  ) => void
  showLoadingAnimation: (show: boolean) => void
  dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => void
}

let map: Map
let view: View
let geolocation: Geolocation | undefined
let maanmittauslaitosTileLayer: MaanmittauslaitosTileLayer
let museovirastoTileLayer: MuseovirastoTileLayer
let ahvenanmaaTileLayer: AhvenanmaaTileLayer
let positionAndSelectedLocation: CurrentPositionAndSelectedLocationMarkerLayer
let modelsLayer: ModelsLayer
let maisemanMuistiLayer: MaisemanMuistiLayer
let gtkLayer: GtkTileLayer
let eventListeners: MapEventListener

export const createMap = (
  initialSettings: Settings,
  listeners: MapEventListener
) => {
  eventListeners = listeners

  proj4.defs(
    "EPSG:3067",
    "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  )
  registerProj4(proj4)

  const extent: Extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
  getProjection("EPSG:3067").setExtent(extent)

  view = new View({
    center: [385249.63630000036, 6672695.7579],
    projection: "EPSG:3067",
    zoom: initialSettings.initialMapZoom,
    enableRotation: false
  })

  const scaleControl = new ScaleLine({
    units: "metric"
  })

  map = new Map({
    target: "map",
    view: view,
    controls: new Collection([scaleControl])
  })

  maanmittauslaitosTileLayer = new MaanmittauslaitosTileLayer(
    initialSettings,
    eventListeners.showLoadingAnimation,
    (mmlMaastokarttaLayer, mmlTaustakarttaLayer, mmlOrtokuvaLayer) => {
      map.getLayers().insertAt(0, mmlMaastokarttaLayer)
      map.getLayers().insertAt(1, mmlTaustakarttaLayer)
      map.getLayers().insertAt(2, mmlOrtokuvaLayer)
    }
  )

  gtkLayer = new GtkTileLayer(
    initialSettings,
    eventListeners.showLoadingAnimation,
    (createdLayer) => {
      map.getLayers().insertAt(3, createdLayer)
    }
  )

  ahvenanmaaTileLayer = new AhvenanmaaTileLayer(
    initialSettings,
    eventListeners.showLoadingAnimation,
    (createdLayer) => {
      map.getLayers().insertAt(4, createdLayer)
    }
  )

  museovirastoTileLayer = new MuseovirastoTileLayer(
    initialSettings,
    eventListeners.showLoadingAnimation,
    (createdLayer) => {
      map.getLayers().insertAt(5, createdLayer)
    }
  )

  maisemanMuistiLayer = new MaisemanMuistiLayer()
  modelsLayer = new ModelsLayer()
  positionAndSelectedLocation = new CurrentPositionAndSelectedLocationMarkerLayer()

  Promise.all([
    maisemanMuistiLayer.createLayer(initialSettings),
    modelsLayer.createLayer(initialSettings)
  ]).then(([maisemanMuistiLayer, modelsLayer]) => {
    map.getLayers().insertAt(6, maisemanMuistiLayer)
    map.getLayers().insertAt(7, modelsLayer)
    map.getLayers().insertAt(8, positionAndSelectedLocation.getLayer())
  })

  map.on("singleclick", loadFeaturesOnClickedCoordinate)
}

const getFeaturesAtPixelAtGeoJsonLayer = <T>(
  pixel: Pixel,
  geoJsonLayer?: VectorLayer
): Array<GeoJSONFeature<T>> => {
  return map
    .getFeaturesAtPixel(pixel, {
      layerFilter: (layer: Layer<Source>) => layer === geoJsonLayer,
      hitTolerance: 10
    })
    .map((feature) => {
      // Convert FeatureLike to GeoJSONFeature
      const extent = feature.getGeometry()?.getExtent()
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [extent![0], extent![1]]
        },
        properties: {
          ...(feature.getProperties() as T)
        }
      }
    })
}

const loadFeaturesOnClickedCoordinate = (e: MapBrowserEvent) => {
  eventListeners.showLoadingAnimation(true)
  const mapSize = map.getSize()
  if (!mapSize) {
    return
  }

  const ahvenanmaaQuery = ahvenanmaaTileLayer.identifyFeaturesAt(
    e.coordinate,
    mapSize,
    map.getView().calculateExtent(mapSize)
  )

  const museovirastoQuery = museovirastoTileLayer.identifyFeaturesAt(
    e.coordinate,
    mapSize,
    map.getView().calculateExtent(mapSize)
  )

  const modelsResult = getFeaturesAtPixelAtGeoJsonLayer<ModelFeatureProperties>(
    e.pixel,
    modelsLayer.getLayer()
  )

  const maisemanMuistiResult = getFeaturesAtPixelAtGeoJsonLayer<MaisemanMuistiFeatureProperties>(
    e.pixel,
    maisemanMuistiLayer.getLayer()
  )

  Promise.all([ahvenanmaaQuery, museovirastoQuery]).then(
    ([ahvenanmaaResult, museovirastoResult]) => {
      eventListeners.showLoadingAnimation(false)
      const allFeatures = ahvenanmaaResult.results
        .concat(museovirastoResult.results)
        .map((f) => modelsLayer.addFeaturesForArgisFeature(f))
        .map((f) => maisemanMuistiLayer.addFeaturesForArgisFeature(f))

      eventListeners.featuresSelected(
        allFeatures,
        modelsResult,
        maisemanMuistiResult.filter((feature) => {
          // Do not show Maiseman muisti feature if there is Argis feature for it in search results
          const id = feature.properties.id.toString()
          return !allFeatures.some(
            (argisFeature) =>
              argisFeature.layerName ===
                MuseovirastoLayer.Muinaisjaannokset_piste &&
              argisFeature.attributes.mjtunnus === id
          )
        })
      )
    }
  )
}

const initGeolocation = () => {
  geolocation = new Geolocation({
    projection: view.getProjection(),
    tracking: true,
    trackingOptions: {
      enableHighAccuracy: true
    }
  })

  geolocation.once("change:position", centerToCurrentPositions)
  geolocation.on("change:position", geolocationChanged)
}

const geolocationChanged = () => {
  const position = geolocation?.getPosition()
  if (position) {
    positionAndSelectedLocation.addCurrentPositionMarker(position)
  }
}

const zoom = (zoomChange: number) => {
  const zoom = view.getZoom()
  if (zoom) {
    view.animate({
      zoom: zoom + zoomChange,
      duration: 250
    })
  }
}

export const selectedFeatureLayersChanged = (
  settings: Settings,
  changedLayerGroup: LayerGroup
): void => {
  switch (changedLayerGroup) {
    case LayerGroup.GTK:
      gtkLayer.selectedGTKLayersChanged(settings)
      break
    case LayerGroup.Museovirasto:
      museovirastoTileLayer.selectedFeatureLayersChanged(settings)
      break
    case LayerGroup.Ahvenanmaa:
      ahvenanmaaTileLayer.selectedFeatureLayersChanged(settings)
      break
    case LayerGroup.Models:
      modelsLayer.selectedFeatureLayersChanged(settings)
      break
    case LayerGroup.MaisemanMuisti:
      maisemanMuistiLayer.selectedFeatureLayersChanged(settings)
      break
  }
}

export const selectedMuinaisjaannosTypesChanged = (
  settings: Settings
): void => {
  museovirastoTileLayer.selectedMuinaisjaannosTypesChanged(settings)
}

export const selectedMuinaisjaannosDatingsChanged = (
  settings: Settings
): void => {
  museovirastoTileLayer.selectedMuinaisjaannosDatingsChanged(settings)
}

export const searchFeaturesFromMapLayers = async (
  searchText: string
): Promise<Array<ArgisFeature>> => {
  eventListeners.showLoadingAnimation(true)
  const ahvenanmaaQuery = ahvenanmaaTileLayer.findFeatures(searchText)
  const museovirastoQuery = museovirastoTileLayer.findFeatures(searchText)

  const [ahvenanmaaResult, museovirastoResult] = await Promise.all([
    ahvenanmaaQuery,
    museovirastoQuery
  ])
  eventListeners.showLoadingAnimation(false)

  return ahvenanmaaResult.results
    .concat(museovirastoResult.results)
    .map((f) => modelsLayer.addFeaturesForArgisFeature(f))
    .map((f) => maisemanMuistiLayer.addFeaturesForArgisFeature(f))
}

export const selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
  maanmittauslaitosTileLayer.selectedMaanmittauslaitosLayerChanged(settings)
}

export const gtkLayerOpacityChanged = (settings: Settings) => {
  gtkLayer.opacityChanged(settings)
}

export const setMapLocation = (coordinates: Coordinate) => {
  view.setCenter(coordinates)
}

export const centerToCurrentPositions = () => {
  if (geolocation && geolocation.getPosition()) {
    const position = geolocation.getPosition()
    view.setCenter(position)
  } else {
    initGeolocation()
  }
}

export const showSelectedLocationMarker = (coordinates: Coordinate) => {
  positionAndSelectedLocation.addSelectedLocationFeatureMarker(coordinates)
}

export const zoomIn = () => {
  zoom(1)
}

export const zoomOut = () => {
  zoom(-1)
}

export const fetchDataLatestUpdateDates = (settings: Settings) => {
  Promise.all([
    museovirastoTileLayer.getDataLatestUpdateDate(),
    ahvenanmaaTileLayer.getForminnenDataLatestUpdateDate(),
    ahvenanmaaTileLayer.getMaritimtKulturarvDataLatestUpdateDate(),
    modelsLayer.getDataLatestUpdateDate(settings)
  ])
    .then(
      ([
        museovirastoResult,
        ahvenanmaaForminnenResult,
        ahvenanmaaMaritimtKulturarvResult,
        modelsResult
      ]) => {
        eventListeners.dataLatestUpdateDatesReady({
          museovirasto: museovirastoResult,
          ahvenanmaaForminnen: ahvenanmaaForminnenResult,
          ahvenanmaaMaritimtKulturarv: ahvenanmaaMaritimtKulturarvResult,
          models: modelsResult
        })
      }
    )
    .catch(() =>
      eventListeners.dataLatestUpdateDatesReady({
        museovirasto: null,
        ahvenanmaaForminnen: null,
        ahvenanmaaMaritimtKulturarv: null,
        models: null
      })
    )
}
