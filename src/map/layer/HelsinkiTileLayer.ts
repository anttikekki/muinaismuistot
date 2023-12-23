import TileLayer from "ol/layer/Tile"
import TileWMS, { Options } from "ol/source/TileWMS"
import { TileSourceEvent } from "ol/source/Tile"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import { Coordinate } from "ol/coordinate"
import { containsCoordinate } from "ol/extent"
import Projection from "ol/proj/Projection"
import { HelsinkiLayer } from "../../common/layers.types"
import {
  MaalinnoitusWmsFeature,
  MaalinnoitusWmsFeatureInfoResult,
  isMaalinnoitusKohdeFeature
} from "../../common/maalinnoitusHelsinki.types"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer<TileWMS>) => void

export default class HelsinkiTileLayer {
  private source?: TileWMS
  private layer?: TileLayer<TileWMS>
  private store: Store<Settings, ActionTypes>
  private updateTileLoadingStatus: ShowLoadingAnimationFn
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn

  public constructor(
    store: Store<Settings, ActionTypes>,
    updateTileLoadingStatus: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.store = store
    this.updateTileLoadingStatus = updateTileLoadingStatus
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn
    this.addLayer()
  }

  private addLayer = () => {
    const settings = this.store.getState()
    this.source = this.createSource()
    this.layer = new TileLayer({
      // Extent from EPSG:3067 https://kartta.hel.fi/ws/geoserver/avoindata/wms?request=getCapabilities
      extent: [
        375492.90815974085, 6653540.407044016, 405531.7569803879,
        6689393.357339721
      ],
      source: this.source,
      visible: settings.helsinki.selectedLayers.length > 0
    })
    this.layer.setOpacity(settings.helsinki.opacity)

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private createSource = () => {
    const settings = this.store.getState()
    const options: Options = {
      urls: [settings.helsinki.url.wms],
      params: {
        LAYERS: settings.helsinki.selectedLayers.join(","),
        TILED: true
      },
      serverType: "geoserver"
    }
    const newSource = new TileWMS(options)

    newSource.on("tileloadstart", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(true)
    })
    newSource.on("tileloadend", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })
    newSource.on("tileloaderror", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })

    return newSource
  }

  private updateLayerSource = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.source = this.createSource()
      this.layer.setSource(this.source)
      this.layer.setVisible(settings.helsinki.selectedLayers.length > 0)
    }
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    resolution: number | undefined,
    projection: Projection
  ): Promise<Array<MaalinnoitusWmsFeature>> => {
    const settings = this.store.getState()
    const extent = this.layer?.getExtent()

    /**
     * Maalinnoitus_karttatekstit layer does not provide any usefull data so
     * let's remove it from identify call
     */
    const selectedLayersWithoutTextLayer =
      settings.helsinki.selectedLayers.filter(
        (layer) => layer !== HelsinkiLayer.Maalinnoitus_karttatekstit
      )

    if (
      !extent ||
      !containsCoordinate(extent, coordinate) ||
      selectedLayersWithoutTextLayer.length === 0
    ) {
      return []
    }

    if (this.source && resolution !== undefined) {
      const url = this.source.getFeatureInfoUrl(
        coordinate,
        resolution,
        projection,
        {
          INFO_FORMAT: "application/json",
          QUERY_LAYERS: selectedLayersWithoutTextLayer.join(","),
          FEATURE_COUNT: 100,
          /**
           * Geoserver vendor specific param to extend the search radius pixels. Similar to ArcGis tolerance.
           * @see https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#buffer
           */
          BUFFER: 15
        }
      )
      if (url) {
        try {
          const response = await fetch(String(url))
          const result =
            (await response.json()) as MaalinnoitusWmsFeatureInfoResult
          return this.removeDuplicateIdentifyFeatures(result.features)
        } catch (e) {
          return []
        }
      }
    }
    return []
  }

  private removeDuplicateIdentifyFeatures = (
    features: Array<MaalinnoitusWmsFeature>
  ): Array<MaalinnoitusWmsFeature> => {
    const allKohdeFeatures = features.filter(isMaalinnoitusKohdeFeature)

    return features.filter((f) => {
      // Kohde features sometimes has multiple features with same data. Filter those out.
      if (isMaalinnoitusKohdeFeature(f)) {
        const firstMatch = allKohdeFeatures.find(
          (v) =>
            v.properties.tukikohtanumero === f.properties.tukikohtanumero &&
            v.properties.olotila === f.properties.olotila
        )
        return firstMatch?.id === f.id
      }
      return true
    })
  }

  public selectedFeatureLayersChanged = () => {
    this.updateLayerSource()
  }

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.helsinki.opacity)
    }
  }
}
