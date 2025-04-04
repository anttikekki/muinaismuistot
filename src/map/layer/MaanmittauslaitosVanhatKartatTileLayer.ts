import TileLayer from "ol/layer/Tile"
import { TileSourceEvent } from "ol/source/Tile"
import TileWMS, { Options } from "ol/source/TileWMS"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer<TileWMS>) => void

export default class MaanmittauslaitosVanhatKartatTileLayer {
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
    const {
      maanmittauslaitosVanhatKartat: { selectedLayers, enabled, opacity }
    } = this.store.getState()
    this.source = this.createSource()
    this.layer = new TileLayer({
      source: this.source
    })
    this.opacityChanged()
    this.updateLayerVisibility()

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private createSource = () => {
    const settings = this.store.getState()
    const options: Options = {
      urls: [settings.maanmittauslaitosVanhatKartat.url.wms],
      params: {
        LAYERS: settings.maanmittauslaitosVanhatKartat.selectedLayers.join(","),
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
      this.updateLayerVisibility()
    }
  }

  public updateLayerVisibility = () => {
    if (this.layer) {
      const {
        maanmittauslaitosVanhatKartat: { selectedLayers, enabled }
      } = this.store.getState()
      this.layer.setVisible(enabled && selectedLayers.length > 0)
    }
  }

  public selectedMaanmittauslaitosVanhatKartatLayerChanged = () => {
    this.updateLayerSource()
  }

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.maanmittauslaitosVanhatKartat.opacity)
    }
  }
}
