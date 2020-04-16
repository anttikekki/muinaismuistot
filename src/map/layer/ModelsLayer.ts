import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Style from "ol/style/Style";
import GeoJSON from "ol/format/GeoJSON";
import { Model } from "../../common/types";

type GeoJSONResponse = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: Array<number>;
    };
    properties: Model;
  }>;
};

export type OnLayersCreatedCallbackFn = (layer: VectorLayer) => void;

export default class ModelsLayer {
  private layer?: VectorLayer;
  private source?: VectorSource;
  private style: Style;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;
  private dataLatestUpdateDate?: Date;

  public constructor(onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn) {
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;

    this.style = new Style({
      image: new Circle({
        //fill:  new Fill({color: "rgba(0, 0, 255, 1.0)"}),
        stroke: new Stroke({
          color: "black",
          width: 2
        }),
        radius: 7
      })
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
      features: new GeoJSON().readFeatures(geojsonObject)
    });
    this.layer = new VectorLayer({
      source: this.source,
      style: this.style
    });
    this.onLayerCreatedCallbackFn(this.layer);
  };

  public getLayer = (): VectorLayer | undefined => this.layer;

  public getDataLatestUpdateDate = async (): Promise<Date> => {
    if (this.dataLatestUpdateDate) {
      return Promise.resolve(this.dataLatestUpdateDate);
    }
    const data = await this.fetchGeoJson();

    let dates = data.features.map(feature =>
      new Date(feature.properties.createdDate).getTime()
    );
    dates = Array.from(new Set(dates)); // Make unique
    return new Date(Math.max.apply(null, dates));
  };
}
