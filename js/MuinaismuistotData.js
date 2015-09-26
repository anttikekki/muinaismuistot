var MuinaismuistotData = function() {
  var self = this;

  this.init = function() {
    
  };

  this.getLayerIds = function() {
    return {
      'RKY': 0,
          'RKY alueet': 1,
          'RKY viivat': 2,
          'RKY pisteet': 3,
      'Maailmanperintökohteet': 4,
          'Maailmanperintö alueet': 5,
          'Maailmanperintö pisteet': 6,
      'Rakennusperintörekisteri': 7,
          'Rakennetut alueet': 8,
          'Rakennukset': 9,
      'Muinaisjäännösrekisteri': 10,
          'Muinaisjäännösalueet': 11,
          'Muinaisj.alakohteet': 12,
          'Muinaisjäännökset': 13
    };
  };

  this.getMuinaisjaannospisteet = function(coordinate, mapSize, mapExtent, callback) {
    var queryoptions = {
      geometry: coordinate.join(','),
      geometryType: "esriGeometryPoint",
      tolerance: 10,
      imageDisplay: mapSize.join(',') + ",96",
      mapExtent: mapExtent.join(','),
      layers: "visible:" + self.getLayerIds()['Muinaisjäännökset'],
      f: "json",
      returnGeometry: "false"
    };

    $.getJSON(
      'http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/identify?',
      queryoptions,
      function(response) {
        if(!response.results.length === 0) {
          callback(null);
        }
        else {
          callback(response.results[0]);
        }
      }
    );
  };
};