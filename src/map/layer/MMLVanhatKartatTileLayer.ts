import TileLayer from "ol/layer/Tile"
import TileWMS, { Options } from "ol/source/TileWMS"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class MMLVanhatKartatTileLayer {
  private source?: TileWMS
  private readonly layer: TileLayer<TileWMS>
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

  private createSource = (settings: Settings) => {
    const { selectedLayers, url } = settings.maanmittauslaitos.vanhatKartat

    const options: Options = {
      urls: [url.wms],
      params: {
        LAYERS: selectedLayers.join(","),
        TILED: true
      },
      serverType: "geoserver"
    }
    const newSource = new TileWMS(options)

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
    const { selectedLayers, enabled } = settings.maanmittauslaitos.vanhatKartat
    this.layer.setVisible(enabled && selectedLayers.length > 0)
  }

  public selectedMaanmittauslaitosVanhatKartatLayerChanged = (
    settings: Settings
  ) => {
    this.updateLayerSource(settings)
  }

  public opacityChanged = (settings: Settings) => {
    const { opacity } = settings.maanmittauslaitos.vanhatKartat
    this.layer.setOpacity(opacity)
  }

  public getLayer = (): TileLayer<TileWMS> => this.layer
}
