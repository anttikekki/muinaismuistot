var MuinaismuistotMap = function(settings, eventListeners) {
  var self = this;
  var muinaismuistotSettings = settings;
  var map;
  var view;
  var geolocation;
  var dynamicFeatureLayer;
  var currentPositionFeature;
  var selectedLocationFeature;
  var maanmittauslaitosWMTS;
  var museovirastoArcGISWMS;
  var ahvenanmaaWMTS;

  var init = function() {
    proj4.defs("EPSG:3067","+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    var extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902];
    ol.proj.get('EPSG:3067').setExtent(extent);

    view = new ol.View({
      center: [387685, 6679679],
      projection: 'EPSG:3067',
      zoom: 8
    });

    map = new ol.Map({
      target: 'map',
      view: view,
      renderer: 'canvas',
      controls: new ol.Collection()
    });

    addDynamicFeatureLayer();

    maanmittauslaitosWMTS = new MaanmittauslaitosWMTS(
      function(mmlMaastokarttaLayer, mmlTaustakarttaLayer) {
        map.getLayers().insertAt(0, mmlMaastokarttaLayer);
        map.getLayers().insertAt(1, mmlTaustakarttaLayer);
      }
    );

    ahvenanmaaWMTS = new AhvenanmaaWMTS(
      eventListeners.showLoadingAnimation,
      function(createdLayer) {
        map.getLayers().insertAt(2, createdLayer);
      }
    );

    museovirastoArcGISWMS = new MuseovirastoArcGISWMS(
      muinaismuistotSettings,
      eventListeners.showLoadingAnimation,
      function(createdLayer) {
        map.getLayers().insertAt(3, createdLayer);
      }
    );

    map.on("click", function(e) {
      ahvenanmaaWMTS.getFeatureInfo(map, e.coordinate, function(features) {
        if(features.length > 0) {
          eventListeners.muinaisjaannosFeaturesSelected(features);
        }
      });

      museovirastoArcGISWMS.identifyFeaturesAt(
        e.coordinate,
        map.getSize(),
        map.getView().calculateExtent(map.getSize()),
        function(features) {
          if(features.length > 0) {
            eventListeners.muinaisjaannosFeaturesSelected(features);
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

  var addDynamicFeatureLayer = function() {
    dynamicFeatureLayer = new ol.layer.Vector({
      source: new ol.source.Vector({})
    });
    map.addLayer(dynamicFeatureLayer);
  };

  this.updateVisibleMuinaismuistotLayersFromSettings = function() {
    museovirastoArcGISWMS.updateVisibleLayersFromSettings();
  };

  this.updateMuinaismuistotFilterParamsFromSettings = function() {
    museovirastoArcGISWMS.updateVisibleLayersFromSettings();
  };

  this.searchMuinaismuistoja = function(searchText, callbackFn) {
    museovirastoArcGISWMS.findFeatures(searchText, callbackFn);
  };

  this.getVisibleMaanmittauslaitosLayerName = function() {
    return maanmittauslaitosWMTS.getVisibleLayerName();
  };

  this.setVisibleMaanmittauslaitosLayerName = function(layerName) {
    maanmittauslaitosWMTS.setVisibleLayerName(layerName);
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

  this.zoomIn = function() {
    zoom(1);
  };

  this.zoomOut = function() {
    zoom(-1);
  };

  var zoom = function(zoomChange) {
    view.animate({
      zoom: view.getZoom() + zoomChange,
      duration: 250
    });
  }

  init();
}
