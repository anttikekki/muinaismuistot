var MuinaismuistotMap = function(settings, eventListeners) {
  var self = this;
  var muinaismuistotSettings = settings;
  var map;
  var view;
  var geolocation;
  var maanmittauslaitosWMTS;
  var museovirastoArcGISWMS;
  var ahvenanmaaWMTS;
  var positionAndSelectedLocation;

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

    positionAndSelectedLocation = new CurrentPositionAndSelectedLocationMarkerLayer(
      function(createdLayer) {
        map.getLayers().insertAt(4, createdLayer);
      }
    );

    // Fires also on double click but "singleclick" has 250 ms delay so it is too annoying to be used
    map.on("click", loadFeaturesOnClickedCoordinate);
  };

  var loadFeaturesOnClickedCoordinate = function(e) {
    var ahvenanmaaQuery = ahvenanmaaWMTS.getFeatureInfo(e.coordinate, view.getProjection(), view.getZoom());
    var museovirastoQuery = museovirastoArcGISWMS.identifyFeaturesAt(
      e.coordinate,
      map.getSize(),
      map.getView().calculateExtent(map.getSize())
    );

    $.when(ahvenanmaaQuery, museovirastoQuery).done(resolveFeaturesFromHttpResponseAndFireEventlistener);
  };

  var resolveFeaturesFromHttpResponseAndFireEventlistener = function(ahvenanmaaResult, museovirastoResult) {
    var ahvennamaaFeatures = ahvenanmaaResult[0].features;
    var museovirastoFeatures = museovirastoResult[0].results;
    var allFeatures = ahvennamaaFeatures.concat(museovirastoFeatures);
    if(allFeatures.length > 0) {
      eventListeners.muinaisjaannosFeaturesSelected(allFeatures);
    }
  };

  var initGeolocation = function() {
    geolocation = new ol.Geolocation({
      projection: view.getProjection(),
      tracking: true
    });

    geolocation.once('change:position', geolocationChanged);
  };

  var geolocationChanged = function() {
    self.centerToCurrentPositions();
  };

  var zoom = function(zoomChange) {
    view.animate({
      zoom: view.getZoom() + zoomChange,
      duration: 250
    });
  }

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
      positionAndSelectedLocation.addCurrentPositionMarker(position);
    }
    else {
      initGeolocation();
    }
  };

  this.showSelectedLocationMarker = function(coordinates) {
    positionAndSelectedLocation.addSelectedLocationFeatureMarker(coordinates);
  };

  this.zoomIn = function() {
    zoom(1);
  };

  this.zoomOut = function() {
    zoom(-1);
  };

  init();
}
