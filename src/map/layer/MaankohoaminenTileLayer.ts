import TileLayer from "ol/layer/Tile"
import TileWMS, { Options } from "ol/source/TileWMS"
import { TileSourceEvent } from "ol/source/Tile"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer<TileWMS>) => void

export default class MaankohoaminenTileLayer {
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
      extent: [50199.4814, 6582464.0358, 761274.6247, 7320000.0],
      source: this.source,
      visible: true
    })
    this.layer.setOpacity(settings.maankohoaminen.opacity)

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private createSource = () => {
    const settings = this.store.getState()
    const options: Options = {
      urls: [settings.maankohoaminen.url.wms],
      params: {
        LAYERS: settings.maankohoaminen.selectedLayer,
        TILED: true
      },
      serverType: "mapserver"
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
      const newLayer = settings.maankohoaminen.selectedLayer
      const oldLayer = this.source?.getParams()?.LAYERS
      if (newLayer === oldLayer) {
        return
      }

      this.source = this.createSource()
      this.layer.setSource(this.source)
      this.layer.setVisible(!!settings.maankohoaminen.selectedLayer)
    }
  }

  public selectedFeatureLayersChanged = () => {
    this.updateLayerSource()
  }

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.maankohoaminen.opacity)
    }
  }
}
