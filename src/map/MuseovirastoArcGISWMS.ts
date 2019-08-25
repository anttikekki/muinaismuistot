import $ from "jquery";
import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest";
import Settings from "../Settings";
import { TileSourceEvent } from "ol/source/Tile";
import { Coordinate } from "ol/coordinate";
import { Size } from "ol/size";
import { Extent } from "ol/extent";

export type ShowLoadingAnimationFn = (show: boolean) => void;
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void;

export default class MuseovirastoArcGISWMS {
  private source: TileArcGISRestSource;
  private layer: TileLayer;
  private muinaismuistotSettings: Settings;
  private showLoadingAnimationFn: ShowLoadingAnimationFn;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;

  public constructor(
    muinaismuistotSettings: Settings,
    showLoadingAnimationFn: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.muinaismuistotSettings = muinaismuistotSettings;
    this.showLoadingAnimationFn = showLoadingAnimationFn;
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn;
    this.addLayer();
  }

  private addLayer = () => {
    this.source = this.createSource();
    this.layer = new TileLayer({
      source: this.source
    });
    this.layer.setOpacity(0.7);

    this.onLayerCreatedCallbackFn(this.layer);
  };

  private createSource = () => {
    var newSource = new TileArcGISRestSource(
      this.getMuinaismuistotLayerSourceParams()
    );

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

  private updateMuinaismuistotLayerSource = () => {
    if (this.layer) {
      this.source = this.createSource();
      this.layer.setSource(this.source);
    }
  };

  private getMuinaismuistotLayerSourceParams = (): Options => {
    var layerIds = this.muinaismuistotSettings.getSelectedMuinaismuistotLayerIds();
    var layers = "";

    if (layerIds.length > 0) {
      layers = "show:" + layerIds.join(",");
    } else {
      //Hide all layers
      layers =
        "hide:" +
        this.muinaismuistotSettings.getMuinaismuistotLayerIds().join(",");
    }

    return {
      urls: [this.muinaismuistotSettings.getMuseovirastoArcGISWMSExportURL()],
      params: {
        layers: layers,
        layerDefs: this.muinaismuistotSettings.getFilterParamsLayerDefinitions()
      }
    };
  };

  public updateVisibleLayersFromSettings = () => {
    this.updateMuinaismuistotLayerSource();
  };

  public identifyFeaturesAt = (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent
  ) => {
    var queryoptions = {
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: 10,
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers:
        "visible:" +
        this.muinaismuistotSettings
          .getSelectedMuinaismuistotLayerIds()
          .join(","),
      f: "json",
      returnGeometry: "true"
    };

    return $.getJSON(
      this.muinaismuistotSettings.getMuseovirastoArcGISWMSIndentifyURL(),
      queryoptions
    );
  };

  public findFeatures = (searchText: string) => {
    var layerMap = this.muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    var selectedLayerIds = this.muinaismuistotSettings.getSelectedMuinaismuistotLayerIds();

    //Muinaismustot areas always has same name as main point so do not search those
    var areaIndex = selectedLayerIds.indexOf(layerMap.Muinaisjäännökset_alue);
    if (areaIndex > -1) {
      selectedLayerIds.splice(areaIndex, 1);
    }

    var queryoptions = {
      searchText: searchText,
      contains: true,
      searchFields: "Kohdenimi, Nimi, KOHDENIMI",
      layers: selectedLayerIds.join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    };

    return $.getJSON(
      this.muinaismuistotSettings.getMuseovirastoArcGISWMSFindFeaturesURL(),
      queryoptions
    );
  };
}
