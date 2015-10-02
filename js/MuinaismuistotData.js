var MuinaismuistotData = function() {
  var self = this;
  var muinaismuistotSettings;
  var loadingAnimationTimeoutID;

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
      layers: 'visible:' + muinaismuistotSettings.getSelectedMuinaismuistotLayerIds().join(','),
      f: 'json',
      returnGeometry: 'false'
    };
    showLoadingAnimation(true);

    $.getJSON(
      'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/identify?',
      queryoptions,
      function(response) {
        callback(response.results);
        showLoadingAnimation(false);
      }
    );
  };

  var showLoadingAnimation = function(show) {
    if(show) {
      loadingAnimationTimeoutID = window.setTimeout(function() {
        if(loadingAnimationTimeoutID) {
          $('#loading-animation').removeClass('hidden');
        }
      }, 300);
    }
    else {
      window.clearTimeout(loadingAnimationTimeoutID);
      loadingAnimationTimeoutID = null;
      $('#loading-animation').addClass('hidden');
    }
  };
};