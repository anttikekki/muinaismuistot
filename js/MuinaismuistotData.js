var MuinaismuistotData = function() {
  var self = this;
  var muinaismuistotSettings;
  var loadingAnimationTimeoutID;

  this.init = function(settings) {
    muinaismuistotSettings = settings;
  };

  this.identifyFeaturesAt = function(coordinate, mapSize, mapExtent, callback) {
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

  this.findFeatures = function(searchText, callback) {
    var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    var selectedSubLayers = muinaismuistotSettings.getSelectedMuinaismuistotLayerSubLayerIds();

    //Muinaismustot areas and sub-points arlways has same name as main point so do not search those
    var areaIndex = selectedSubLayers.indexOf(layerMap['Muinaisjäännösalueet']);
    if (areaIndex > -1) {
      selectedSubLayers.splice(areaIndex, 1);
    }
    var subPointIndex = selectedSubLayers.indexOf(layerMap['Muinaisj.alakohteet']);
    if (subPointIndex > -1) {
      selectedSubLayers.splice(subPointIndex, 1);
    }

    var queryoptions = {
      searchText: searchText,
      contains: true,
      searchFields: 'Kohdenimi, Nimi, KOHDENIMI',
      layers: selectedSubLayers.join(','), //Sub-layers
      f: 'json',
      returnGeometry: 'true',
      returnZ: 'false'
    };
    showLoadingAnimation(true);

    $.getJSON(
      'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/find?',
      queryoptions,
      function(response) {
        callback(response.results);
        showLoadingAnimation(false);
      }
    );
  };

  this.getFeatureName = function(feature) {
    var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    switch (feature.layerId) {
      case layerMap['Muinaisjäännökset']:
      case layerMap['Muinaisj.alakohteet']:
      case layerMap['Muinaisjäännösalueet']:
        return feature.attributes.Kohdenimi;
        break;
      case layerMap['RKY alueet']:
      case layerMap['RKY viivat']:
      case layerMap['RKY pisteet']:
        return feature.attributes.KOHDENIMI;
        break;
      case layerMap['Maailmanperintö alueet']:
      case layerMap['Maailmanperintö pisteet']:
      case layerMap['Rakennetut alueet']:
      case layerMap['Rakennukset']:
        return feature.attributes.Nimi;
        break;
    }
  };

  this.getFeatureTypeName = function(feature) {
    var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    switch (feature.layerId) {
      case layerMap['Muinaisjäännökset']:
      case layerMap['Muinaisj.alakohteet']:
      case layerMap['Muinaisjäännösalueet']:
        return 'Muinaisjäännös';
        break;
      case layerMap['RKY alueet']:
      case layerMap['RKY viivat']:
      case layerMap['RKY pisteet']:
        return 'Rakennettu kulttuuriympäristö';
        break;
      case layerMap['Maailmanperintö alueet']:
      case layerMap['Maailmanperintö pisteet']:
        return 'Maailmanperintökohde';
        break;
      case layerMap['Rakennetut alueet']:
      case layerMap['Rakennukset']:
        return 'Rakennusperintökohde';
        break;
    }
  };

  this.getFeatureTypeIconURL = function(feature) {
    return muinaismuistotSettings.getLayerIconURL(feature.layerId);
  };

  this.getFeatureLocation = function(feature) {
    if(feature.geometryType === 'esriGeometryPolygon') {
      var point = feature.geometry.rings[0][0];
      return {
        x: point[0],
        y: point[1]
      };
    }
    else if(feature.geometryType === 'esriGeometryPoint') {
      return feature.geometry;
    }
    else if(feature.geometryType === 'esriGeometryPolyline') {
      var point = feature.geometry.paths[0][0];
      return {
        x: point[0],
        y: point[1]
      };
    }
  };

  this.trimTextData = function(value) {
    if(value == null) { //Null and undefined
      return '';
    }

    value = value.trim();
    if(value.toLowerCase() === 'null') {
      return ''; //For  example RKY ajoitus field may sometimes be 'Null'
    }

    //Remove trailing commas
    while(value.substr(value.length-1, 1) === ',') {
          value = value.substring(0, value.length-1).trim();
      }
      return value;
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