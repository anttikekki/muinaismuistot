var MuinaismuistotSettings = function() {
  var self = this;
  var eventListener = null;
  var selectedLayerIds = [];
  var selectedBackgroundMapLayerName = '';
  var filterParameters = {
      'Muinaisjäännökset': {
        layerId: 13,
        tyyppi: [],
        ajoitus: []
      },
  };
  var muinaisjaannosTyyppiAllValues = ['ei määritelty', 
                                      'alusten hylyt', 
                                      'asuinpaikat', 
                                      'hautapaikat', 
                                      'kirkkorakenteet', 
                                      'kivirakenteet', 
                                      'kulkuväylät', 
                                      'kultti- ja tarinapaikat', 
                                      'luonnonmuodostumat', 
                                      'löytöpaikat', 
                                      'maarakenteet', 
                                      'muinaisjäännösryhmät', 
                                      'puolustusvarustukset', 
                                      'puurakenteet', 
                                      'raaka-aineen hankintapaikat', 
                                      'taide, muistomerkit', 
                                      'tapahtumapaikat', 
                                      'teollisuuskohteet', 
                                      'työ- ja valmistuspaikat'];
  var muinaisjaannosAjoitusAllValues = ['moniperiodinen', 
                                       'esihistoriallinen', 
                                       'kivikautinen', 
                                       'varhaismetallikautinen', 
                                       'pronssikautinen', 
                                       'rautakautinen', 
                                       'keskiaikainen', 
                                       'historiallinen', 
                                       'moderni', 
                                       'ajoittamaton', 
                                       'ei määritelty'];

  this.init = function() {
    selectedLayerIds = this.getMuinaismuistotLayerIds();
    selectedBackgroundMapLayerName = 'taustakartta';
  };

  this.setEventListener = function(listener) {
      eventListener = listener;
  };

  this.getSelectedMuinaismuistotLayerIds = function() {
    return selectedLayerIds.slice(); //Return shallow copy
  };

  this.setSelectedMuinaismuistotLayerIds = function(layerIds) {
    selectedLayerIds = layerIds;
    eventListener.visibleMuinaismuistotLayersChanged(layerIds);
  };

  this.getSelectedMuinaismuistotLayerSubLayerIds = function() {
    var subLayerIds = [];
    var parentLayerIds = self.getParentLayerIds();
    selectedLayerIds.forEach(function(layerId) {
      if(parentLayerIds.indexOf(layerId) === -1) {
        subLayerIds.push(layerId);
      }
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

  this.setMuinaisjaannosFilterParameter = function(field, value) {
    filterParameters['Muinaisjäännökset'][field] = value;
    eventListener.filterParametersChanged(filterParameters);
  };

  this.getMuinaismuistotLayerIds = function() {
    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
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

  this.getParentLayerIds = function() {
    return [0,4,7,10];
  };

  this.getMuinaismuistotSubLayerIdsToParentLayerIdMap = function() {
    return {
      '0': [1, 2, 3],
      '4': [5, 6],
      '7': [8, 9],
      '10': [11, 12, 13]
    };
  };

  this.getMuinaismuistotParentLayerIdToSubLayerIdMap = function() {
    return {
      '1': 0,
      '2': 0,
      '4': 0,
      '5': 4,
      '6': 4,
      '8': 7,
      '9': 7,
      '11': 10,
      '12': 10,
      '13': 10
    };
  };

  this.getLayerIconURL = function(layerId) {
    var layerMap = this.getMuinaismuistotLayerIdMap();
    switch (layerId) {
      case layerMap['Muinaisjäännökset']:
        return 'images/muinaisjaannos_kohde.png';
        break;
      case layerMap['Muinaisj.alakohteet']:
        return 'images/muinaisjaannos_alakohde.png';
        break;
      case layerMap['Muinaisjäännösalueet']:
        return 'images/muinaisjaannos_alue.png';
        break;
      case layerMap['RKY alueet']:
        return 'images/rky_alue.png';
        break;
      case layerMap['RKY viivat']:
        return 'images/rky_viiva.png';
        break;
      case layerMap['RKY pisteet']:
        return 'images/rky_piste.png';
        break;
      case layerMap['Maailmanperintö alueet']:
        return 'images/maailmanperinto_alue.png';
        break;
      case layerMap['Maailmanperintö pisteet']:
        return 'images/maailmanperinto_piste.png';
        break;
      case layerMap['Rakennetut alueet']:
        return 'images/rakennusperintorekisteri_alue.png';
        break;
      case layerMap['Rakennukset']:
        return 'images/rakennusperintorekisteri_rakennus.png';
        break;
    }
  };

  this.getFilterParamsLayerDefinitions = function() {
    var resultArray = [];
    addMuinaisjaannosLayerDefinitionFilterParams('Muinaisjäännökset', resultArray);
    return resultArray.join(';');
  };

  var addMuinaisjaannosLayerDefinitionFilterParams = function(filterValueName, allResultArray) {
    var resultArray = [];
    var value;

    value = filterParameters[filterValueName]['tyyppi'];
    if(Array.isArray(value) && value.length > 0 && value.length != muinaisjaannosTyyppiAllValues.length) {
      var result = value.map(function(valueItem) { return "tyyppi LIKE '%" + valueItem + "%'"; }).join(' OR ');
      resultArray.push('(' + result + ')');
    }

    value = filterParameters[filterValueName]['ajoitus'];
    if(Array.isArray(value) && value.length > 0 && value.length != muinaisjaannosAjoitusAllValues.length) {
      var result = value.map(function(valueItem) { return "ajoitus LIKE '%" + valueItem + "%'"; }).join(' OR ');
      resultArray.push('(' + result + ')');
    }

    if(resultArray.length > 0) {
      allResultArray.push(filterParameters[filterValueName].layerId + ':' + resultArray.join(' AND '));
    }
  };

  this.layerSelectionChanged = function(layerId, isSelected) {
    layerId = parseInt(layerId);
    var selectedLayerIds = self.getSelectedMuinaismuistotLayerIds();

    if(isSelected) {
      selectedLayerIds.push(layerId);
    }
    else {
      var i = selectedLayerIds.indexOf(layerId);
        if (i > -1) {
          selectedLayerIds.splice(i, 1);
        }
    }

    if(self.getParentLayerIds().indexOf(layerId) !== -1) {
      var subLayerIds = self.getMuinaismuistotSubLayerIdsToParentLayerIdMap()[layerId];

      if(isSelected) {
        //Add all parent sub layers
        subLayerIds.forEach(function(subLayerId) {
          selectedLayerIds.push(subLayerId);
        });
      }
      else {
        //Remove all sub layers for parent
        selectedLayerIds = selectedLayerIds.map(function(selectedLayerId) {
          if(subLayerIds.indexOf(selectedLayerId) === -1) {
            return selectedLayerId;
          }
        });
      }
    }
    else {
      //Sub layer selection changed
      var parentLayerId = self.getMuinaismuistotParentLayerIdToSubLayerIdMap()[layerId];
      var subLayerIds = self.getMuinaismuistotSubLayerIdsToParentLayerIdMap()[parentLayerId];

      if(isSelected) {
        //Add parent layer to selection if all sub layers are selected
        var allSelected = true;
        subLayerIds.forEach(function(subLayerId) {
          if(selectedLayerIds.indexOf(subLayerId) === -1) {
            allSelected = false;
          }
        });
        if(allSelected) {
          selectedLayerIds.push(parentLayerId);
        }
      }
      else {
        //Remove parent layer from selection
        var i = selectedLayerIds.indexOf(parentLayerId);
          if (i > -1) {
            selectedLayerIds.splice(i, 1);
          }
      }
    }

    self.setSelectedMuinaismuistotLayerIds(selectedLayerIds);
  };

};