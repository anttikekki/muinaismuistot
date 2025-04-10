import TileLayer from "ol/layer/Tile"
import { TileSourceEvent } from "ol/source/Tile"
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest"
import { Store } from "redux"
import { GtkLayerId, getGtkLayerId } from "../../common/gtk.types"
import { GtkLayer } from "../../common/layers.types"
import { ActionTypes } from "../../store/actionTypes"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (
  layer: TileLayer<TileArcGISRestSource>
) => void

export default class GtkTileLayer {
  private source?: TileArcGISRestSource
  private layer?: TileLayer<TileArcGISRestSource>
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
      source: this.source
    })
    this.opacityChanged()
    this.updateLayerVisibility()

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
      this.source = this.createSource()
      this.layer.setSource(this.source)
      this.updateLayerVisibility()
    }
  }

  public updateLayerVisibility = () => {
    if (this.layer) {
      const {
        gtk: { selectedLayers, enabled }
      } = this.store.getState()
      this.layer.setVisible(enabled && selectedLayers.length > 0)
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
