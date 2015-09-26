var MuinaismuistotMap = function() {
  var self = this;
  this.muinaismuistotData;
  this.map;
  this.view;
  this.eventListener;
  this.mmlMaastokarttaLayer;
  this.mmlTaustakarttaLayer;

  this.init = function(muinaismuistotData) {
    this.muinaismuistotData = muinaismuistotData;
    this.loadWmtsCapabilities();

    proj4.defs("EPSG:3067","+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    var extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902];
    ol.proj.get('EPSG:3067').setExtent(extent);

    this.view = new ol.View({
      center: [387685, 6679679],
      projection: 'EPSG:3067',
      zoom: 11
    });
    
    this.map = new ol.Map({
      target: 'map',
      view: this.view,
      renderer: 'canvas'
    });

    var geolocation = new ol.Geolocation({
      projection: this.view.getProjection(),
      tracking: true
    });
    geolocation.once('change:position', function() {
      self.view.setCenter(geolocation.getPosition());
    });

    this.map.on("click", function(e) {
      self.muinaismuistotData.getMuinaisjaannospisteet(
        e.coordinate,
        self.map.getSize(),
        self.map.getView().calculateExtent(self.map.getSize()),
        function(muinaisjaannos) {
          if(muinaisjaannos) {
            self.eventListener.muinaisjaannosSelected(muinaisjaannos);
          }
        }
      );
    });
  };

  this.loadWmtsCapabilities = function() {
    $.ajax({
      url: 'http://avoindata.maanmittauslaitos.fi/mapcache/wmts?service=wmts&request=getcapabilities&version=1.0.0',
      success: function(response) {
        self.addWmtsLayers(response);
      }
    });
  };

  this.addWmtsLayers = function(response) {
    var parser = new ol.format.WMTSCapabilities();
    var capabilities = parser.read(response);

    var maastokarttaLayerSource = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'maastokartta'
    }));
    var taustakarttaLayerSource = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'taustakartta'
    }));

    this.mmlMaastokarttaLayer = new ol.layer.Tile({
      title: 'Maastokartta',
      source: maastokarttaLayerSource,
      visible: false
    });
    this.mmlTaustakarttaLayer = new ol.layer.Tile({
      title: 'Taustakartta',
      source: taustakarttaLayerSource,
      visible: true
    });

    this.map.addLayer(this.mmlMaastokarttaLayer);
    this.map.addLayer(this.mmlTaustakarttaLayer);
    this.addMuinaismuistotLayer();
  };

  this.addMuinaismuistotLayer = function() {
    var layer =  new ol.layer.Tile({
      source: new ol.source.TileArcGISRest({
        url: 'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMSJULK/MapServer/export?'
      })
    });
    this.map.addLayer(layer);
  };

  this.setEventListener = function(listener) {
    this.eventListener = listener;
  };

  this.getVisibleBackgroundLayerName = function() {
    if(this.mmlMaastokarttaLayer && this.mmlMaastokarttaLayer.getVisible()) {
      return 'maastokartta';
    }
    else if(this.mmlTaustakarttaLayer && this.mmlTaustakarttaLayer.getVisible()) {
      return 'taustakartta';
    }
    return 'taustakartta';
  };

  this.setVisibleBackgroundLayerName = function(layerName) {
    if(layerName === 'taustakartta') {
      this.mmlMaastokarttaLayer.setVisible(false);
      this.mmlTaustakarttaLayer.setVisible(true);
    }
    else if(layerName === 'maastokartta') {
      this.mmlMaastokarttaLayer.setVisible(true);
      this.mmlTaustakarttaLayer.setVisible(false);
    }
  };
}