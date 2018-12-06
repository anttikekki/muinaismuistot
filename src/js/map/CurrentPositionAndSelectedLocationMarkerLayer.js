import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

export default function CurrentPositionAndSelectedLocationMarkerLayer(
  onLayerCreatedCallbackFn
) {
  var layer;
  var source;
  var currentPositionFeature;
  var selectedLocationFeature;

  var init = function() {
    addLayer();
  };

  var addLayer = function() {
    source = new VectorSource({});
    layer = new VectorLayer({
      source: source
    });
    onLayerCreatedCallbackFn(layer);
  };

  this.addCurrentPositionMarker = function(coordinates) {
    if (currentPositionFeature) {
      currentPositionFeature.getGeometry().setCoordinates(coordinates);
      return;
    }

    var fill = new Fill({
      color: "rgba(0, 0, 255, 1.0)"
    });
    var stroke = new Stroke({
      color: "rgba(255, 255, 255, 1.0)",
      width: 3
    });

    currentPositionFeature = new Feature({
      geometry: new Point(coordinates)
    });
    currentPositionFeature.setStyle(
      new Style({
        image: new Circle({
          fill: fill,
          stroke: stroke,
          radius: 7
        }),
        fill: fill,
        stroke: stroke
      })
    );
    source.addFeature(currentPositionFeature);
  };

  this.addSelectedLocationFeatureMarker = function(coordinates) {
    if (selectedLocationFeature) {
      selectedLocationFeature.getGeometry().setCoordinates(coordinates);
      return;
    }

    selectedLocationFeature = new Feature({
      geometry: new Point(coordinates)
    });
    selectedLocationFeature.setStyle(
      new Style({
        image: new Icon({
          src: "images/map-pin.png"
        })
      })
    );
    source.addFeature(selectedLocationFeature);
  };

  init();
}
