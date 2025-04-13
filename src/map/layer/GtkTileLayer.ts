import TileLayer from "ol/layer/Tile"
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest"
import { GtkLayerId, getGtkLayerId } from "../../common/gtk.types"
import { GtkLayer } from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class GtkTileLayer {
  private source?: TileArcGISRestSource
  private readonly layer: TileLayer<TileArcGISRestSource>
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn

  public constructor(
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateTileLoadingStatus = updateTileLoadingStatus

    this.source = this.createSource(settings)
    this.layer = new TileLayer({
      source: this.source
    })
    this.opacityChanged(settings)
    this.updateLayerVisibility(settings)
  }

  private toLayerIds = (layers: GtkLayer[]): GtkLayerId[] => {
    return layers.map(getGtkLayerId).sort((a, b) => a - b)
  }

  private getSourceLayersParams = (settings: Settings): string => {
    if (settings.gtk.selectedLayers.length > 0) {
      return "show:" + this.toLayerIds(settings.gtk.selectedLayers).join(",")
    } else {
      // No selected layers. Hide all.
      return "hide:" + this.toLayerIds(Object.values(GtkLayer)).join(",")
    }
  }

  private createSource = (settings: Settings) => {
    const options: Options = {
      urls: [settings.gtk.url.export],
      params: {
        layers: this.getSourceLayersParams(settings)
      }
    }
    const newSource = new TileArcGISRestSource(options)

    newSource.on("tileloadstart", () => {
      this.updateTileLoadingStatus(true)
    })
    newSource.on("tileloadend", () => {
      this.updateTileLoadingStatus(false)
    })
    newSource.on("tileloaderror", () => {
      this.updateTileLoadingStatus(false)
    })

    return newSource
  }

  private updateLayerSource = (settings: Settings) => {
    this.source = this.createSource(settings)
    this.layer.setSource(this.source)
    this.updateLayerVisibility(settings)
  }

  public updateLayerVisibility = (settings: Settings) => {
    const {
      gtk: { selectedLayers, enabled }
    } = settings
    this.layer.setVisible(enabled && selectedLayers.length > 0)
  }

  public selectedGTKLayersChanged = (settings: Settings) => {
    this.updateLayerSource(settings)
  }

  public opacityChanged = (settings: Settings) => {
    this.layer.setOpacity(settings.gtk.opacity)
  }

  public getLayer = (): TileLayer<TileArcGISRestSource> => this.layer
}
