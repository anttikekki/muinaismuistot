function init() {
  var map, capabilities;
  var parser = new ol.format.WMTSCapabilities();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://avoindata.maanmittauslaitos.fi/mapcache/wmts?service=wmts&request=getcapabilities&version=1.0.0', true);

  proj4.defs("EPSG:3067","+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

  var extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902];
  ol.proj.get('EPSG:3067').setExtent(extent);

  var view = new ol.View({
    center: [387685, 6679679],
    projection: 'EPSG:3067',
    zoom: 11
  });

  var fill = new ol.style.Fill({
   color: 'rgba(255,0,0,0.5)'
  });
  var stroke = new ol.style.Stroke({
   color: '#FF0000',
   width: 1.25
  });

  var vectorLoader = function(extent, resolution, projection) {
    var url = 'api/index.php?viewbox=' + extent.join(',');

    $.ajax({
      url: url,
      success: loadFeatures
    });
  };

  var loadFeatures = function(response) {
    var features = vectorSource.readFeatures(response);
    vectorSource.addFeatures(features);
  };

  var vectorSource = new ol.source.ServerVector({
      format: new ol.format.GeoJSON(),
      loader: vectorLoader,
      strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
        maxZoom: 15
      }))
    });

  var geojsonLayer = new ol.layer.Vector({
    source: vectorSource,
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

  /**
   * onload handler for the XHR request.
   */
  xhr.onload = function() {
    if (xhr.status == 200) {
      capabilities = parser.read(xhr.responseXML);

      var mmlLayer = new ol.layer.Tile({
        source: new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
          layer: 'maastokartta'
        }))
      });

      map = new ol.Map({
        layers: [mmlLayer, geojsonLayer],
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
        console.log(geolocation.getPosition());
      });

      map.on("click", function(e) {
          map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
              //do something
          }
      };
    }
  };
  xhr.send();





  // Use FastClick to eliminate the 300ms delay between a physical tap
  // and the firing of a click event on mobile browsers.
  // See http://updates.html5rocks.com/2013/12/300ms-tap-delay-gone-away
  // for more information.
  FastClick.attach(document.body);
}