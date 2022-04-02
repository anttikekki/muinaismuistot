import TileLayer from "ol/layer/WebGLTile"
import WMTSCapabilities from "ol/format/WMTSCapabilities"
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS"
import { MaanmittauslaitosLayer } from "../../common/types"
import { TileSourceEvent } from "ol/source/Tile"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (
  mmlMaastokarttaLayer: TileLayer,
  mmlTaustakarttaLayer: TileLayer,
  mmlOrtokuvaLayer: TileLayer
) => void

export default class MaanmittauslaitosTileLayer {
  private store: Store<Settings, ActionTypes>
  private mmlMaastokarttaLayer?: TileLayer
  private mmlTaustakarttaLayer?: TileLayer
  private mmlOrtokuvaLayer?: TileLayer
  private maastokarttaLayerSource?: WMTSSource
  private taustakarttaLayerSource?: WMTSSource
  private ortokuvaLayerSource?: WMTSSource
  private updateTileLoadingStatus: ShowLoadingAnimationFn
  private onLayersCreatedCallbackFn: OnLayersCreatedCallbackFn

  public constructor(
    store: Store<Settings, ActionTypes>,
    updateTileLoadingStatus: ShowLoadingAnimationFn,
    onLayersCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.store = store
    this.updateTileLoadingStatus = updateTileLoadingStatus
    this.onLayersCreatedCallbackFn = onLayersCreatedCallbackFn
    this.loadMMLWmtsCapabilitiesAndAddLayers()
  }

  private loadMMLWmtsCapabilitiesAndAddLayers = () => {
    const settings = this.store.getState()
    fetch(
      `${settings.maanmittauslaitos.url.WMTSCapabilities}?api-key=${settings.maanmittauslaitos.apiKey}`
    )
      .then((response) => response.text())
      .then((WMTSCapabilitiesXml) =>
        this.addWmtsLayers(WMTSCapabilitiesXml, settings)
      )
  }

  private addWmtsLayers = (WMTSCapabilitiesXml: string, settings: Settings) => {
    const parser = new WMTSCapabilities()
    const capabilities = parser.read(WMTSCapabilitiesXml)

    const maastokarttaOptions = optionsFromCapabilities(capabilities, {
      layer: MaanmittauslaitosLayer.Maastokartta
    })
    const taustakarttaOptions = optionsFromCapabilities(capabilities, {
      layer: MaanmittauslaitosLayer.Taustakartta
    })
    const ortokuvaOptions = optionsFromCapabilities(capabilities, {
      layer: MaanmittauslaitosLayer.Ortokuva
    })

    if (!maastokarttaOptions || !taustakarttaOptions || !ortokuvaOptions) {
      return
    }

    this.maastokarttaLayerSource = new WMTSSource(maastokarttaOptions)
    this.taustakarttaLayerSource = new WMTSSource(taustakarttaOptions)
    this.ortokuvaLayerSource = new WMTSSource(ortokuvaOptions)

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
      visible: selectedLayer === MaanmittauslaitosLayer.Maastokartta,
      /**
       * Limit cache size to fix iOS 15 Safari crash
       * @see https://github.com/openlayers/openlayers/issues/12908#issuecomment-1023572875
       */
      cacheSize: 128
    })
    this.mmlTaustakarttaLayer = new TileLayer({
      source: this.taustakarttaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Taustakartta,
      /**
       * Limit cache size to fix iOS 15 Safari crash
       * @see https://github.com/openlayers/openlayers/issues/12908#issuecomment-1023572875
       */
      cacheSize: 128
    })
    this.mmlOrtokuvaLayer = new TileLayer({
      source: this.ortokuvaLayerSource,
      visible: selectedLayer === MaanmittauslaitosLayer.Ortokuva,
      /**
       * Limit cache size to fix iOS 15 Safari crash
       * @see https://github.com/openlayers/openlayers/issues/12908#issuecomment-1023572875
       */
      cacheSize: 128
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
      this.updateTileLoadingStatus(true)
    })
    source.on("tileloadend", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })
    source.on("tileloaderror", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })
  }

  public selectedMaanmittauslaitosLayerChanged = () => {
    const settings = this.store.getState()
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
