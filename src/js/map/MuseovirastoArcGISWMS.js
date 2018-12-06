import $ from "jquery";
import TileLayer from "ol/layer/tile";
import TileArcGISRestSource from "ol/source/TileArcGISRest";

export default function MuseovirastoArcGISWMS(
  muinaismuistotSettings,
  showLoadingAnimationFn,
  onLayerCreatedCallbackFn
) {
  var source;
  var layer;

  var init = function() {
    addMuinaismuistotLayer();
  };

  var addMuinaismuistotLayer = function() {
    source = createSource();
    layer = new TileLayer({
      source: source
    });
    layer.setOpacity(0.7);
    onLayerCreatedCallbackFn(layer);
  };

  var createSource = function() {
    return new TileArcGISRestSource(getMuinaismuistotLayerSourceParams());
  };

  var updateMuinaismuistotLayerSource = function() {
    if (layer) {
      source = createSource();
      layer.setSource(source);
    }
  };

  var getMuinaismuistotLayerSourceParams = function() {
    var layerIds = muinaismuistotSettings.getSelectedMuinaismuistotLayerIds();
    var layers = "";

    if (layerIds.length > 0) {
      layers = "show:" + layerIds.join(",");
    } else {
      //Hide all layers
      layers =
        "hide:" + muinaismuistotSettings.getMuinaismuistotLayerIds().join(",");
    }

    return {
      url: muinaismuistotSettings.getMuseovirastoArcGISWMSExportURL(),
      params: {
        layers: layers,
        layerDefs: muinaismuistotSettings.getFilterParamsLayerDefinitions()
      }
    };
  };

  this.updateVisibleLayersFromSettings = function() {
    updateMuinaismuistotLayerSource();
  };

  this.identifyFeaturesAt = function(coordinate, mapSize, mapExtent) {
    var queryoptions = {
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: 10,
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers:
        "visible:" +
        muinaismuistotSettings.getSelectedMuinaismuistotLayerIds().join(","),
      f: "json",
      returnGeometry: "true"
    };
    showLoadingAnimationFn(true);

    return $.getJSON(
      muinaismuistotSettings.getMuseovirastoArcGISWMSIndentifyURL(),
      queryoptions
    ).done(function(response) {
      showLoadingAnimationFn(false);
    });
  };

  this.findFeatures = function(searchText, callback) {
    var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    var selectedSubLayers = muinaismuistotSettings.getSelectedMuinaismuistotLayerSubLayerIds();

    //Muinaismustot areas and sub-points arlways has same name as main point so do not search those
    var areaIndex = selectedSubLayers.indexOf(layerMap["Muinaisjäännösalueet"]);
    if (areaIndex > -1) {
      selectedSubLayers.splice(areaIndex, 1);
    }
    var subPointIndex = selectedSubLayers.indexOf(
      layerMap["Muinaisj.alakohteet"]
    );
    if (subPointIndex > -1) {
      selectedSubLayers.splice(subPointIndex, 1);
    }

    var queryoptions = {
      searchText: searchText,
      contains: true,
      searchFields: "Kohdenimi, Nimi, KOHDENIMI",
      layers: selectedSubLayers.join(","), //Sub-layers
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    };
    showLoadingAnimationFn(true);

    $.getJSON(
      muinaismuistotSettings.getMuseovirastoArcGISWMSFindFeaturesURL(),
      queryoptions,
      function(response) {
        callback(response.results);
        showLoadingAnimationFn(false);
      }
    );
  };

  init();
}
