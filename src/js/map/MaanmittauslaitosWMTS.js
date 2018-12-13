import $ from "jquery";
import TileLayer from "ol/layer/Tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTSSource, { optionsFromCapabilities } from "ol/source/WMTS";

export default function MaanmittauslaitosWMTS(
  muinaismuistotSettings,
  showLoadingAnimationFn,
  onLayersCreatedCallbackFn
) {
  var mmlMaastokarttaLayer;
  var mmlTaustakarttaLayer;
  var mmlOrtokuvaLayer;
  var maastokarttaLayerSource;
  var taustakarttaLayerSource;
  var ortokuvaLayerSource;

  var init = function() {
    loadMMLWmtsCapabilitiesAndAddLayers();
  };

  var loadMMLWmtsCapabilitiesAndAddLayers = function() {
    $.ajax({
      url: muinaismuistotSettings.getMaanmittauslaitosWMTSCapabilitiesURL(),
      success: function(response) {
        addWmtsLayers(response);
      }
    });
  };

  var addWmtsLayers = function(response) {
    var parser = new WMTSCapabilities();
    var capabilities = parser.read(response);

    maastokarttaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: "maastokartta"
      })
    );
    taustakarttaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: "taustakartta"
      })
    );
    ortokuvaLayerSource = new WMTSSource(
      optionsFromCapabilities(capabilities, {
        layer: "ortokuva"
      })
    );

    mmlMaastokarttaLayer = new TileLayer({
      title: "Maastokartta",
      source: maastokarttaLayerSource,
      visible: false
    });
    mmlTaustakarttaLayer = new TileLayer({
      title: "Taustakartta",
      source: taustakarttaLayerSource,
      visible: true
    });
    mmlOrtokuvaLayer = new TileLayer({
      title: "Ortokuva",
      source: ortokuvaLayerSource,
      visible: false
    });

    updateLoadingAnimationOnLayerSourceTileLoad(maastokarttaLayerSource);
    updateLoadingAnimationOnLayerSourceTileLoad(taustakarttaLayerSource);
    updateLoadingAnimationOnLayerSourceTileLoad(ortokuvaLayerSource);

    onLayersCreatedCallbackFn(
      mmlMaastokarttaLayer,
      mmlTaustakarttaLayer,
      mmlOrtokuvaLayer
    );
  };

  var updateLoadingAnimationOnLayerSourceTileLoad = function(source) {
    source.on("tileloadstart", function() {
      showLoadingAnimationFn(true);
    });
    source.on("tileloadend", function() {
      showLoadingAnimationFn(false);
    });
    source.on("tileloaderror", function() {
      showLoadingAnimationFn(false);
    });
  };

  this.getVisibleLayerName = function() {
    if (mmlMaastokarttaLayer && mmlMaastokarttaLayer.getVisible()) {
      return "maastokartta";
    } else if (mmlTaustakarttaLayer && mmlTaustakarttaLayer.getVisible()) {
      return "taustakartta";
    } else if (mmlOrtokuvaLayer && mmlOrtokuvaLayer.getVisible()) {
      return "ortokuva";
    }
    return "taustakartta";
  };

  this.setVisibleLayerName = function(layerName) {
    if (layerName === "taustakartta") {
      mmlMaastokarttaLayer.setVisible(false);
      mmlTaustakarttaLayer.setVisible(true);
      mmlOrtokuvaLayer.setVisible(false);
    } else if (layerName === "maastokartta") {
      mmlMaastokarttaLayer.setVisible(true);
      mmlTaustakarttaLayer.setVisible(false);
      mmlOrtokuvaLayer.setVisible(false);
    } else if (layerName === "ortokuva") {
      mmlMaastokarttaLayer.setVisible(false);
      mmlTaustakarttaLayer.setVisible(false);
      mmlOrtokuvaLayer.setVisible(true);
    }
  };

  init();
}
