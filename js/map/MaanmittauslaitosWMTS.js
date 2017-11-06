var MaanmittauslaitosWMTS = function(onLayersCreatedCallbackFn) {
  var mmlMaastokarttaLayer;
  var mmlTaustakarttaLayer;
  var maastokarttaLayerSource;
  var taustakarttaLayerSource;

  var init = function() {
    loadMMLWmtsCapabilitiesAndAddLayers();
  };

  var loadMMLWmtsCapabilitiesAndAddLayers = function() {
    $.ajax({
      url: 'capabilities/maanmittauslaitos_wmts_capabilities.xml',
      success: function(response) {
        addWmtsLayers(response);
      }
    });
  };

  var addWmtsLayers = function(response) {
    var parser = new ol.format.WMTSCapabilities();
    var capabilities = parser.read(response);

    maastokarttaLayerSource = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'maastokartta'
    }));
    taustakarttaLayerSource = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'taustakartta'
    }));

    mmlMaastokarttaLayer = new ol.layer.Tile({
      title: 'Maastokartta',
      source: maastokarttaLayerSource,
      visible: false
    });
    mmlTaustakarttaLayer = new ol.layer.Tile({
      title: 'Taustakartta',
      source: taustakarttaLayerSource,
      visible: true
    });

    onLayersCreatedCallbackFn(mmlMaastokarttaLayer, mmlTaustakarttaLayer)
  };

  this.getVisibleLayerName = function() {
    if(mmlMaastokarttaLayer && mmlMaastokarttaLayer.getVisible()) {
      return 'maastokartta';
    }
    else if(mmlTaustakarttaLayer && mmlTaustakarttaLayer.getVisible()) {
      return 'taustakartta';
    }
    return 'taustakartta';
  };

  this.setVisibleLayerName = function(layerName) {
    if(layerName === 'taustakartta') {
      mmlMaastokarttaLayer.setVisible(false);
      mmlTaustakarttaLayer.setVisible(true);
    }
    else if(layerName === 'maastokartta') {
      mmlMaastokarttaLayer.setVisible(true);
      mmlTaustakarttaLayer.setVisible(false);
    }
  };

  init();
};
