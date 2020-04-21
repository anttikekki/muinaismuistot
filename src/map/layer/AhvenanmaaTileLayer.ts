import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest";
import { containsCoordinate, Extent } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import { TileSourceEvent } from "ol/source/Tile";
import { Size } from "ol/size";
import {
  ArgisIdentifyResult,
  ArgisFindResult,
  AhvenanmaaLayerId,
  getAhvenanmaaLayerId,
  AhvenanmaaLayer,
  Settings,
} from "../../common/types";

export type ShowLoadingAnimationFn = (show: boolean) => void;
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void;

export default class AhvenanmaaTileLayer {
  private source?: TileArcGISRestSource;
  private layer?: TileLayer;
  private settings: Settings;
  private showLoadingAnimationFn: ShowLoadingAnimationFn;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;
  private forminnenDataLatestUpdateDate?: Date;
  private maritimtKulturarvDataLatestUpdateDate?: Date;

  public constructor(
    initialSettings: Settings,
    showLoadingAnimationFn: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.settings = initialSettings;
    this.showLoadingAnimationFn = showLoadingAnimationFn;
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;
    this.addLayer();
  }

  private addLayer = () => {
    this.source = this.createSource();
    this.layer = new TileLayer({
      source: this.source,
      // Extent from EPSG:3067 https://kartor.regeringen.ax/arcgis/services/Kulturarv/Fornminnen/MapServer/WMSServer?request=GetCapabilities&service=WMS
      extent: [65741.9087, 6606901.2261, 180921.4173, 6747168.5691],
    });
    this.layer.setOpacity(0.7);

    this.onLayerCreatedCallbackFn(this.layer);
  };

  private toLayerIds = (
    layers: Array<AhvenanmaaLayer>
  ): Array<AhvenanmaaLayerId> => {
    return layers.map(getAhvenanmaaLayerId).sort();
  };

  private getSourceLayersParams = (): string => {
    if (this.settings.selectedAhvenanmaaLayers.length > 0) {
      return (
        "show:" +
        this.toLayerIds(this.settings.selectedAhvenanmaaLayers).join(",")
      );
    } else {
      // No selected layers. Hide all.
      return (
        "hide:" + this.toLayerIds(Object.values(AhvenanmaaLayer)).join(",")
      );
    }
  };

  private createSource = () => {
    const options: Options = {
      urls: [this.settings.ahvenanmaa.url.export],
      params: {
        layers: this.getSourceLayersParams(),
      },
    };
    const newSource = new TileArcGISRestSource(options);

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

  private updateLayerSource = () => {
    if (this.layer) {
      this.source = this.createSource();
      this.layer.setSource(this.source);
    }
  };

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateLayerSource();
  };

  public identifyFeaturesAt = (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent
  ): Promise<ArgisIdentifyResult> => {
    if (
      !this.layer ||
      !containsCoordinate(this.layer.getExtent(), coordinate)
    ) {
      return Promise.resolve({ results: [] });
    }

    const urlParams = new URLSearchParams({
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: "10",
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers: `visible:${this.toLayerIds(
        this.settings.selectedAhvenanmaaLayers
      ).join(",")}`,
      f: "json",
      returnGeometry: "true",
    });

    const url = new URL(this.settings.ahvenanmaa.url.identify);
    url.search = String(urlParams);

    return fetch(String(url)).then(
      (response) => response.json() as Promise<ArgisIdentifyResult>
    );
  };

  public findFeatures = (searchText: string): Promise<ArgisFindResult> => {
    const urlParams = new URLSearchParams({
      searchText: searchText,
      contains: "true",
      searchFields: "Namn , Beskrivning, Topografi",
      layers: this.toLayerIds(this.settings.selectedAhvenanmaaLayers).join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false",
    });

    const url = new URL(this.settings.ahvenanmaa.url.find);
    url.search = String(urlParams);

    return fetch(String(url)).then(
      (response) => response.json() as Promise<ArgisFindResult>
    );
  };

  // Fetch URL is from https://www.kartor.ax/datasets/fornminnen
  public getForminnenDataLatestUpdateDate = (): Promise<Date> => {
    if (this.forminnenDataLatestUpdateDate) {
      return Promise.resolve(this.forminnenDataLatestUpdateDate);
    }

    return fetch(this.settings.ahvenanmaa.url.forminnenUpdateDate)
      .then((response) => response.json())
      .then(this.parseUpdatedDate)
      .then((date) => {
        this.forminnenDataLatestUpdateDate = date;
        return date;
      });
  };

  // Fetch URL is from https://www.kartor.ax/datasets/maritimt-kulturarv-vrak
  public getMaritimtKulturarvDataLatestUpdateDate = (): Promise<Date> => {
    if (this.maritimtKulturarvDataLatestUpdateDate) {
      return Promise.resolve(this.maritimtKulturarvDataLatestUpdateDate);
    }

    return fetch(this.settings.ahvenanmaa.url.maritimtKulturarvUpdateDate)
      .then((response) => response.json())
      .then(this.parseUpdatedDate)
      .then((date) => {
        this.maritimtKulturarvDataLatestUpdateDate = date;
        return date;
      });
  };

  private parseUpdatedDate = (doc: any): Promise<Date> => {
    const data = doc?.data;
    const date =
      Array.isArray(data) && data.length > 0
        ? data[0]?.attributes?.modified
        : undefined;

    if (date) {
      return Promise.resolve(new Date(date));
    }
    return Promise.reject(new Error("Ahvenanmaan updated date not found"));
  };
}
