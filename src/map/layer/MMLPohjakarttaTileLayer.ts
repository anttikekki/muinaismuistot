import WMTSCapabilities from "ol/format/WMTSCapabilities"
import TileLayer from "ol/layer/Tile"
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS"
import { MMLPohjakarttaLayer } from "../../common/layers.types"
import { Settings } from "../../store/storeTypes"
import mmlWMTSCapabilitiesResult from "./wmts-get-capabilities/mml.xml"
import paituliWMTSCapabilitiesResult from "./wmts-get-capabilities/paituli.xml"

type ShowLoadingAnimationFn = (show: boolean) => void

export default class MMLPohjakarttaTileLayer {
  private readonly layer: TileLayer<WMTSSource>
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn
  private source?: WMTSSource
  private mmlWmtsCapabilities: unknown
  private paituliWmtsCapabilities: unknown

  public constructor(
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateTileLoadingStatus = updateTileLoadingStatus

    this.source = this.createSource(settings)
    this.layer = new TileLayer({
      source: this.source
    })

    this.updateLayerVisibility(settings)
  }

  private getWmtsCapabilities = (layer: MMLPohjakarttaLayer) => {
    switch (layer) {
      case MMLPohjakarttaLayer.Maastokartta:
      case MMLPohjakarttaLayer.Taustakartta:
      case MMLPohjakarttaLayer.Ortokuva: {
        if (!this.mmlWmtsCapabilities) {
          this.mmlWmtsCapabilities = new WMTSCapabilities().read(
            mmlWMTSCapabilitiesResult
          )
        }
        return this.mmlWmtsCapabilities
      }
      case MMLPohjakarttaLayer.Korkeusmalli25m: {
        if (!this.paituliWmtsCapabilities) {
          this.paituliWmtsCapabilities = new WMTSCapabilities().read(
            paituliWMTSCapabilitiesResult
          )
        }
        return this.paituliWmtsCapabilities
      }
    }
  }

  private createSource = (settings: Settings): WMTSSource => {
    const { selectedLayer: layer, apiKey } = settings.maanmittauslaitos.basemap

    const sourceOptions = optionsFromCapabilities(
      this.getWmtsCapabilities(layer),
      {
        layer
      }
    )
    if (!sourceOptions) {
      throw new Error(
        `Expected layer ${layer} were not found from WMTS Capabilities`
      )
    }

    const source = new WMTSSource(sourceOptions)

    // Add MML api key to layer URL. This API key is just for avoin-karttakuva.maanmittauslaitos.fi
    source.setUrls(
      source.getUrls()?.map((url) => `${url}api-key=${apiKey}&`) || []
    )

    source.on("tileloadstart", () => {
      this.updateTileLoadingStatus(true)
    })
    source.on("tileloadend", () => {
      this.updateTileLoadingStatus(false)
    })
    source.on("tileloaderror", () => {
      this.updateTileLoadingStatus(false)
    })

    return source
  }

  private updateLayerSource = (settings: Settings) => {
    this.source = this.createSource(settings)
    this.layer.setSource(this.source)
    this.updateLayerVisibility(settings)
  }

  public updateLayerVisibility = (settings: Settings) => {
    const { enabled } = settings.maanmittauslaitos.basemap
    this.layer.setVisible(enabled)
  }

  public selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
    this.updateLayerSource(settings)
  }

  public getLayer = (): TileLayer<WMTSSource> => {
    return this.layer
  }
}
