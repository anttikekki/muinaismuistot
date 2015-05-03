var MuinaismuistotMap = function() {
  var self = this;
  this.apiUrl;
  this.map;
  this.view;
  this.eventListener;
  this.mmlMaastokarttaLayer;
  this.mmlTaustakarttaLayer;

  this.init = function(apiUrl) {
    this.apiUrl = apiUrl;
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
      var muinaisjaannosTunnus;
      self.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        muinaisjaannosTunnus = feature.n.MJTUNNUS
      });

      if(muinaisjaannosTunnus) {
        self.eventListener.muinaisjaannosSelected(muinaisjaannosTunnus);
      }
    });

    // Use FastClick to eliminate the 300ms delay between a physical tap
    // and the firing of a click event on mobile browsers.
    // See http://updates.html5rocks.com/2013/12/300ms-tap-delay-gone-away
    // for more information.
    FastClick.attach(document.body);
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
    this.addKuntarajatLayer();
    this.addMaakuntarajatLayer();
    this.addMaakuntasummatLayer();
  };

  this.addMuinaismuistotLayer = function() {
    var fill = new ol.style.Fill({
     color: 'rgba(255,0,0,0.5)'
    });
    var stroke = new ol.style.Stroke({
     color: '#FF0000',
     width: 1.25
    });

    var vectorSource = new ol.source.ServerVector({
        format: new ol.format.GeoJSON(),
        loader: function(extent, resolution, projection) {
          var url = self.apiUrl + '?format=geojson&columns=X,Y,MJTUNNUS&viewbox=' + extent.join(',');

          $.ajax({
            url: url,
            success: function(response) {
              var features = vectorSource.readFeatures(response);
              vectorSource.addFeatures(features);
            }
          });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
          maxZoom: 15
        }))
      });

    var muinaismuistotLayer = new ol.layer.Vector({
      source: vectorSource,
      minResolution: 0,
      maxResolution: 30,
      style: new ol.style.Style({
         image: new ol.style.Circle({
           fill: fill,
           stroke: stroke,
           radius: 8
         }),
         fill: fill,
         stroke: stroke
       })
    });

    this.map.addLayer(muinaismuistotLayer);
  };

  this.addKuntarajatLayer = function() {

    var kuntarajatSource = new ol.source.GeoJSON({
      projection: 'EPSG:3067',
      url: 'data/kuntarajat.geojson'
    });

    var kuntarajatLayer = new ol.layer.Vector({
      source: kuntarajatSource,
      minResolution: 30,
      maxResolution: 200,
      style : new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3
        })
      })
    });

    this.map.addLayer(kuntarajatLayer);
  };

  this.addMaakuntarajatLayer = function() {

    var maakuntarajatSource = new ol.source.GeoJSON({
      projection: 'EPSG:3067',
      url: 'data/maakuntarajat.geojson'
    });

    var maakuntarajatLayer = new ol.layer.Vector({
      source: maakuntarajatSource,
      minResolution: 200,
      style : new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3
        })
      })
    });

    this.map.addLayer(maakuntarajatLayer);
  };

  this.addMaakuntasummatLayer = function() {
    
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