import $ from "jquery";
import TileLayer from "ol/layer/Tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS";
import Settings from "../Settings";
import { MaanmittauslaitosLayer } from "../data";
import { TileSourceEvent } from "ol/source/Tile";

export type ShowLoadingAnimationFn = (show: boolean) => void;
export type OnLayersCreatedCallbackFn = (
  mmlMaastokarttaLayer: TileLayer,
  mmlTaustakarttaLayer: TileLayer,
  mmlOrtokuvaLayer: TileLayer
) => void;

export default class MaanmittauslaitosWMTS {
  private mmlMaastokarttaLayer: TileLayer;
  private mmlTaustakarttaLayer: TileLayer;
  private mmlOrtokuvaLayer: TileLayer;
  private maastokarttaLayerSource: WMTSSource;
  private taustakarttaLayerSource: WMTSSource;
  private ortokuvaLayerSource: WMTSSource;
  private muinaismuistotSettings: Settings;
  private showLoadingAnimationFn: ShowLoadingAnimationFn;
  private onLayersCreatedCallbackFn: OnLayersCreatedCallbackFn;

  public constructor(
    muinaismuistotSettings: Settings,
    showLoadingAnimationFn: ShowLoadingAnimationFn,
    onLayersCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.muinaismuistotSettings = muinaismuistotSettings;
    this.showLoadingAnimationFn = showLoadingAnimationFn;
    this.onLayersCreatedCallbackFn = onLayersCreatedCallbackFn;
    this.loadMMLWmtsCapabilitiesAndAddLayers();
  }

  private loadMMLWmtsCapabilitiesAndAddLayers = () => {
    $.ajax({
      url: this.muinaismuistotSettings.getMaanmittauslaitosWMTSCapabilitiesURL(),
      success: (response: string) => {
        this.addWmtsLayers(response);
      }
    });
  };

  private addWmtsLayers = (WMTSCapabilitiesXml: string) => {
    var parser = new WMTSCapabilities();
    var capabilities = parser.read(WMTSCapabilitiesXml);

    this.maastokarttaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: MaanmittauslaitosLayer.Maastokartta
      })
    );
    this.taustakarttaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: MaanmittauslaitosLayer.Taustakartta
      })
    );
    this.ortokuvaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: MaanmittauslaitosLayer.Ortokuva
      })
    );

    this.mmlMaastokarttaLayer = new TileLayer({
      source: this.maastokarttaLayerSource,
      visible: false
    });
    this.mmlTaustakarttaLayer = new TileLayer({
      source: this.taustakarttaLayerSource,
      visible: true
    });
    this.mmlOrtokuvaLayer = new TileLayer({
      source: this.ortokuvaLayerSource,
      visible: false
    });

    this.updateLoadingAnimationOnLayerSourceTileLoad(
      this.maastokarttaLayerSource
    );
    this.updateLoadingAnimationOnLayerSourceTileLoad(
      this.taustakarttaLayerSource
    );
    this.updateLoadingAnimationOnLayerSourceTileLoad(this.ortokuvaLayerSource);

    this.onLayersCreatedCallbackFn(
      this.mmlMaastokarttaLayer,
      this.mmlTaustakarttaLayer,
      this.mmlOrtokuvaLayer
    );
  };

  private updateLoadingAnimationOnLayerSourceTileLoad = (
    source: WMTSSource
  ) => {
    source.on("tileloadstart", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(true);
    });
    source.on("tileloadend", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false);
    });
    source.on("tileloaderror", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false);
    });
  };

  public getVisibleLayerName = (): MaanmittauslaitosLayer => {
    if (this.mmlMaastokarttaLayer && this.mmlMaastokarttaLayer.getVisible()) {
      return MaanmittauslaitosLayer.Maastokartta;
    } else if (
      this.mmlTaustakarttaLayer &&
      this.mmlTaustakarttaLayer.getVisible()
    ) {
      return MaanmittauslaitosLayer.Taustakartta;
    } else if (this.mmlOrtokuvaLayer && this.mmlOrtokuvaLayer.getVisible()) {
      return MaanmittauslaitosLayer.Ortokuva;
    }
    return MaanmittauslaitosLayer.Taustakartta;
  };

  public setVisibleLayerName = function(layerName: MaanmittauslaitosLayer) {
    if (layerName === MaanmittauslaitosLayer.Taustakartta) {
      this.mmlMaastokarttaLayer.setVisible(false);
      this.mmlTaustakarttaLayer.setVisible(true);
      this.mmlOrtokuvaLayer.setVisible(false);
    } else if (layerName === MaanmittauslaitosLayer.Maastokartta) {
      this.mmlMaastokarttaLayer.setVisible(true);
      this.mmlTaustakarttaLayer.setVisible(false);
      this.mmlOrtokuvaLayer.setVisible(false);
    } else if (layerName === MaanmittauslaitosLayer.Ortokuva) {
      this.mmlMaastokarttaLayer.setVisible(false);
      this.mmlTaustakarttaLayer.setVisible(false);
      this.mmlOrtokuvaLayer.setVisible(true);
    }
  };
}
