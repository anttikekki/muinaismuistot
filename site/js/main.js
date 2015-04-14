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

  var image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

var styles = {
  'Point': [new ol.style.Style({
    image: image
  })],
  'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiLineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiPoint': [new ol.style.Style({
    image: image
  })],
  'MultiPolygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  })],
  'Polygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'GeometryCollection': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'magenta'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'magenta'
      })
    })
  })],
  'Circle': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })]
};

var styleFunction = function(feature, resolution) {
  console.log(feature);
  return styles[feature.getGeometry().getType()];
};


  var geojsonSource = new ol.source.GeoJSON({
    projection: 'EPSG:3067',
    url: 'testi.geojson'
  });

  var geojsonLayer = new ol.layer.Vector({
    source: geojsonSource,
    style: styleFunction
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
    }
  };
  xhr.send();





  // Use FastClick to eliminate the 300ms delay between a physical tap
  // and the firing of a click event on mobile browsers.
  // See http://updates.html5rocks.com/2013/12/300ms-tap-delay-gone-away
  // for more information.
  FastClick.attach(document.body);
}