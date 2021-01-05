import "ol/ol.css"
import proj4 from "proj4"
import Map from "ol/Map"
import View from "ol/View"
import { register as registerProj4 } from "ol/proj/proj4"
import { get as getProjection } from "ol/proj"
import Collection from "ol/Collection"
import { FullScreen, ScaleLine } from "ol/control"
import Geolocation from "ol/Geolocation"
import MaanmittauslaitosTileLayer from "./layer/MaanmittauslaitosTileLayer"
import AhvenanmaaTileLayer from "./layer/AhvenanmaaTileLayer"
import MuseovirastoTileLayer from "./layer/MuseovirastoTileLayer"
import CurrentPositionAndSelectedLocationMarkerLayer from "./layer/CurrentPositionAndSelectedLocationMarkerLayer"
import {
  ArgisFeature,
  Settings,
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

export interface MapEventListener {
  featuresSelected: (
    features: Array<ArgisFeature>,
    models: Array<GeoJSONFeature<ModelFeatureProperties>>,
    maisemanMuistiFeatures: Array<
      GeoJSONFeature<MaisemanMuistiFeatureProperties>
    >
  ) => void
  showLoadingAnimation: (show: boolean) => void
  featureSearchReady: (features: Array<ArgisFeature>) => void
  dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => void
}

export default class MuinaismuistotMap {
  private map: Map
  private view: View
  private geolocation?: Geolocation
  private maanmittauslaitosTileLayer: MaanmittauslaitosTileLayer
  private museovirastoTileLayer: MuseovirastoTileLayer
  private ahvenanmaaTileLayer: AhvenanmaaTileLayer
  private positionAndSelectedLocation: CurrentPositionAndSelectedLocationMarkerLayer
  private modelsLayer: ModelsLayer
  private maisemanMuistiLayer: MaisemanMuistiLayer
  private eventListeners: MapEventListener

  public constructor(
    initialSettings: Settings,
    eventListeners: MapEventListener
  ) {
    this.eventListeners = eventListeners

    proj4.defs(
      "EPSG:3067",
      "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    )
    registerProj4(proj4)

    const extent: Extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902]
    getProjection("EPSG:3067").setExtent(extent)

    this.view = new View({
      center: [385249.63630000036, 6672695.7579],
      projection: "EPSG:3067",
      zoom: initialSettings.initialMapZoom,
      enableRotation: false
    })

    const scaleControl = new ScaleLine({
      units: "metric"
    })

    const fullScreenControl = new FullScreen({
      label: "\u2922"
    })

    this.map = new Map({
      target: "map",
      view: this.view,
      controls: new Collection([scaleControl /*fullScreenControl*/])
    })

    this.maanmittauslaitosTileLayer = new MaanmittauslaitosTileLayer(
      initialSettings,
      eventListeners.showLoadingAnimation,
      (mmlMaastokarttaLayer, mmlTaustakarttaLayer, mmlOrtokuvaLayer) => {
        this.map.getLayers().insertAt(0, mmlMaastokarttaLayer)
        this.map.getLayers().insertAt(1, mmlTaustakarttaLayer)
        this.map.getLayers().insertAt(2, mmlOrtokuvaLayer)
      }
    )

    this.ahvenanmaaTileLayer = new AhvenanmaaTileLayer(
      initialSettings,
      eventListeners.showLoadingAnimation,
      (createdLayer) => {
        this.map.getLayers().insertAt(3, createdLayer)
      }
    )

    this.museovirastoTileLayer = new MuseovirastoTileLayer(
      initialSettings,
      eventListeners.showLoadingAnimation,
      (createdLayer) => {
        this.map.getLayers().insertAt(4, createdLayer)
      }
    )

    this.maisemanMuistiLayer = new MaisemanMuistiLayer()
    this.modelsLayer = new ModelsLayer()
    this.positionAndSelectedLocation = new CurrentPositionAndSelectedLocationMarkerLayer()

    Promise.all([
      this.maisemanMuistiLayer.createLayer(initialSettings),
      this.modelsLayer.createLayer(initialSettings)
    ]).then(([maisemanMuistiLayer, modelsLayer]) => {
      this.map.getLayers().insertAt(5, maisemanMuistiLayer)
      this.map.getLayers().insertAt(6, modelsLayer)
      this.map
        .getLayers()
        .insertAt(7, this.positionAndSelectedLocation.getLayer())
    })

    this.map.on("singleclick", this.loadFeaturesOnClickedCoordinate)
  }

  private getFeaturesAtPixelAtGeoJsonLayer = <T>(
    pixel: Pixel,
    geoJsonLayer?: VectorLayer
  ): Array<GeoJSONFeature<T>> => {
    return this.map
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

  private loadFeaturesOnClickedCoordinate = (e: MapBrowserEvent) => {
    this.eventListeners.showLoadingAnimation(true)
    const mapSize = this.map.getSize()
    if (!mapSize) {
      return
    }

    const ahvenanmaaQuery = this.ahvenanmaaTileLayer.identifyFeaturesAt(
      e.coordinate,
      mapSize,
      this.map.getView().calculateExtent(mapSize)
    )

    const museovirastoQuery = this.museovirastoTileLayer.identifyFeaturesAt(
      e.coordinate,
      mapSize,
      this.map.getView().calculateExtent(mapSize)
    )

    const modelsResult = this.getFeaturesAtPixelAtGeoJsonLayer<ModelFeatureProperties>(
      e.pixel,
      this.modelsLayer.getLayer()
    )

    const maisemanMuistiResult = this.getFeaturesAtPixelAtGeoJsonLayer<MaisemanMuistiFeatureProperties>(
      e.pixel,
      this.maisemanMuistiLayer.getLayer()
    )

    Promise.all([ahvenanmaaQuery, museovirastoQuery]).then(
      ([ahvenanmaaResult, museovirastoResult]) => {
        this.eventListeners.showLoadingAnimation(false)
        const allFeatures = ahvenanmaaResult.results
          .concat(museovirastoResult.results)
          .map((f) => this.modelsLayer.addFeaturesForArgisFeature(f))
          .map((f) => this.maisemanMuistiLayer.addFeaturesForArgisFeature(f))

        this.eventListeners.featuresSelected(
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

  private initGeolocation = () => {
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

  private geolocationChanged = () => {
    const position = this.geolocation?.getPosition()
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

  public selectedFeatureLayersChanged = (
    settings: Settings,
    changedLayerGroup: LayerGroup
  ): void => {
    switch (changedLayerGroup) {
      case LayerGroup.Museovirasto:
        this.museovirastoTileLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.Ahvenanmaa:
        this.ahvenanmaaTileLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.Models:
        this.modelsLayer.selectedFeatureLayersChanged(settings)
        break
      case LayerGroup.MaisemanMuisti:
        this.maisemanMuistiLayer.selectedFeatureLayersChanged(settings)
        break
    }
  }

  public selectedMuinaisjaannosTypesChanged = (settings: Settings): void => {
    this.museovirastoTileLayer.selectedMuinaisjaannosTypesChanged(settings)
  }

  public selectedMuinaisjaannosDatingsChanged = (settings: Settings): void => {
    this.museovirastoTileLayer.selectedMuinaisjaannosDatingsChanged(settings)
  }

  public searchFeatures = (searchText: string): void => {
    this.eventListeners.showLoadingAnimation(true)
    const ahvenanmaaQuery = this.ahvenanmaaTileLayer.findFeatures(searchText)
    const museovirastoQuery = this.museovirastoTileLayer.findFeatures(
      searchText
    )

    Promise.all([ahvenanmaaQuery, museovirastoQuery]).then(
      ([ahvenanmaaResult, museovirastoResult]) => {
        this.eventListeners.showLoadingAnimation(false)
        const allFeatures = ahvenanmaaResult.results
          .concat(museovirastoResult.results)
          .map((f) => this.modelsLayer.addFeaturesForArgisFeature(f))
          .map((f) => this.maisemanMuistiLayer.addFeaturesForArgisFeature(f))

        this.eventListeners.featureSearchReady(allFeatures)
      }
    )
  }

  public selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
    this.maanmittauslaitosTileLayer.selectedMaanmittauslaitosLayerChanged(
      settings
    )
  }

  public setMapLocation = (coordinates: Coordinate) => {
    this.view.setCenter(coordinates)
  }

  public centerToCurrentPositions = () => {
    if (this.geolocation && this.geolocation.getPosition()) {
      const position = this.geolocation.getPosition()
      this.view.setCenter(position)
    } else {
      this.initGeolocation()
    }
  }

  public showSelectedLocationMarker = (coordinates: Coordinate) => {
    this.positionAndSelectedLocation.addSelectedLocationFeatureMarker(
      coordinates
    )
  }

  public zoomIn = () => {
    this.zoom(1)
  }

  public zoomOut = () => {
    this.zoom(-1)
  }

  public fetchDataLatestUpdateDates = (settings: Settings) => {
    Promise.all([
      this.museovirastoTileLayer.getDataLatestUpdateDate(),
      this.ahvenanmaaTileLayer.getForminnenDataLatestUpdateDate(),
      this.ahvenanmaaTileLayer.getMaritimtKulturarvDataLatestUpdateDate(),
      this.modelsLayer.getDataLatestUpdateDate(settings)
    ])
      .then(
        ([
          museovirastoResult,
          ahvenanmaaForminnenResult,
          ahvenanmaaMaritimtKulturarvResult,
          modelsResult
        ]) => {
          this.eventListeners.dataLatestUpdateDatesReady({
            museovirasto: museovirastoResult,
            ahvenanmaaForminnen: ahvenanmaaForminnenResult,
            ahvenanmaaMaritimtKulturarv: ahvenanmaaMaritimtKulturarvResult,
            models: modelsResult
          })
        }
      )
      .catch(() =>
        this.eventListeners.dataLatestUpdateDatesReady({
          museovirasto: null,
          ahvenanmaaForminnen: null,
          ahvenanmaaMaritimtKulturarv: null,
          models: null
        })
      )
  }
}
