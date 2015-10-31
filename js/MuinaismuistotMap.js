var MuinaismuistotMap = function() {
  var self = this;
  var muinaismuistotData;
  var muinaismuistotSettings;
  var map;
  var view;
  var geolocation;
  var eventListener;
  var mmlMaastokarttaLayer;
  var mmlTaustakarttaLayer;
  var nbaMuinaismuistotLayer;
  var dynamicFeatureLayer;
  var currentPositionFeature;
  var selectedLocationFeature;

  this.init = function(data, settings) {
    muinaismuistotData = data;
    muinaismuistotSettings = settings;

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

    loadMMLWmtsCapabilitiesAndAddLayers();
    addMuinaismuistotLayer();
    addDynamicFeatureLayer();

    map.on("click", function(e) {
      muinaismuistotData.identifyFeaturesAt(
        e.coordinate,
        map.getSize(),
        map.getView().calculateExtent(map.getSize()),
        function(features) {
          if(features.length > 0) {
            eventListener.muinaisjaannosFeaturesSelected(features);
          }
        }
      );
    });
  };

  var initGeolocation = function() {
    geolocation = new ol.Geolocation({
      projection: view.getProjection(),
      tracking: true
    });

    geolocation.once('change:position', function() {
      self.centerToCurrentPositions();
    });
  };

  var addCurrentPositionMarker = function(coordinates) {
    if(currentPositionFeature) {
      currentPositionFeature.getGeometry().setCoordinates(coordinates);
      return;
    }

    var fill = new ol.style.Fill({
     color: 'rgba(0, 0, 255, 1.0)'
    });
    var stroke = new ol.style.Stroke({
     color: 'rgba(255, 255, 255, 1.0)',
     width: 3
    });

    currentPositionFeature = new ol.Feature({
      geometry: new ol.geom.Point(coordinates)
    });
    currentPositionFeature.setStyle(new ol.style.Style({
     image: new ol.style.Circle({
       fill: fill,
       stroke: stroke,
       radius: 7
     }),
     fill: fill,
     stroke: stroke
    }));
    dynamicFeatureLayer.getSource().addFeature(currentPositionFeature);
  };

  var addSelectedLocationFeatureMarker = function(coordinates) {
    if(selectedLocationFeature) {
      selectedLocationFeature.getGeometry().setCoordinates(coordinates);
      return;
    }

    selectedLocationFeature = new ol.Feature({
      geometry: new ol.geom.Point(coordinates)
    });
    selectedLocationFeature.setStyle(new ol.style.Style({
     image: new ol.style.Icon({
       src: 'images/map-pin.png'
     })
    }));
    dynamicFeatureLayer.getSource().addFeature(selectedLocationFeature);
  };

  var loadMMLWmtsCapabilitiesAndAddLayers = function() {
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

    map.getLayers().insertAt(0, mmlMaastokarttaLayer);
    map.getLayers().insertAt(1, mmlTaustakarttaLayer);
  };

  var addDynamicFeatureLayer = function() {
    dynamicFeatureLayer = new ol.layer.Vector({
      source: new ol.source.Vector({})
    });
    map.addLayer(dynamicFeatureLayer);
  };

  var addMuinaismuistotLayer = function() {
    nbaMuinaismuistotLayer =  new ol.layer.Tile({
      source: new ol.source.TileArcGISRest(getMuinaismuistotLayerSourceParams())
    });
    nbaMuinaismuistotLayer.setOpacity(0.7);
    map.addLayer(nbaMuinaismuistotLayer);
  };

  var updateMuinaismuistotLayerSource = function() {
    if(nbaMuinaismuistotLayer) {
      nbaMuinaismuistotLayer.setSource(new ol.source.TileArcGISRest(getMuinaismuistotLayerSourceParams()));
    }
  };

  var getMuinaismuistotLayerSourceParams = function() {
    var layerIds = muinaismuistotSettings.getSelectedMuinaismuistotLayerIds();
    var layers = '';

    if(layerIds.length > 0) {
      layers = 'show:' + layerIds.join(',');
    }
    else {
      layers = 'hide:' + muinaismuistotSettings.getDefaultSelectedMuinaismuistotLayerIds().join(',');
    }

    return {
      url: 'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMSJULK/MapServer/export?',
      params: {
        'layers': layers,
        'layerDefs': muinaismuistotSettings.getFilterParamsLayerDefinitions()
      }
    };
  };

  this.setVisibleMuinaismuistotLayers = function(layerIds) {
    updateMuinaismuistotLayerSource();
  };

  this.setFilterParams = function(params) {
    updateMuinaismuistotLayerSource();
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

  this.setMapLocation = function(coordinates) {
    view.setCenter(coordinates);
  };

  this.centerToCurrentPositions = function() {
    if(geolocation && geolocation.getPosition()) {
      var position = geolocation.getPosition();
      view.setCenter(position);
      addCurrentPositionMarker(position);
    }
    else {
      initGeolocation();
    }
  };

  this.showSelectedLocationMarker = function(coordinates) {
    addSelectedLocationFeatureMarker(coordinates);
  };
}