import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Style from "ol/style/Style";
import GeoJSON from "ol/format/GeoJSON";
import { GeoJSONResponse } from "../../common/types";
import { FeatureLike } from "ol/Feature";

export type OnLayersCreatedCallbackFn = (layer: VectorLayer) => void;

export default class ModelsLayer {
  private layer?: VectorLayer;
  private source?: VectorSource;
  private stylePoint: Style;
  private stylePolygon: Style;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;
  private dataLatestUpdateDate?: Date;

  public constructor(onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn) {
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;

    this.stylePoint = new Style({
      image: new Circle({
        stroke: new Stroke({
          color: "black",
          width: 2,
        }),
        radius: 7,
      }),
    });
    this.stylePolygon = new Style({
      stroke: new Stroke({
        color: "black",
        width: 4,
      }),
    });

    this.fetchGeoJson().then(this.addFeaturesToLayer);
  }

  private fetchGeoJson = async (): Promise<GeoJSONResponse> => {
    const response = await fetch("./3d/3d.json");
    const data = await response.json();

    return data as GeoJSONResponse;
  };

  private addFeaturesToLayer = (geojsonObject: GeoJSONResponse) => {
    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    this.layer = new VectorLayer({
      source: this.source,
      style: (feature: FeatureLike) => {
        switch (feature.getGeometry().getType()) {
          case "Point":
            return this.stylePoint;
          case "Polygon":
            return this.stylePolygon;
          default:
            return this.stylePoint;
        }
      },
    });
    this.onLayerCreatedCallbackFn(this.layer);
  };

  public getLayer = (): VectorLayer | undefined => this.layer;

  public getDataLatestUpdateDate = async (): Promise<Date> => {
    if (this.dataLatestUpdateDate) {
      return Promise.resolve(this.dataLatestUpdateDate);
    }
    const data = await this.fetchGeoJson();

    let dates = data.features.map((feature) =>
      new Date(feature.properties.createdDate).getTime()
    );
    dates = Array.from(new Set(dates)); // Make unique
    return new Date(Math.max.apply(null, dates));
  };
}
