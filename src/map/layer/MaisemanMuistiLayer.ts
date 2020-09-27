import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import Style from "ol/style/Style";
import GeoJSON from "ol/format/GeoJSON";
import {
  GeoJSONResponse,
  MaisemanMuistiFeatureProperties,
  Settings,
} from "../../common/types";
import { getGeoJSONDataLatestUpdateDate } from "../../common/util/featureParser";
import Fill from "ol/style/Fill";

export type OnLayersCreatedCallbackFn = (layer: VectorLayer) => void;

export default class MaisemanMuistiLayer {
  private settings: Settings;
  private layer?: VectorLayer;
  private source?: VectorSource;
  private stylePointCircle: Style;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;
  private dataLatestUpdateDate?: Date;

  public constructor(
    settings: Settings,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.settings = settings;
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;

    this.stylePointCircle = new Style({
      image: new Circle({
        fill: new Fill({
          color: "yellow",
        }),
        radius: 7,
      }),
    });

    this.fetchGeoJson().then(this.addFeaturesToLayer);
  }

  private fetchGeoJson = async (): Promise<
    GeoJSONResponse<MaisemanMuistiFeatureProperties>
  > => {
    const response = await fetch(this.settings.maisemanMuisti.url.geojson);
    const data = await response.json();

    return data as GeoJSONResponse<MaisemanMuistiFeatureProperties>;
  };

  private addFeaturesToLayer = (
    geojsonObject: GeoJSONResponse<MaisemanMuistiFeatureProperties>
  ) => {
    this.source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    this.layer = new VectorLayer({
      source: this.source,
      style: this.stylePointCircle,
    });
    this.onLayerCreatedCallbackFn(this.layer);
  };

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.settings = settings;
    this.layer?.setVisible(settings.maisemanMuisti.selectedLayers.length > 0);
  };

  public getLayer = (): VectorLayer | undefined => this.layer;
}
