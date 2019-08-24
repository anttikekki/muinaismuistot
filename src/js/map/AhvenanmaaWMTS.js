import $ from "jquery";
import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource from "ol/source/TileArcGISRest";
import { containsCoordinate } from "ol/extent";

export default function AhvenanmaaWMTS(
  muinaismuistotSettings,
  showLoadingAnimationFn,
  onLayerCreatedCallbackFn
) {
  var source;
  var layer;

  var init = function() {
    addLayer();
  };

  var addLayer = function() {
    source = createSource();
    layer = new TileLayer({
      source: source,
      // Extent from EPSG:3067 https://kartor.regeringen.ax/arcgis/services/Kulturarv/Fornminnen/MapServer/WMSServer?request=GetCapabilities&service=WMS
      extent: [65741.9087, 6606901.2261, 180921.4173, 6747168.5691]
    });
    layer.setOpacity(0.7);

    onLayerCreatedCallbackFn(layer);
  };

  var createSource = function() {
    var newSource = new TileArcGISRestSource({
      url:
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/export",
      params: {
        layers: "show:1"
      }
    });

    newSource.on("tileloadstart", function() {
      showLoadingAnimationFn(true);
    });
    newSource.on("tileloadend", function() {
      showLoadingAnimationFn(false);
    });
    newSource.on("tileloaderror", function() {
      showLoadingAnimationFn(false);
    });

    return newSource;
  };

  this.identifyFeaturesAt = function(coordinate, mapSize, mapExtent) {
    if (!containsCoordinate(layer.getExtent(), coordinate)) {
      // Returns resolved Promise with data that mimicks JQuery Ajax response
      return $.Deferred().resolveWith(null, [{ results: [] }, {}]);
    }

    var queryoptions = {
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: 10,
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers: "visible:1",
      f: "json",
      returnGeometry: "true"
    };

    return $.getJSON(
      "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/identify",
      queryoptions
    );
  };

  init();
}
