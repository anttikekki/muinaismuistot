import { Feature as GeoJSONFeature } from "geojson"
import Collection from "ol/Collection"
import Feature from "ol/Feature"
import Geolocation from "ol/Geolocation"
import Map from "ol/Map"
import MapBrowserEvent from "ol/MapBrowserEvent"
import View from "ol/View"
import { ScaleLine } from "ol/control"
import { Coordinate } from "ol/coordinate"
import { Extent } from "ol/extent"
import GeoJSON from "ol/format/GeoJSON"
import Geometry from "ol/geom/Geometry"
import Layer from "ol/layer/Layer"
import VectorLayer from "ol/layer/Vector"
import "ol/ol.css"
import { Pixel } from "ol/pixel"
import { get as getProjection } from "ol/proj"
import { register as registerProj4 } from "ol/proj/proj4"
import Source from "ol/source/Source"
import VectorSource from "ol/source/Vector"
import proj4 from "proj4"
import { Store } from "redux"
import { isModelFeature } from "../common/3dModels.types"
import { LayerGroup, MaannousuInfoLayerIndex } from "../common/layers.types"
import { isMaisemanMuistiFeature } from "../common/maisemanMuisti.types"
import { MapFeature, isGeoJSONFeature } from "../common/mapFeature.types"
import { isMuinaisjaannosPisteFeature } from "../common/museovirasto.types"
import { StoreListener } from "../store"
import { ActionTypeEnum, ActionTypes } from "../store/actionTypes"
import { Settings } from "../store/storeTypes"
import AhvenanmaaTileLayer from "./layer/AhvenanmaaTileLayer"
import CurrentPositionAndSelectedLocationMarkerLayer from "./layer/CurrentPositionAndSelectedLocationMarkerLayer"
import GtkTileLayer from "./layer/GtkTileLayer"
import HelsinkiTileLayer from "./layer/HelsinkiTileLayer"
import MMLPohjakarttaTileLayer from "./layer/MMLPohjakarttaTileLayer"
import MMLVanhatKartatTileLayer from "./layer/MMLVanhatKartatTileLayer"
import MaannousuInfoGlacialTileLayerGroup from "./layer/MaannousuInfoGlacialTileLayerGroup"
import MaannousuInfoTileLayerGroup from "./layer/MaannousuInfoTileLayerGroup"
import MaisemanMuistiLayer from "./layer/MaisemanMuistiLayer"
import ModelsLayer from "./layer/ModelsLayer"
import MuseovirastoTileLayer from "./layer/MuseovirastoTileLayer"

export default class MuinaismuistotMap {
  private readonly store: Store<Settings, ActionTypes>
  private readonly map: Map
  private readonly view: View
  private readonly geolocation: Geolocation
  private readonly maanmittauslaitosTileLayer: MMLPohjakarttaTileLayer
  private readonly maanmittauslaitosVanhatKartatTileLayer: MMLVanhatKartatTileLayer
  private readonly maannousuInfoTileLayerGroup: MaannousuInfoTileLayerGroup
  private readonly maannousuInfoGlacialTileLayerGroup: MaannousuInfoGlacialTileLayerGroup
  private readonly museovirastoTileLayer: MuseovirastoTileLayer
  private readonly ahvenanmaaTileLayer: AhvenanmaaTileLayer
  private readonly positionAndSelectedLocation: CurrentPositionAndSelectedLocationMarkerLayer
  private readonly modelsLayer: ModelsLayer
  private readonly maisemanMuistiLayer: MaisemanMuistiLayer
  private readonly gtkLayer: GtkTileLayer
  private readonly helsinkiLayer: HelsinkiTileLayer
  private tileLoadingCounter = 0

