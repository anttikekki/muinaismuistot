export default function FeatureParser(muinaismuistotSettings) {

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

  /**
  * Resolves timespan in years for timing name.
  *
  * @param {string} name Timing name in SE or FI. Example: "Sentida" or "rautakautinen".
  * @return {string} timespan. Example: "1200 - 1600". Returns undefined if there is no timspan for timing name.
  */
  this.getTimespanInYearsForTimingName = function(name) {
    var timings = {
      'Stenålder': '8600–1500 eaa.',
      'Bronsålder': '1700 – 500 eaa.',
      'Brons/Ä järnålder': '1700 eaa. – 1200 jaa.',
      'Yngre järnålder': '500 eaa. – 400 jaa.',
      'Äldre järnålder': '800 – 1200 jaa.',
      'Järnålder': '500 eaa. - 1200 jaa.',
      'Järnålder/Medeltid': '500 eaa. – 1570 jaa.',
      'Medeltida': '1200 - 1570 jaa.',
      'Sentida': '1800 jaa. -',
      'esihistoriallinen': '8600 eaa. - 1200 jaa.',
      'kivikautinen': '8600 – 1500 eaa.',
      'varhaismetallikautinen': '1500 eaa. - 200 jaa.',
      'pronssikautinen': '1700 – 500 eaa.',
      'rautakautinen': '500 eaa. - 1200 jaa.',
      'keskiaikainen': '1200 - 1570 jaa.',
      'historiallinen': '1200 jaa. -',
      'moderni': '1800 jaa -'
    };
    return timings[name];
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
