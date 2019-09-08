import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Coordinate } from "ol/coordinate";

export type OnLayersCreatedCallbackFn = (layer: VectorLayer) => void;

export default class CurrentPositionAndSelectedLocationMarkerLayer {
  private layer: VectorLayer;
  private source: VectorSource;
  private currentPositionFeature?: Feature;
  private selectedLocationFeature?: Feature;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;

  public constructor(onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn) {
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;
    this.source = new VectorSource({});
    this.layer = new VectorLayer({
      source: this.source
    });
    this.onLayerCreatedCallbackFn(this.layer);
  }

  public addCurrentPositionMarker = (coordinates: Coordinate) => {
    if (this.currentPositionFeature) {
      this.currentPositionFeature.setGeometry(new Point(coordinates));
      return;
    }

    const fill = new Fill({
      color: "rgba(0, 0, 255, 1.0)"
    });
    const stroke = new Stroke({
      color: "rgba(255, 255, 255, 1.0)",
      width: 3
    });

    this.currentPositionFeature = new Feature({
      geometry: new Point(coordinates)
    });
    this.currentPositionFeature.setStyle(
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
    this.source.addFeature(this.currentPositionFeature);
  };

  public addSelectedLocationFeatureMarker = (coordinates: Coordinate) => {
    if (this.selectedLocationFeature) {
      this.selectedLocationFeature.setGeometry(new Point(coordinates));
      return;
    }

    this.selectedLocationFeature = new Feature({
      geometry: new Point(coordinates)
    });
    this.selectedLocationFeature.setStyle(
      new Style({
        image: new Icon({
          src: "images/map-pin.png"
        })
      })
    );
    this.source.addFeature(this.selectedLocationFeature);
  };
}