  public constructor(store: Store<Settings, ActionTypes>) {
    this.store = store
    const settings = store.getState()

    proj4.defs(
      "EPSG:3067",
      "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    )
    registerProj4(proj4)

    const extent: Extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
    getProjection("EPSG:3067")?.setExtent(extent)

    this.view = new View({
      center: [385249.63630000036, 6672695.7579],
      projection: "EPSG:3067",
      zoom: settings.initialMapZoom,
      enableRotation: false
    })

    const scaleControl = new ScaleLine({
      units: "metric"
    })

    this.map = new Map({
      target: "map",
      view: this.view,
      controls: new Collection([scaleControl])
    })

    this.maanmittauslaitosTileLayer = new MMLPohjakarttaTileLayer(
      settings,
      this.updateTileLoadingStatus
    )
    this.gtkLayer = new GtkTileLayer(settings, this.updateTileLoadingStatus)
    this.ahvenanmaaTileLayer = new AhvenanmaaTileLayer(
      settings,
      this.updateTileLoadingStatus
    )
    this.maanmittauslaitosVanhatKartatTileLayer = new MMLVanhatKartatTileLayer(
      settings,
      this.updateTileLoadingStatus
    )
    this.maannousuInfoTileLayerGroup = new MaannousuInfoTileLayerGroup({
      settings,
      onMapRenderCompleteOnce: (fn) =>
        this.map.once("rendercomplete", () => fn()),
      updateTileLoadingStatus: this.updateTileLoadingStatus
    })
    this.maannousuInfoGlacialTileLayerGroup =
      new MaannousuInfoGlacialTileLayerGroup({
        settings,
        onMapRenderCompleteOnce: (fn) =>
          this.map.once("rendercomplete", () => fn())
      })
    this.museovirastoTileLayer = new MuseovirastoTileLayer(
      settings,
      this.updateTileLoadingStatus
    )
    this.helsinkiLayer = new HelsinkiTileLayer(
      settings,
      this.updateTileLoadingStatus
    )
    this.maisemanMuistiLayer = new MaisemanMuistiLayer(settings)
    this.modelsLayer = new ModelsLayer(settings)
    this.positionAndSelectedLocation =
      new CurrentPositionAndSelectedLocationMarkerLayer()

    this.map.addLayer(this.maanmittauslaitosTileLayer.getLayer())
    this.map.addLayer(this.gtkLayer.getLayer())
    this.map.addLayer(this.maanmittauslaitosVanhatKartatTileLayer.getLayer())
    this.map.addLayer(this.ahvenanmaaTileLayer.getLayer())
    this.map.addLayer(this.museovirastoTileLayer.getLayer())
    this.map.addLayer(this.helsinkiLayer.getLayer())
    this.map.addLayer(this.maisemanMuistiLayer.getLayer())
    this.map.addLayer(this.modelsLayer.getLayer())
    this.map.addLayer(this.positionAndSelectedLocation.getLayer())

    // Adds Maannousu.info layers to correct index
    this.moveMaannousuLayers(settings.maannousuInfo.placement)

    this.map.on("singleclick", this.indentifyFeaturesOnClickedCoordinate)

    this.geolocation = new Geolocation({
      projection: this.view.getProjection(),
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true
      }
    })

    this.geolocation.once("change:position", this.centerToCurrentPositions)
    this.geolocation.on("change:position", this.geolocationChanged)
  }

