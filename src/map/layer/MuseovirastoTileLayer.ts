import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource from "ol/source/TileArcGISRest";
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
  ArgisFindResult,
} from "../../common/types";

export type ShowLoadingAnimationFn = (show: boolean) => void;
export type OnLayersCreatedCallbackFn = (layer: TileLayer) => void;

export default class MuseovirastoTileLayer {
  private source?: TileArcGISRestSource;
  private layer?: TileLayer;
  private settings: Settings;
  private showLoadingAnimationFn: ShowLoadingAnimationFn;
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn;
  private dataLatestUpdateDate?: Date;

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
    });
    this.layer.setOpacity(0.7);

    this.onLayerCreatedCallbackFn(this.layer);
  };

  private createSource = () => {
    const newSource = new TileArcGISRestSource({
      urls: [this.settings.museovirasto.url.export],
      params: {
        layers: this.getSourceLayerSelectionSettings(),
        layerDefs: this.getSourceLayerDefinitionFilterParams(),
      },
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

  private updateLayerSource = () => {
    if (this.layer) {
      this.source = this.createSource();
      this.layer.setSource(this.source);
    }
  };

  private getSourceLayerSelectionSettings = (): string | undefined => {
    const allLayers: Array<MuseovirastoLayer> = Object.values(
      MuseovirastoLayer
    );
    if (allLayers.length === this.settings.museovirasto.selectedLayers.length) {
      // All layers are selected. No need to filter.
      return undefined;
    }
    const selectedLayerIds = this.toLayerIds(
      this.settings.museovirasto.selectedLayers
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

    const selectedTypes = this.settings.museovirasto
      .selectedMuinaisjaannosTypes;
    if (
      selectedTypes.length > 0 &&
      selectedTypes.length != Object.values(MuinaisjaannosTyyppi).length
    ) {
      const layerDefinition = selectedTypes
        .sort()
        .map((tyyppi) => "tyyppi LIKE '%" + tyyppi + "%'")
        .join(" OR ");
      layerDefinitions.push("(" + layerDefinition + ")");
    }

    const selectedDatings = this.settings.museovirasto
      .selectedMuinaisjaannosDatings;
    if (
      selectedDatings.length > 0 &&
      selectedDatings.length != Object.values(MuinaisjaannosAjoitus).length
    ) {
      const layerDefinition = selectedDatings
        .sort()
        .map((ajoitus) => "ajoitus LIKE '%" + ajoitus + "%'")
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
    return layers.map((layer) => museovirastoLayerIdMap[layer]).sort();
  };

  public selectedFeatureLayersChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateLayerSource();
  };

  public selectedMuinaisjaannosTypesChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateLayerSource();
  };

  public selectedMuinaisjaannosDatingsChanged = (settings: Settings) => {
    this.settings = settings;
    this.updateLayerSource();
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
        this.toLayerIds(this.settings.museovirasto.selectedLayers).join(","),
      f: "json",
      returnGeometry: "true",
    });

    const url = new URL(this.settings.museovirasto.url.identify);
    url.search = String(urlParams);

    return fetch(String(url)).then(
      (response) => response.json() as Promise<ArgisIdentifyResult>
    );
  };

  public findFeatures = (searchText: string): Promise<ArgisFindResult> => {
    let selectedLayers = this.settings.museovirasto.selectedLayers;

    //Muinaismustot areas always has same name as main point so do not search those
    if (selectedLayers.includes(MuseovirastoLayer.Muinaisjäännökset_alue)) {
      selectedLayers = selectedLayers.filter(
        (l) => l !== MuseovirastoLayer.Muinaisjäännökset_alue
      );
    }

    const urlParams = new URLSearchParams({
      searchText: searchText,
      contains: "true",
      searchFields: "Kohdenimi, Nimi, KOHDENIMI",
      layers: this.toLayerIds(selectedLayers).join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false",
    });

    const url = new URL(this.settings.museovirasto.url.find);
    url.search = String(urlParams);

    return fetch(String(url)).then(
      (response) => response.json() as Promise<ArgisFindResult>
    );
  };

  // http://paikkatieto.nba.fi/aineistot/MV_inspire_atom.xml
  // https://www.avoindata.fi/data/fi/dataset/museoviraston-paikkatietojen-tiedostolataus
  public getDataLatestUpdateDate = (): Promise<Date> => {
    if (this.dataLatestUpdateDate) {
      return Promise.resolve(this.dataLatestUpdateDate);
    }

    return fetch(this.settings.museovirasto.url.updateDate)
      .then((response) => response.text())
      .then((str) => new DOMParser().parseFromString(str, "text/xml"))
      .then(this.parseSuunnitteluaineistoUpdatedDate);
  };

  private parseSuunnitteluaineistoUpdatedDate = (
    doc: Document
  ): Promise<Date> => {
    let date: string | null | undefined;

    // IE 11 does not support Document.evaluate() XPath so we need to use query selectors
    doc.querySelectorAll("entry").forEach((value: Element) => {
      if (
        value.querySelector("id")?.textContent ===
        "http://paikkatieto.nba.fi/aineistot/suunnitteluaineisto"
      ) {
        date = value.querySelector("updated")?.textContent;
      }
    });

    if (date) {
      this.dataLatestUpdateDate = new Date(date);
      return Promise.resolve(this.dataLatestUpdateDate);
    }
    return Promise.reject(new Error("Museovirasto updated date not found"));
  };
}
