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
import { LayerGroup } from "../common/layers.types"
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
import { Store } from "redux"
import { ActionTypes } from "../store/actionTypes"
import {
  clickedMapFeatureIdentificationComplete,
  showLoadingAnimation
} from "../store/actionCreators"
import HelsinkiTileLayer from "./layer/HelsinkiTileLayer"
import VectorSource from "ol/source/Vector"
import Geometry from "ol/geom/Geometry"
import Feature from "ol/Feature"
import { GeoJSONFeature } from "../common/geojson.types"
import { ModelFeatureProperties } from "../common/3dModels.types"
import { MaisemanMuistiFeatureProperties } from "../common/maisemanMuisti.types"
import { MapFeature, isWmsFeature } from "../common/mapFeature.types"
import { isMuinaisjaannosPisteWmsFeature } from "../common/museovirasto.types"

let store: Store<Settings, ActionTypes>
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
let helsinkiLayer: HelsinkiTileLayer
let tileLoadingCounter: number = 0

export const createMap = (reduxStore: Store<Settings, ActionTypes>) => {
  store = reduxStore

  proj4.defs(
    "EPSG:3067",
    "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  )
  registerProj4(proj4)

  const extent: Extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
  getProjection("EPSG:3067")?.setExtent(extent)

  view = new View({
    center: [385249.63630000036, 6672695.7579],
    projection: "EPSG:3067",
    zoom: store.getState().initialMapZoom,
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
    store,
    updateTileLoadingStatus,
    (mmlMaastokarttaLayer, mmlTaustakarttaLayer, mmlOrtokuvaLayer) => {
      mmlMaastokarttaLayer.setZIndex(0)
      mmlTaustakarttaLayer.setZIndex(1)
      mmlOrtokuvaLayer.setZIndex(2)
      map.getLayers().push(mmlMaastokarttaLayer)
      map.getLayers().push(mmlTaustakarttaLayer)
      map.getLayers().push(mmlOrtokuvaLayer)
    }
  )

  gtkLayer = new GtkTileLayer(
    store,
    updateTileLoadingStatus,
    (createdLayer) => {
      createdLayer.setZIndex(3)
      map.getLayers().push(createdLayer)
    }
  )

  ahvenanmaaTileLayer = new AhvenanmaaTileLayer(
    store,
    updateTileLoadingStatus,
    (createdLayer) => {
      createdLayer.setZIndex(4)
      map.getLayers().push(createdLayer)
    }
  )

  museovirastoTileLayer = new MuseovirastoTileLayer(
    store,
    updateTileLoadingStatus,
    (createdLayer) => {
      createdLayer.setZIndex(5)
      map.getLayers().push(createdLayer)
    }
  )

  helsinkiLayer = new HelsinkiTileLayer(
    store,
    updateTileLoadingStatus,
    (createdLayer) => {
      createdLayer.setZIndex(6)
      map.getLayers().push(createdLayer)
    }
  )

  maisemanMuistiLayer = new MaisemanMuistiLayer(store)
  modelsLayer = new ModelsLayer(store)
  positionAndSelectedLocation =
    new CurrentPositionAndSelectedLocationMarkerLayer()

  Promise.all([
    maisemanMuistiLayer.createLayer(),
    modelsLayer.createLayer()
  ]).then(([maisemanMuistiLayer, modelsLayer]) => {
    maisemanMuistiLayer.setZIndex(7)
    modelsLayer.setZIndex(8)
    positionAndSelectedLocation.getLayer().setZIndex(9)
    map.getLayers().push(maisemanMuistiLayer)
    map.getLayers().push(modelsLayer)
    map.getLayers().push(positionAndSelectedLocation.getLayer())
  })

  map.on("singleclick", indentifyFeaturesOnClickedCoordinate)
}

const updateTileLoadingStatus = (loading: boolean) => {
  const oldCounterValue = tileLoadingCounter

  if (loading) {
    tileLoadingCounter++
  } else {
    tileLoadingCounter--
  }

  if (oldCounterValue === 0 && tileLoadingCounter === 1) {
    showLoadingAnimationInUI(true)
  } else if (oldCounterValue === 1 && tileLoadingCounter === 0) {
    showLoadingAnimationInUI(false)
  }
}

const showLoadingAnimationInUI = (show: boolean) => {
  store.dispatch(showLoadingAnimation(show))
}

const getFeaturesAtPixelAtGeoJsonLayer = <T>(
  pixel: Pixel,
  geoJsonLayer?: VectorLayer<VectorSource<Feature<Geometry>>>
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

const indentifyFeaturesOnClickedCoordinate = (e: MapBrowserEvent<UIEvent>) => {
  showLoadingAnimationInUI(true)
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
    view.getResolution(),
    view.getProjection()
  )

  const maalinnoitusQuery = helsinkiLayer.identifyFeaturesAt(
    e.coordinate,
    view.getResolution(),
    view.getProjection()
  )

  const modelsResult = getFeaturesAtPixelAtGeoJsonLayer<ModelFeatureProperties>(
    e.pixel,
    modelsLayer.getLayer()
  )

  const maisemanMuistiResult =
    getFeaturesAtPixelAtGeoJsonLayer<MaisemanMuistiFeatureProperties>(
      e.pixel,
      maisemanMuistiLayer.getLayer()
    )

  Promise.all([ahvenanmaaQuery, museovirastoQuery, maalinnoitusQuery]).then(
    ([ahvenanmaaResult, museovirastoResult, maalinnoitusFeatures]) => {
      showLoadingAnimationInUI(false)

      const features: Array<MapFeature> = [
        ...ahvenanmaaResult.results,
        ...museovirastoResult.features,
        ...maalinnoitusFeatures
      ]
        .map((f) => modelsLayer.addModelsToFeature(f))
        .map((f) => maisemanMuistiLayer.addMaisemanMuistiFeaturesToFeature(f))

      const maisemanMuistiFeatures = maisemanMuistiResult.filter((feature) => {
        // Do not show Maiseman muisti feature if there is Muinaisjäännös piste feature for it in search results
        return !features.some(
          (mapFeature) =>
            isWmsFeature(mapFeature) &&
            isMuinaisjaannosPisteWmsFeature(mapFeature) &&
            mapFeature.properties.mjtunnus === feature.properties.id
        )
      })

      store.dispatch(
        clickedMapFeatureIdentificationComplete({
          features,
          models: modelsResult,
          maisemanMuistiFeatures
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
  changedLayerGroup: LayerGroup
): void => {
  switch (changedLayerGroup) {
    case LayerGroup.GTK:
      gtkLayer.selectedGTKLayersChanged()
      break
    case LayerGroup.Museovirasto:
      museovirastoTileLayer.selectedFeatureLayersChanged()
      break
    case LayerGroup.Ahvenanmaa:
      ahvenanmaaTileLayer.selectedFeatureLayersChanged()
      break
    case LayerGroup.Helsinki:
      helsinkiLayer.selectedFeatureLayersChanged()
      break
    case LayerGroup.Models:
      modelsLayer.selectedFeatureLayersChanged()
      break
    case LayerGroup.MaisemanMuisti:
      maisemanMuistiLayer.selectedFeatureLayersChanged()
      break
  }
}

export const selectedMuinaisjaannosTypesChanged = (): void => {
  //museovirastoTileLayer.selectedMuinaisjaannosTypesChanged()
}

export const selectedMuinaisjaannosDatingsChanged = (): void => {
  //museovirastoTileLayer.selectedMuinaisjaannosDatingsChanged()
}

export const searchFeaturesFromMapLayers = async (
  searchText: string
): Promise<Array<MapFeature>> => {
  showLoadingAnimationInUI(true)
  const ahvenanmaaQuery = ahvenanmaaTileLayer.findFeatures(searchText)
  const museovirastoQuery = museovirastoTileLayer.findFeatures(searchText)

  const [ahvenanmaaResult, museovirastoResult] = await Promise.all([
    ahvenanmaaQuery,
    museovirastoQuery
  ])
  showLoadingAnimationInUI(false)

  const features: Array<MapFeature> = [
    ...ahvenanmaaResult.results,
    ...museovirastoResult.features
  ]
    .map((f) => modelsLayer.addModelsToFeature(f))
    .map((f) => maisemanMuistiLayer.addMaisemanMuistiFeaturesToFeature(f))

  return features
}

export const selectedMaanmittauslaitosLayerChanged = () => {
  maanmittauslaitosTileLayer.selectedMaanmittauslaitosLayerChanged()
}

export const layerOpacityChanged = (changedLayerGroup: LayerGroup): void => {
  switch (changedLayerGroup) {
    case LayerGroup.GTK:
      gtkLayer.opacityChanged()
      break
    case LayerGroup.Museovirasto:
      museovirastoTileLayer.opacityChanged()
      break
    case LayerGroup.Ahvenanmaa:
      ahvenanmaaTileLayer.opacityChanged()
      break
    case LayerGroup.Helsinki:
      helsinkiLayer.opacityChanged()
      break
  }
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