  public mapUpdaterStoreListener: StoreListener = {
    predicate: () => true,
    effect: async (action, listenerApi) => {
      const settings = listenerApi.getState()
      switch (action.type) {
        case ActionTypeEnum.ZOOM:
          this.zoom(action.zoomDirection === "in" ? 1 : -1)
          break
        case ActionTypeEnum.CENTER_MAP_TO_CURRENT_POSITION:
          this.centerToCurrentPositions()
          break
        case ActionTypeEnum.SET_MAP_LOCATION_AND_SHOW_SELECTED_MARKER:
          this.setMapLocation(action.coordinates)
          this.showSelectedLocationMarker(action.coordinates)
          break
        case ActionTypeEnum.CHANGE_LAYER_OPACITY:
          this.layerOpacityChanged(action.layerGroup, settings)
          break
        case ActionTypeEnum.ENABLE_LAYER_GROUP:
          this.layerGroupVisibilityChanged(action.layerGroup, settings)
          break
        case ActionTypeEnum.SELECT_VISIBLE_LAYERS:
          this.layerGroupSelectedLayersChanged(action.layerGroup, settings)
          break
        case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE:
          this.museovirastoTileLayer.selectedMuinaisjaannosTypesChanged(
            settings
          )
          break
        case ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING:
          this.museovirastoTileLayer.selectedMuinaisjaannosDatingsChanged(
            settings
          )
          break
        case ActionTypeEnum.SEARCH_FEATURES: {
          const result = await this.searchFeaturesFromMapLayers(
            action.searchText,
            settings
          )
          this.store.dispatch({
            type: ActionTypeEnum.SEARCH_FEATURES_COMPLETE,
            searchResultFeatures: result
          })
          break
        }
        case ActionTypeEnum.MOVE_MAANNOUSU_LAYER: {
          this.moveMaannousuLayers(action.placement)
        }
      }
    }
  }

  private moveMaannousuLayers = (placement: MaannousuInfoLayerIndex) => {
    const layers = this.map.getLayers()
    const layersArray = layers.getArray()
    const maannousuLayer = this.maannousuInfoTileLayerGroup.getLayerGroup()
    const maannousuGlacialLayer =
      this.maannousuInfoGlacialTileLayerGroup.getLayerGroup()

    layers.remove(maannousuLayer)
    layers.remove(maannousuGlacialLayer)

    const targetIndex = ((): number => {
      switch (placement) {
        case MaannousuInfoLayerIndex.Bottom: {
          return layersArray.indexOf(this.ahvenanmaaTileLayer.getLayer())
        }
        case MaannousuInfoLayerIndex.Top: {
          return layersArray.indexOf(
            this.positionAndSelectedLocation.getLayer()
          )
        }
      }
    })()

    layers.insertAt(targetIndex, maannousuGlacialLayer)
    layers.insertAt(targetIndex, maannousuLayer)
  }

  private updateTileLoadingStatus = (loading: boolean) => {
    const oldCounterValue = this.tileLoadingCounter

    if (loading) {
      this.tileLoadingCounter++
    } else if (this.tileLoadingCounter > 0) {
      this.tileLoadingCounter--
    }

    if (oldCounterValue === 0 && this.tileLoadingCounter === 1) {
      this.showLoadingAnimationInUI(true)
    } else if (oldCounterValue === 1 && this.tileLoadingCounter === 0) {
      this.showLoadingAnimationInUI(false)
    }
  }

  private showLoadingAnimationInUI = (show: boolean) => {
    this.store.dispatch({
      type: ActionTypeEnum.SHOW_LOADING_ANIMATION,
      show
    })
  }

  private getFeaturesAtPixelAtGeoJsonLayer(
    pixel: Pixel,
    geoJsonLayer?: VectorLayer<VectorSource<Feature<Geometry>>>
  ): GeoJSONFeature[] {
    const geojsonFormat = new GeoJSON()
    const features = this.map
      .getFeaturesAtPixel(pixel, {
        layerFilter: (layer: Layer<Source>) => layer === geoJsonLayer,
        hitTolerance: 10
      })
      .filter((f): f is Feature<Geometry> => f instanceof Feature)
    return geojsonFormat.writeFeaturesObject(features).features
  }

