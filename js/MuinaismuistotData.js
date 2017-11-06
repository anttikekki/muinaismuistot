var MuinaismuistotData = function() {
  var muinaismuistotSettings;

  this.init = function(settings) {
    muinaismuistotSettings = settings;
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
    else if(feature.geometry && feature.geometry.type === 'MultiPolygon') {
      // Ahvenanmaan muinaismuisto
      var point = feature.geometry.coordinates[0][0][0];
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
};
