var MuinaismuistotData = function() {
  var self = this;
  var muinaismuistotSettings;

  this.init = function(settings) {
    muinaismuistotSettings = settings;
  };

  this.getMuinaisjaannosFeatures = function(coordinate, mapSize, mapExtent, callback) {
    var queryoptions = {
      geometry: coordinate.join(','),
      geometryType: 'esriGeometryPoint',
      tolerance: 10,
      imageDisplay: mapSize.join(',') + ',96',
      mapExtent: mapExtent.join(','),
      layers: 'visible:' + muinaismuistotSettings.getSelectedMuinaismuistotLayerIds(),
      f: 'json',
      returnGeometry: 'false'
    };

    $.getJSON(
      'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/identify?',
      queryoptions,
      function(response) {
        callback(response.results);
      }
    );
  };
};