  private indentifyFeaturesOnClickedCoordinate = (e: MapBrowserEvent) => {
    this.showLoadingAnimationInUI(true)
    const mapSize = this.map.getSize()
    if (!mapSize) {
      return
    }
    const settings = this.store.getState()

    const ahvenanmaaQuery = this.ahvenanmaaTileLayer.identifyFeaturesAt(
      e.coordinate,
      mapSize,
      this.map.getView().calculateExtent(mapSize),
      settings
    )

    const museovirastoQuery = this.museovirastoTileLayer.identifyFeaturesAt(
      e.coordinate,
      this.view.getResolution(),
      this.view.getProjection(),
      settings
    )

    const maalinnoitusQuery = this.helsinkiLayer.identifyFeaturesAt(
      e.coordinate,
      this.view.getResolution(),
      this.view.getProjection(),
      settings
    )

    const modelsResult = settings.models.enabled
      ? this.getFeaturesAtPixelAtGeoJsonLayer(
          e.pixel,
          this.modelsLayer.getLayer()
        ).filter((f) => isModelFeature(f))
      : []

    const maisemanMuistiResult = settings.maisemanMuisti.enabled
      ? this.getFeaturesAtPixelAtGeoJsonLayer(
          e.pixel,
          this.maisemanMuistiLayer.getLayer()
        ).filter((f) => isMaisemanMuistiFeature(f))
      : []

    Promise.all([ahvenanmaaQuery, museovirastoQuery, maalinnoitusQuery]).then(
      ([ahvenanmaaResult, museovirastoResult, maalinnoitusFeatures]) => {
        this.showLoadingAnimationInUI(false)

        const features: MapFeature[] = [
          ...ahvenanmaaResult.results,
          ...museovirastoResult.features,
          ...maalinnoitusFeatures
        ]
          .map((f) => this.modelsLayer.addModelsToFeature(f))
          .map((f) =>
            this.maisemanMuistiLayer.addMaisemanMuistiFeaturesToFeature(f)
          )

        const maisemanMuistiFeatures = maisemanMuistiResult.filter(
          (feature) => {
            // Do not show Maiseman muisti feature if there is Muinaisjäännös piste feature for it in search results
            return !features.some(
              (mapFeature) =>
                isGeoJSONFeature(mapFeature) &&
                isMuinaisjaannosPisteFeature(mapFeature) &&
                mapFeature.properties.mjtunnus === feature.properties?.id
            )
          }
        )

        this.store.dispatch({
          type: ActionTypeEnum.CLICKED_MAP_FEATURE_IDENTIFICATION_COMPLETE,
          payload: {
            features,
            models: modelsResult,
            maisemanMuistiFeatures
          }
        })
      }
    )
  }

  private geolocationChanged = () => {
    const position = this.geolocation.getPosition()
    if (position) {
      this.positionAndSelectedLocation.addCurrentPositionMarker(position)
    }
  }

  private zoom = (zoomChange: number) => {
    const zoom = this.view.getZoom()
    if (zoom) {
      this.view.animate({
        zoom: zoom + zoomChange,
        duration: 250
      })
    }
  }

  private layerGroupSelectedLayersChanged = (
    changedLayerGroup: LayerGroup,
    settings: Settings
  ) => {
    switch (changedLayerGroup) {
      case LayerGroup.MMLPohjakartta:
        this.maanmittauslaitosTileLayer.selectedMaanmittauslaitosLayerChanged(
          settings
        )
        this.maannousuInfoTileLayerGroup.onMaanmittauslaitosSelectedLayerChange(
          settings
        )
        break
      case LayerGroup.MMLVanhatKartat:
        this.maanmittauslaitosVanhatKartatTileLayer.selectedMaanmittauslaitosVanhatKartatLayerChanged(
          settings
        )
        break
      case LayerGroup.GTK:
        this.gtkLayer.selectedGTKLayersChanged(settings)
        break
      case LayerGroup.MaannousuInfo:
        this.maannousuInfoTileLayerGroup.onYearChange(settings)
        this.maannousuInfoGlacialTileLayerGroup.onYearChange(settings)
        break
      case LayerGroup.Museovirasto:
        this.museovirastoTileLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.Ahvenanmaa:
        this.ahvenanmaaTileLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.Helsinki:
        this.helsinkiLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.Models:
        this.modelsLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.MaisemanMuisti:
        this.maisemanMuistiLayer.selectedFeatureLayersChanged(settings)
        break
    }
  }

