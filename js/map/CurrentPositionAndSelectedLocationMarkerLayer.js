var CurrentPositionAndSelectedLocationMarkerLayer = function(onLayerCreatedCallbackFn) {
  var layer;
  var source;
  var currentPositionFeature;
  var selectedLocationFeature;

  var init = function() {
    addLayer();
  };

  var addLayer = function() {
    source = new ol.source.Vector({});
    layer = new ol.layer.Vector({
      source: source
    });
    onLayerCreatedCallbackFn(layer);
  };

  this.addCurrentPositionMarker = function(coordinates) {
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
    source.addFeature(currentPositionFeature);
  };

  this.addSelectedLocationFeatureMarker = function(coordinates) {
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
    source.addFeature(selectedLocationFeature);
  };

  init();
};
