export default function Settings(eventListener) {
  var self = this;
  var selectedLayerIds = [];
  var selectedBackgroundMapLayerName = "";
  var filterParameters = {
    Muinaisjäännökset: {
      layerId: 13,
      tyyppi: [],
      ajoitus: []
    }
  };
  var muinaisjaannosTyyppiAllValues = [
    "ei määritelty",
    "alusten hylyt",
    "asuinpaikat",
    "hautapaikat",
    "kirkkorakenteet",
    "kivirakenteet",
    "kulkuväylät",
    "kultti- ja tarinapaikat",
    "luonnonmuodostumat",
    "löytöpaikat",
    "maarakenteet",
    "muinaisjäännösryhmät",
    "puolustusvarustukset",
    "puurakenteet",
    "raaka-aineen hankintapaikat",
    "taide, muistomerkit",
    "tapahtumapaikat",
    "teollisuuskohteet",
    "työ- ja valmistuspaikat"
  ];
  var muinaisjaannosAjoitusAllValues = [
    "moniperiodinen",
    "esihistoriallinen",
    "kivikautinen",
    "varhaismetallikautinen",
    "pronssikautinen",
    "rautakautinen",
    "keskiaikainen",
    "historiallinen",
    "moderni",
    "ajoittamaton",
    "ei määritelty"
  ];

  var init = function() {
    selectedLayerIds = self.getMuinaismuistotLayerIds();
    selectedBackgroundMapLayerName = "taustakartta";
  };

  this.getMuseovirastoArcGISWMSExportURL = function() {
    return "https://d3u1wj9fwedfoy.cloudfront.net";
  };

  this.getMuseovirastoArcGISWMSIndentifyURL = function() {
    return "https://d3t293l8mhxosa.cloudfront.net?";
  };

  this.getMuseovirastoArcGISWMSFindFeaturesURL = function() {
    return "https://d3239kmqvyt2db.cloudfront.net?";
  };

  this.getMaanmittauslaitosWMTSCapabilitiesURL = function() {
    return "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml";
  };

  this.getAhvenanmaaWMTSCapabilitiesURL = function() {
    return "capabilities/regeringen-wmts-capabilities.xml";
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
    filterParameters["Muinaisjäännökset"][field] = value;
    eventListener.filterParametersChanged(filterParameters);
  };

  this.getMuinaismuistotLayerIds = function() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8];
  };

  this.getMuinaismuistotLayerIdMap = function() {
    return {
      Muinaisjäännökset_piste: 0,
      Muinaisjäännökset_alue: 1,
      Suojellut_rakennukset_piste: 2,
      Suojellut_rakennukset_alue: 3,
      RKY_alue: 4,
      RKY_piste: 5,
      RKY_viiva: 6,
      Maailmanperintö_piste: 7,
      Maailmanperintö_alue: 8
    };
  };

  this.getLayerIconURL = function(layerId) {
    var layerMap = this.getMuinaismuistotLayerIdMap();
    switch (layerId) {
      case layerMap.Muinaisjäännökset_piste:
        return "images/muinaisjaannos_kohde.png";
      //case layerMap["Muinaisj.alakohteet"]:
      //  return "images/muinaisjaannos_alakohde.png";
      case layerMap.Muinaisjäännökset_alue:
        return "images/muinaisjaannos_alue.png";
      case layerMap.RKY_alue:
        return "images/rky_alue.png";
      case layerMap.RKY_viiva:
        return "images/rky_viiva.png";
      case layerMap.RKY_piste:
        return "images/rky_piste.png";
      case layerMap.Maailmanperintö_alue:
        return "images/maailmanperinto_alue.png";
      case layerMap.Maailmanperintö_piste:
        return "images/maailmanperinto_piste.png";
      case layerMap.Suojellut_rakennukset_alue:
        return "images/rakennusperintorekisteri_alue.png";
      case layerMap.Suojellut_rakennukset_piste:
        return "images/rakennusperintorekisteri_rakennus.png";
    }
  };

  this.getFilterParamsLayerDefinitions = function() {
    var resultArray = [];
    addMuinaisjaannosLayerDefinitionFilterParams(
      "Muinaisjäännökset",
      resultArray
    );
    return resultArray.join(";");
  };

  var addMuinaisjaannosLayerDefinitionFilterParams = function(
    filterValueName,
    allResultArray
  ) {
    var resultArray = [];
    var value;

    value = filterParameters[filterValueName]["tyyppi"];
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.length != muinaisjaannosTyyppiAllValues.length
    ) {
      var result = value
        .map(function(valueItem) {
          return "tyyppi LIKE '%" + valueItem + "%'";
        })
        .join(" OR ");
      resultArray.push("(" + result + ")");
    }

    value = filterParameters[filterValueName]["ajoitus"];
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.length != muinaisjaannosAjoitusAllValues.length
    ) {
      var result = value
        .map(function(valueItem) {
          return "ajoitus LIKE '%" + valueItem + "%'";
        })
        .join(" OR ");
      resultArray.push("(" + result + ")");
    }

    if (resultArray.length > 0) {
      allResultArray.push(
        filterParameters[filterValueName].layerId +
          ":" +
          resultArray.join(" AND ")
      );
    }
  };

  this.layerSelectionChanged = function(layerId, isSelected) {
    layerId = parseInt(layerId);
    var selectedLayerIds = self.getSelectedMuinaismuistotLayerIds();

    if (isSelected) {
      if (selectedLayerIds.indexOf(layerId) === -1) {
        selectedLayerIds.push(layerId);
      }
    } else {
      var i = selectedLayerIds.indexOf(layerId);
      if (i > -1) {
        selectedLayerIds.splice(i, 1);
      }
    }

    self.setSelectedMuinaismuistotLayerIds(selectedLayerIds);
  };

  init();
}
