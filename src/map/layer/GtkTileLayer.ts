import TileLayer from "ol/layer/Tile"
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest"
import { TileSourceEvent } from "ol/source/Tile"
import {
  Settings,
  GtkLayer,
  getGtkLayerId,
  GtkLayerId
} from "../../common/types"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void

export default class GtkTileLayer {
  private source?: TileArcGISRestSource
  private layer?: TileLayer
  private settings: Settings
  private showLoadingAnimationFn: ShowLoadingAnimationFn
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn

  public constructor(
    initialSettings: Settings,
    showLoadingAnimationFn: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.settings = initialSettings
    this.showLoadingAnimationFn = showLoadingAnimationFn
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn
    this.addLayer()
  }

  private addLayer = () => {
    this.source = this.createSource()
    this.layer = new TileLayer({
      source: this.source,
      visible: this.settings.gtk.selectedLayers.length > 0
    })
    this.layer.setOpacity(this.settings.gtk.opacity)

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private toLayerIds = (layers: Array<GtkLayer>): Array<GtkLayerId> => {
    return layers.map(getGtkLayerId).sort((a, b) => a - b)
  }

  private getSourceLayersParams = (): string => {
    if (this.settings.gtk.selectedLayers.length > 0) {
      return (
        "show:" + this.toLayerIds(this.settings.gtk.selectedLayers).join(",")
      )
    } else {
      // No selected layers. Hide all.
      return "hide:" + this.toLayerIds(Object.values(GtkLayer)).join(",")
    }
  }

  private createSource = () => {
    const options: Options = {
      urls: [this.settings.gtk.url.export],
      params: {
        layers: this.getSourceLayersParams()
      }
    }
    const newSource = new TileArcGISRestSource(options)

    newSource.on("tileloadstart", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(true)
    })
    newSource.on("tileloadend", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false)
    })
    newSource.on("tileloaderror", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false)
    })

    return newSource
  }

  private updateLayerSource = () => {
    if (this.layer) {
      this.source = this.createSource()
      this.layer.setSource(this.source)
      this.layer.setVisible(this.settings.gtk.selectedLayers.length > 0)
    }
  }

  public selectedGTKLayersChanged = (settings: Settings) => {
    this.settings = settings
    this.updateLayerSource()
  }

  public opacityChanged = (settings: Settings) => {
    this.settings = settings
    if (this.layer) {
      this.layer.setOpacity(this.settings.gtk.opacity)
    }
  }
}
