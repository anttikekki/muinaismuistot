var MuinaismuistotSettings = function() {
  var self = this;
  var eventListener = null;
  var selectedLayerIds = [];
  var selectedBackgroundMapLayerName = '';
  var searchParameters = {
      //RKY - Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt
      'RKY alueet': {
        layerId: 1
      },
      'RKY viivat': {
        layerId: 2
      },
      'RKY pisteet': {
        layerId: 3
      },
  
      //Maailmanperintökohteet
      'Maailmanperintö alueet': {
        layerId: 5
      },
      'Maailmanperintö pisteet': {
        layerId: 6
      },
  
      //Rakennusperintörekisteri
      'Rakennetut alueet': {
        layerId: 8
      },
      'Rakennukset': {
        layerId: 9
      },
  
      //Muinaisjäännösrekisteri
      'Muinaisjäännösalueet': {
        layerId: 11
      },
      'Muinaisj.alakohteet': {
        layerId: 12
      },
      'Muinaisjäännökset': {
        layerId: 13,
        tyyppi: [],
        ajoitus: []
      },
  };

  this.init = function() {
    selectedLayerIds = this.getDefaultSelectedMuinaismuistotLayerIds();
    selectedBackgroundMapLayerName = 'taustakartta';
  };

  this.setEventListener = function(listener) {
      eventListener = listener;
  };

  this.getDefaultSelectedMuinaismuistotLayerIds = function() {
    var layerMap = self.getMuinaismuistotLayerIdMap();
    return [layerMap['RKY'], layerMap['Maailmanperintökohteet'], layerMap['Rakennusperintörekisteri'], layerMap['Muinaisjäännösrekisteri']];
  };

  this.getSelectedMuinaismuistotLayerIds = function() {
    return selectedLayerIds;
  };

  this.setSelectedMuinaismuistotLayerIds = function(layerIds) {
    selectedLayerIds = layerIds;
    eventListener.visibleMuinaismuistotLayersChanged(layerIds);
  };

  this.getSelectedBackgroundMapLayerName = function() {
    return selectedBackgroundMapLayerName;
  };

  this.setSelectedBackgroundMapLayerName = function(layerName) {
    selectedBackgroundMapLayerName = layerName;
    eventListener.selectedMapBackgroundLayerChanged(layerName);
  };

  this.getSearchParameters = function() {
    return searchParameters;
  };

  this.setSearchParameters = function(searchParams) {
    searchParameters = searchParams;
    eventListener.searchParametersChanged(searchParams);
  };

  this.getMuinaismuistotLayerIdMap = function() {
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

  this.getSearchParamsLayerDefinitions = function() {
    var resultArray = [];
    for (var property in searchParameters) {
      if (searchParameters.hasOwnProperty(property)) {
        addLayerDefinitionSearchParams(searchParameters[property], resultArray);
      }
    }
    return resultArray.join(';');
  };

  var addLayerDefinitionSearchParams = function(layerParams, allResultArray) {
    var resultArray = [];
    var layerHasSearchValues = false;
    var value;
    var layerId;

    for (var property in layerParams) {
      if (layerParams.hasOwnProperty(property)) {
        value = layerParams[property];

        if(property === 'layerId') {
          layerId = value ;
        }
        else if(Array.isArray(value) && value.length > 0) {
          layerHasSearchValues = true;
          var result = value.map(function(valueItem) { return property + " LIKE '%" + valueItem + "%'"; }).join(' OR ');
          resultArray.push('(' + result + ')');
        }
      }
    }

    if(layerHasSearchValues) {
      allResultArray.push(layerId + ':' + resultArray.join(' AND '));
    }
  };

};