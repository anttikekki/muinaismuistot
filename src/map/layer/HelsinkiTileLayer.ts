import TileLayer from "ol/layer/Tile"
import TileWMS, { Options } from "ol/source/TileWMS"
import { TileSourceEvent } from "ol/source/Tile"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import { Coordinate } from "ol/coordinate"
import { containsCoordinate } from "ol/extent"
import Projection from "ol/proj/Projection"
import {
  MaalinnoitusWmsFeatureInfoResult,
  MaalinnoitusFeature
} from "../../common/types"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void

export default class HelsinkiTileLayer {
  private source?: TileWMS
  private layer?: TileLayer
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
        375492.90815974085,
        6653540.407044016,
        405531.7569803879,
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
  ): Promise<Array<MaalinnoitusFeature>> => {
    const extent = this.layer?.getExtent()
    if (!extent || !containsCoordinate(extent, coordinate)) {
      return []
    }

    if (this.source && resolution !== undefined) {
      const url = this.source.getFeatureInfoUrl(
        coordinate,
        resolution,
        projection,
        {
          INFO_FORMAT: "application/json",
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
          const result = (await response.json()) as MaalinnoitusWmsFeatureInfoResult
          console.log("Helsinki identifyFeaturesAt", result)
          return result.features
        } catch (e) {
          return []
        }
      }
    }
    return []
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
