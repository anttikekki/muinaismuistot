var MuinaismuistotMap = function() {
  var self = this;
  var muinaismuistotData;
  var map;
  var view;
  var eventListener;
  var mmlMaastokarttaLayer;
  var mmlTaustakarttaLayer;
  var nbaMuinaismuistotLayer;
  var visibleMuinaismuistotLayerIds;
  var muinaismuistotSettings;

  this.init = function(data, settings) {
    muinaismuistotData = data;
    muinaismuistotSettings = settings;
    loadWmtsCapabilities();

    proj4.defs("EPSG:3067","+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    var extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902];
    ol.proj.get('EPSG:3067').setExtent(extent);

    view = new ol.View({
      center: [387685, 6679679],
      projection: 'EPSG:3067',
      zoom: 11
    });
    
    map = new ol.Map({
      target: 'map',
      view: view,
      renderer: 'canvas'
    });

    var geolocation = new ol.Geolocation({
      projection: view.getProjection(),
      tracking: true
    });
    geolocation.once('change:position', function() {
      view.setCenter(geolocation.getPosition());
    });

    map.on("click", function(e) {
      muinaismuistotData.getMuinaisjaannospisteet(
        e.coordinate,
        map.getSize(),
        map.getView().calculateExtent(map.getSize()),
        function(muinaisjaannos) {
          if(muinaisjaannos) {
            eventListener.muinaisjaannosSelected(muinaisjaannos);
          }
        }
      );
    });
  };

  var loadWmtsCapabilities = function() {
    $.ajax({
      url: 'http://avoindata.maanmittauslaitos.fi/mapcache/wmts?service=wmts&request=getcapabilities&version=1.0.0',
      success: function(response) {
        addWmtsLayers(response);
      }
    });
  };

  var addWmtsLayers = function(response) {
    var parser = new ol.format.WMTSCapabilities();
    var capabilities = parser.read(response);

    var maastokarttaLayerSource = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'maastokartta'
    }));
    var taustakarttaLayerSource = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
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

    map.addLayer(mmlMaastokarttaLayer);
    map.addLayer(mmlTaustakarttaLayer);
    addMuinaismuistotLayer();
  };

  var addMuinaismuistotLayer = function() {
    nbaMuinaismuistotLayer =  new ol.layer.Tile({
      source: new ol.source.TileArcGISRest(getMuinaismuistotLayerSourceParams())
    });
    map.addLayer(nbaMuinaismuistotLayer);
  };

  this.setVisibleMuinaismuistotLayers = function(layerIds) {
    visibleMuinaismuistotLayerIds = layerIds;
    if(nbaMuinaismuistotLayer) {
      nbaMuinaismuistotLayer.setSource(new ol.source.TileArcGISRest(getMuinaismuistotLayerSourceParams()));
    }
  };

  var getMuinaismuistotLayerSourceParams = function() {
    var layers = 'show:' + muinaismuistotSettings.getSelectedMuinaismuistotLayerIds().join(',');

    return {
      url: 'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMSJULK/MapServer/export?',
      params: {
        'LAYERS': layers
      }
    };
  };

  this.setEventListener = function(listener) {
    eventListener = listener;
  };

  this.getVisibleBackgroundLayerName = function() {
    if(mmlMaastokarttaLayer && mmlMaastokarttaLayer.getVisible()) {
      return 'maastokartta';
    }
    else if(mmlTaustakarttaLayer && mmlTaustakarttaLayer.getVisible()) {
      return 'taustakartta';
    }
    return 'taustakartta';
  };

  this.setVisibleBackgroundLayerName = function(layerName) {
    if(layerName === 'taustakartta') {
      mmlMaastokarttaLayer.setVisible(false);
      mmlTaustakarttaLayer.setVisible(true);
    }
    else if(layerName === 'maastokartta') {
      mmlMaastokarttaLayer.setVisible(true);
      mmlTaustakarttaLayer.setVisible(false);
    }
  };
}