  private searchFeaturesFromMapLayers = async (
    searchText: string,
    settings: Settings
  ): Promise<MapFeature[]> => {
    this.showLoadingAnimationInUI(true)
    const ahvenanmaaQuery = this.ahvenanmaaTileLayer.findFeatures(
      searchText,
      settings
    )
    const museovirastoQuery = this.museovirastoTileLayer.findFeatures(
      searchText,
      settings
    )

    const [ahvenanmaaResult, museovirastoResult] = await Promise.all([
      ahvenanmaaQuery,
      museovirastoQuery
    ])
    this.showLoadingAnimationInUI(false)

    const features: MapFeature[] = [
      ...ahvenanmaaResult.results,
      ...museovirastoResult.features
    ]
      .map((f) => this.modelsLayer.addModelsToFeature(f))
      .map((f) =>
        this.maisemanMuistiLayer.addMaisemanMuistiFeaturesToFeature(f)
      )

    return features
  }

  private layerOpacityChanged = (
    changedLayerGroup: LayerGroup,
    settings: Settings
  ) => {
    switch (changedLayerGroup) {
      case LayerGroup.MMLVanhatKartat:
        this.maanmittauslaitosVanhatKartatTileLayer.opacityChanged(settings)
        break
      case LayerGroup.GTK:
        this.gtkLayer.opacityChanged(settings)
        break
      case LayerGroup.MaannousuInfo:
        this.maannousuInfoTileLayerGroup.opacityChanged(settings)
        this.maannousuInfoGlacialTileLayerGroup.opacityChanged(settings)
        break
      case LayerGroup.Museovirasto:
        this.museovirastoTileLayer.opacityChanged(settings)
        break
      case LayerGroup.Ahvenanmaa:
        this.ahvenanmaaTileLayer.opacityChanged(settings)
        break
      case LayerGroup.Helsinki:
        this.helsinkiLayer.opacityChanged(settings)
        break
    }
  }

  private layerGroupVisibilityChanged = (
    changedLayerGroup: LayerGroup,
    settings: Settings
  ) => {
    switch (changedLayerGroup) {
      case LayerGroup.MMLPohjakartta:
        this.maanmittauslaitosTileLayer.updateLayerVisibility(settings)
        break
      case LayerGroup.MMLVanhatKartat:
        this.maanmittauslaitosVanhatKartatTileLayer.updateLayerVisibility(
          settings
        )
        break
      case LayerGroup.GTK:
        this.gtkLayer.updateLayerVisibility(settings)
        break
      case LayerGroup.MaannousuInfo:
        this.maannousuInfoTileLayerGroup.updateLayerVisibility(settings)
        this.maannousuInfoGlacialTileLayerGroup.updateLayerVisibility(settings)
        break
      case LayerGroup.Museovirasto:
        this.museovirastoTileLayer.updateLayerVisibility(settings)
        break
      case LayerGroup.Ahvenanmaa:
        this.ahvenanmaaTileLayer.updateLayerVisibility(settings)
        break
      case LayerGroup.Helsinki:
        this.helsinkiLayer.updateLayerVisibility(settings)
        break
      case LayerGroup.Models:
        this.modelsLayer.updateLayerVisibility(settings)
        break
      case LayerGroup.MaisemanMuisti:
        this.maisemanMuistiLayer.updateLayerVisibility(settings)
        break
    }
  }

  private setMapLocation = (coordinates: Coordinate) => {
    this.view.setCenter(coordinates)
  }

  private centerToCurrentPositions = () => {
    const position = this.geolocation.getPosition()
    if (position) {
      this.view.setCenter(position)
    }
  }

  private showSelectedLocationMarker = (coordinates: Coordinate) => {
    this.positionAndSelectedLocation.addSelectedLocationFeatureMarker(
      coordinates
    )
  }
}
