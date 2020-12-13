import TileLayer from "ol/layer/Tile"
import WMTSCapabilities from "ol/format/WMTSCapabilities"
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS"
import { MaanmittauslaitosLayer, Settings } from "../../common/types"
import { TileSourceEvent } from "ol/source/Tile"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (
  mmlMaastokarttaLayer: TileLayer,
  mmlTaustakarttaLayer: TileLayer,
  mmlOrtokuvaLayer: TileLayer
) => void

export default class MaanmittauslaitosTileLayer {
  private settings: Settings
  private mmlMaastokarttaLayer?: TileLayer
  private mmlTaustakarttaLayer?: TileLayer
  private mmlOrtokuvaLayer?: TileLayer
  private maastokarttaLayerSource?: WMTSSource
  private taustakarttaLayerSource?: WMTSSource
  private ortokuvaLayerSource?: WMTSSource
  private showLoadingAnimationFn: ShowLoadingAnimationFn
  private onLayersCreatedCallbackFn: OnLayersCreatedCallbackFn

  public constructor(
    settings: Settings,
    showLoadingAnimationFn: ShowLoadingAnimationFn,
    onLayersCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.settings = settings
    this.showLoadingAnimationFn = showLoadingAnimationFn
    this.onLayersCreatedCallbackFn = onLayersCreatedCallbackFn
    this.loadMMLWmtsCapabilitiesAndAddLayers(settings)
  }

  private loadMMLWmtsCapabilitiesAndAddLayers = (settings: Settings) => {
    fetch(
      `${this.settings.maanmittauslaitos.url.WMTSCapabilities}?api-key=${settings.maanmittauslaitos.apiKey}`
    )
      .then((response) => response.text())
      .then((WMTSCapabilitiesXml) =>
        this.addWmtsLayers(WMTSCapabilitiesXml, settings)
      )
  }

  private addWmtsLayers = (WMTSCapabilitiesXml: string, settings: Settings) => {
    const parser = new WMTSCapabilities()
    const capabilities = parser.read(WMTSCapabilitiesXml)

    this.maastokarttaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: MaanmittauslaitosLayer.Maastokartta
      })
    )
    this.taustakarttaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: MaanmittauslaitosLayer.Taustakartta
      })
    )
    this.ortokuvaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: MaanmittauslaitosLayer.Ortokuva
      })
    )

    // Add MML api key to all layers. This API key is just for avoin-karttakuva.maanmittauslaitos.fi
    ;[
      this.maastokarttaLayerSource,
      this.taustakarttaLayerSource,
      this.ortokuvaLayerSource
    ].forEach((source) => {
      source.setUrls(
        source
          .getUrls()
          ?.map(
            (url) => `${url}api-key=${settings.maanmittauslaitos.apiKey}&`
          ) || []
      )
    })

    const selectedLayer = settings.maanmittauslaitos.selectedLayer
    this.mmlMaastokarttaLayer = new TileLayer({
      source: this.maastokarttaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Maastokartta
    })
    this.mmlTaustakarttaLayer = new TileLayer({
      source: this.taustakarttaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Taustakartta
    })
    this.mmlOrtokuvaLayer = new TileLayer({
      source: this.ortokuvaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Ortokuva
    })

    this.updateLoadingAnimationOnLayerSourceTileLoad(
      this.maastokarttaLayerSource
    )
    this.updateLoadingAnimationOnLayerSourceTileLoad(
      this.taustakarttaLayerSource
    )
    this.updateLoadingAnimationOnLayerSourceTileLoad(this.ortokuvaLayerSource)

    this.onLayersCreatedCallbackFn(
      this.mmlMaastokarttaLayer,
      this.mmlTaustakarttaLayer,
      this.mmlOrtokuvaLayer
    )
  }

  private updateLoadingAnimationOnLayerSourceTileLoad = (
    source: WMTSSource
  ) => {
    source.on("tileloadstart", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(true)
    })
    source.on("tileloadend", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false)
    })
    source.on("tileloaderror", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false)
    })
  }

  public selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
    if (
      !this.mmlMaastokarttaLayer ||
      !this.mmlTaustakarttaLayer ||
      !this.mmlOrtokuvaLayer
    ) {
      return
    }
    const layer = settings.maanmittauslaitos.selectedLayer
    this.mmlMaastokarttaLayer.setVisible(
      layer === MaanmittauslaitosLayer.Maastokartta
    )
    this.mmlTaustakarttaLayer.setVisible(
      layer === MaanmittauslaitosLayer.Taustakartta
    )
    this.mmlOrtokuvaLayer.setVisible(layer === MaanmittauslaitosLayer.Ortokuva)
  }
}
