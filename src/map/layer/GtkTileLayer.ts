import TileLayer from "ol/layer/WebGLTile"
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest"
import { TileSourceEvent } from "ol/source/Tile"
import { GtkLayer, getGtkLayerId, GtkLayerId } from "../../common/types"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (
  layer: TileLayer
) => void

export default class GtkTileLayer {
  private source?: TileArcGISRestSource
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
      source: this.source,
      visible: settings.gtk.selectedLayers.length > 0,
      /**
       * Limit cache size to fix iOS 15 Safari crash
       * @see https://github.com/openlayers/openlayers/issues/12908#issuecomment-1023572875
       */
      cacheSize: 128
    })
    this.layer.setOpacity(settings.gtk.opacity)

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private toLayerIds = (layers: Array<GtkLayer>): Array<GtkLayerId> => {
    return layers.map(getGtkLayerId).sort((a, b) => a - b)
  }

  private getSourceLayersParams = (): string => {
    const settings = this.store.getState()
    if (settings.gtk.selectedLayers.length > 0) {
      return "show:" + this.toLayerIds(settings.gtk.selectedLayers).join(",")
    } else {
      // No selected layers. Hide all.
      return "hide:" + this.toLayerIds(Object.values(GtkLayer)).join(",")
    }
  }

  private createSource = () => {
    const settings = this.store.getState()
    const options: Options = {
      urls: [settings.gtk.url.export],
      params: {
        layers: this.getSourceLayersParams()
      }
    }
    const newSource = new TileArcGISRestSource(options)

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
      this.layer.setVisible(settings.gtk.selectedLayers.length > 0)
    }
  }

  public selectedGTKLayersChanged = () => {
    this.updateLayerSource()
  }

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.gtk.opacity)
    }
  }
}
