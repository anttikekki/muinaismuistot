var MuinaismuistotSettings = function() {
  var self = this;
  var eventListener = null;
  var selectedLayerIds = [];
  var selectedBackgroundMapLayerName = '';
  var filterParameters = {
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

  this.getSelectedMuinaismuistotLayerSubLayerIds = function() {
    var subLayerIds = [];
    var subLayerMap = self.getMuinaismuistotSubLayerIdsToParentLayerIdMap();
    selectedLayerIds.forEach(function(parentLayerId) {
      subLayerMap[parentLayerId].forEach(function(subLayerId) {
        subLayerIds.push(subLayerId);
      });
    });
    return subLayerIds;
  };

  this.getSelectedBackgroundMapLayerName = function() {
    return selectedBackgroundMapLayerName;
  };

  this.setSelectedBackgroundMapLayerName = function(layerName) {
    selectedBackgroundMapLayerName = layerName;
    eventListener.selectedMapBackgroundLayerChanged(layerName);
  };

  this.getFilterParameters = function() {
    return filterParameters;
  };

  this.setFilterParameters = function(params) {
    filterParameters = params;
    eventListener.filterParametersChanged(filterParameters);
  };

  this.setFilterParameterForLayer = function(layerName, field, value) {
    filterParameters[layerName][field] = value;
    eventListener.filterParametersChanged(filterParameters);
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

  this.getMuinaismuistotSubLayerIdsToParentLayerIdMap = function() {
    return {
      '0': [1, 2, 3],
      '4': [5, 6],
      '7': [8, 9],
      '10': [11, 12, 13]
    };
  };

  this.getFilterParamsLayerDefinitions = function() {
    var resultArray = [];
    for (var property in filterParameters) {
      if (filterParameters.hasOwnProperty(property)) {
        addLayerDefinitionFilterParams(filterParameters[property], resultArray);
      }
    }
    return resultArray.join(';');
  };

  var addLayerDefinitionFilterParams = function(layerParams, allResultArray) {
    var resultArray = [];
    var layerHasFilterValues = false;
    var value;
    var layerId;

    for (var property in layerParams) {
      if (layerParams.hasOwnProperty(property)) {
        value = layerParams[property];

        if(property === 'layerId') {
          layerId = value ;
        }
        else if(Array.isArray(value) && value.length > 0) {
          layerHasFilterValues = true;
          var result = value.map(function(valueItem) { return property + " LIKE '%" + valueItem + "%'"; }).join(' OR ');
          resultArray.push('(' + result + ')');
        }
      }
    }

    if(layerHasFilterValues) {
      allResultArray.push(layerId + ':' + resultArray.join(' AND '));
    }
  };

};