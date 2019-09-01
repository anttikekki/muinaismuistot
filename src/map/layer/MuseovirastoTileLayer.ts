import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource, { Options } from "ol/source/TileArcGISRest";
import { TileSourceEvent } from "ol/source/Tile";
import { Coordinate } from "ol/coordinate";
import { Size } from "ol/size";
import { Extent } from "ol/extent";
import {
  Settings,
  museovirastoLayerIdMap,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  MuseovirastoLayerId,
  ArgisIdentifyResult,
  ArgisFindResult
} from "../../data";

export type ShowLoadingAnimationFn = (show: boolean) => void;
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void;

export default class MuseovirastoTileLayer {
  private source: TileArcGISRestSource;
  private layer: TileLayer;
  private settings: Settings;
  private showLoadingAnimationFn: ShowLoadingAnimationFn;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;

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
      source: this.source
    });
    this.layer.setOpacity(0.7);

    this.onLayerCreatedCallbackFn(this.layer);
  };

  private createSource = () => {
    var newSource = new TileArcGISRestSource({
      urls: ["https://d3u1wj9fwedfoy.cloudfront.net"],
      params: {
        layers: this.getSourceLayerSelectionSettings(),
        layerDefs: this.getSourceLayerDefinitionFilterParams()
      }
    });

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

  private getSourceLayerSelectionSettings = (): string | undefined => {
    const allLayers: Array<MuseovirastoLayer> = Object.values(
      MuseovirastoLayer
    );
    if (allLayers.length === this.settings.selectedMuseovirastoLayers.length) {
      // All layers are selected. No need to filter.
      return undefined;
    }
    const selectedLayerIds = this.toLayerIds(
      this.settings.selectedMuseovirastoLayers
    );

    if (selectedLayerIds.length > 0) {
      return "show:" + selectedLayerIds.join(",");
    } else {
      // No selected layers. Hide all.
      return "hide:" + this.toLayerIds(allLayers).join(",");
    }
  };

  private getSourceLayerDefinitionFilterParams = () => {
    const layerDefinitions = [];

    const selectedTypes = this.settings.selectedMuinaisjaannosTypes;
    if (
      selectedTypes.length > 0 &&
      selectedTypes.length != Object.values(MuinaisjaannosTyyppi).length
    ) {
      const layerDefinition = selectedTypes
        .sort()
        .map(tyyppi => "tyyppi LIKE '%" + tyyppi + "%'")
        .join(" OR ");
      layerDefinitions.push("(" + layerDefinition + ")");
    }

    const selectedDatings = this.settings.selectedMuinaisjaannosDatings;
    if (
      selectedDatings.length > 0 &&
      selectedDatings.length != Object.values(MuinaisjaannosAjoitus).length
    ) {
      var layerDefinition = selectedDatings
        .sort()
        .map(ajoitus => "ajoitus LIKE '%" + ajoitus + "%'")
        .join(" OR ");
      layerDefinitions.push("(" + layerDefinition + ")");
    }

    if (layerDefinitions.length > 0) {
      return (
        museovirastoLayerIdMap[MuseovirastoLayer.Muinaisjäännökset_piste] +
        ":" +
        layerDefinitions.join(" AND ")
      );
    }
    return undefined;
  };

  private toLayerIds = (
    layers: Array<MuseovirastoLayer>
  ): Array<MuseovirastoLayerId> => {
    return layers.map(layer => museovirastoLayerIdMap[layer]).sort();
  };

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateMuinaismuistotLayerSource();
  };

  public selectedMuinaisjaannosTypesChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateMuinaismuistotLayerSource();
  };

  public selectedMuinaisjaannosDatingsChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateMuinaismuistotLayerSource();
  };

  public identifyFeaturesAt = (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent
  ): Promise<ArgisIdentifyResult> => {
    const urlParams = new URLSearchParams({
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: "10",
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers:
        "visible:" +
        this.toLayerIds(this.settings.selectedMuseovirastoLayers).join(","),
      f: "json",
      returnGeometry: "true"
    });

    const url = new URL("https://d3t293l8mhxosa.cloudfront.net");
    url.search = String(urlParams);

    return fetch(String(url)).then(
      response => response.json() as Promise<ArgisIdentifyResult>
    );
  };

  public findFeatures = (searchText: string): Promise<ArgisFindResult> => {
    let selectedLayers = this.settings.selectedMuseovirastoLayers;

    //Muinaismustot areas always has same name as main point so do not search those
    if (selectedLayers.includes(MuseovirastoLayer.Muinaisjäännökset_alue)) {
      selectedLayers = selectedLayers.filter(
        l => l !== MuseovirastoLayer.Muinaisjäännökset_alue
      );
    }

    const urlParams = new URLSearchParams({
      searchText: searchText,
      contains: "true",
      searchFields: "Kohdenimi, Nimi, KOHDENIMI",
      layers: this.toLayerIds(selectedLayers).join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    });

    const url = new URL("https://d3239kmqvyt2db.cloudfront.net");
    url.search = String(urlParams);

    return fetch(String(url)).then(
      response => response.json() as Promise<ArgisFindResult>
    );
  };
}
