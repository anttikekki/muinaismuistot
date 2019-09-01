import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest";
import { containsCoordinate, Extent } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import { TileSourceEvent } from "ol/source/Tile";
import { Size } from "ol/size";
import { ArgisIdentifyResult, ArgisFindResult } from "../../data";

export type ShowLoadingAnimationFn = (show: boolean) => void;
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void;

export default class AhvenanmaaTileLayer {
  private source: TileArcGISRestSource;
  private layer: TileLayer;
  private showLoadingAnimationFn: ShowLoadingAnimationFn;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;

  public constructor(
    showLoadingAnimationFn: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.showLoadingAnimationFn = showLoadingAnimationFn;
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;
    this.addLayer();
  }

  private addLayer = () => {
    this.source = this.createSource();
    this.layer = new TileLayer({
      source: this.source,
      // Extent from EPSG:3067 https://kartor.regeringen.ax/arcgis/services/Kulturarv/Fornminnen/MapServer/WMSServer?request=GetCapabilities&service=WMS
      extent: [65741.9087, 6606901.2261, 180921.4173, 6747168.5691]
    });
    this.layer.setOpacity(0.7);

    this.onLayerCreatedCallbackFn(this.layer);
  };

  private createSource = () => {
    const options: Options = {
      urls: [
        "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/export"
      ],
      params: {
        layers: "show:1"
      }
    };
    var newSource = new TileArcGISRestSource(options);

    newSource.on("tileloadstart", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(true);
    });
    newSource.on("tileloadend", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false);
    });
    newSource.on("tileloaderror", (evt: TileSourceEvent) => {
      this.showLoadingAnimationFn(false);
    });

    return newSource;
  };

  public identifyFeaturesAt = (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent
  ): Promise<ArgisIdentifyResult> => {
    if (!containsCoordinate(this.layer.getExtent(), coordinate)) {
      return Promise.resolve({ results: [] });
    }

    const urlParams = new URLSearchParams({
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: "10",
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers: "visible:1",
      f: "json",
      returnGeometry: "true"
    });

    const url = new URL(
      "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/identify"
    );
    url.search = String(urlParams);

    return fetch(String(url)).then(
      response => response.json() as Promise<ArgisIdentifyResult>
    );
  };

  public findFeatures = (searchText: string): Promise<ArgisFindResult> => {
    const urlParams = new URLSearchParams({
      searchText: searchText,
      contains: "true",
      searchFields: "Namn , Beskrivning, Topografi",
      layers: "1",
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    });

    const url = new URL(
      "https://kartor.regeringen.ax/arcgis/rest/services/Kulturarv/Fornminnen/MapServer/find"
    );
    url.search = String(urlParams);

    return fetch(String(url)).then(
      response => response.json() as Promise<ArgisFindResult>
    );
  };
}
