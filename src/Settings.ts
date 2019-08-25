import {
  MuseovirastoLayerId,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  museovirastoLayerIdMap,
  muinaisjaannosTyyppiAllValues,
  muinaisjaannosAjoitusAllValues
} from "./data";

export interface MuseovirastoLayerFilterParams {
  layerId: MuseovirastoLayerId;
  tyyppi: Array<MuinaisjaannosTyyppi>;
  ajoitus: Array<MuinaisjaannosAjoitus>;
}

export type MuseovirastoFilterParameters = Partial<
  Record<MuseovirastoLayer, MuseovirastoLayerFilterParams>
>;

export interface SettingsEventListener {
  selectedMapBackgroundLayerChanged: (
    layerName: MaanmittauslaitosLayer
  ) => void;
  visibleMuinaismuistotLayersChanged: (
    selectedLayerIds: Array<MuseovirastoLayerId>
  ) => void;
  filterParametersChanged: (params: MuseovirastoFilterParameters) => void;
}

export default class Settings {
  private selectedLayerIds: Array<MuseovirastoLayerId>;
  private selectedBackgroundMapLayerName: MaanmittauslaitosLayer;
  private filterParameters: MuseovirastoFilterParameters;

  private eventListener: SettingsEventListener;

  public constructor(eventListener: SettingsEventListener) {
    this.eventListener = eventListener;
    this.selectedLayerIds = this.getMuinaismuistotLayerIds();
    this.selectedBackgroundMapLayerName = MaanmittauslaitosLayer.Taustakartta;
    this.filterParameters = {
      Muinaisjäännökset_piste: {
        layerId: 0,
        tyyppi: [],
        ajoitus: []
      }
    };
  }

  public getMuseovirastoArcGISWMSExportURL = (): string => {
    return "https://d3u1wj9fwedfoy.cloudfront.net";
  };

  public getMuseovirastoArcGISWMSIndentifyURL = (): string => {
    return "https://d3t293l8mhxosa.cloudfront.net?";
  };

  public getMuseovirastoArcGISWMSFindFeaturesURL = (): string => {
    return "https://d3239kmqvyt2db.cloudfront.net?";
  };

  public getMaanmittauslaitosWMTSCapabilitiesURL = (): string => {
    return "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml";
  };

  public getSelectedMuinaismuistotLayerIds = (): Array<MuseovirastoLayerId> => {
    return this.selectedLayerIds.slice(); //Return shallow copy
  };

  public setSelectedMuinaismuistotLayerIds = (
    layerIds: Array<MuseovirastoLayerId>
  ) => {
    this.selectedLayerIds = layerIds;
    this.selectedLayerIds.sort();
    this.eventListener.visibleMuinaismuistotLayersChanged(
      this.getSelectedMuinaismuistotLayerIds()
    );
  };

  public getSelectedBackgroundMapLayerName = (): MaanmittauslaitosLayer => {
    return this.selectedBackgroundMapLayerName;
  };

  public setSelectedBackgroundMapLayerName = (
    layerName: MaanmittauslaitosLayer
  ) => {
    this.selectedBackgroundMapLayerName = layerName;
    this.eventListener.selectedMapBackgroundLayerChanged(layerName);
  };

  public getFilterParameters = (): MuseovirastoFilterParameters => {
    return this.filterParameters;
  };

  public setFilterParameters = (params: MuseovirastoFilterParameters) => {
    this.filterParameters = params;
    this.eventListener.filterParametersChanged(this.filterParameters);
  };

  public setMuinaisjaannosTyyppiFilterParameter = (
    value: MuinaisjaannosTyyppi
  ) => {
    this.filterParameters[
      MuseovirastoLayer.Muinaisjäännökset_piste
    ].tyyppi.push(value);
    this.eventListener.filterParametersChanged(this.filterParameters);
  };

  public setMuinaisjaannosAjoitusFilterParameter = (
    value: MuinaisjaannosAjoitus
  ) => {
    this.filterParameters[
      MuseovirastoLayer.Muinaisjäännökset_piste
    ].ajoitus.push(value);
    this.eventListener.filterParametersChanged(this.filterParameters);
  };

  public getMuinaismuistotLayerIds = (): Array<MuseovirastoLayerId> => {
    return Object.values(museovirastoLayerIdMap).sort();
  };

  public getMuinaismuistotLayerIdMap = () => {
    return museovirastoLayerIdMap;
  };

  public getFilterParamsLayerDefinitions = (): string => {
    const resultArray: Array<string> = [];
    this.addMuinaisjaannosLayerDefinitionFilterParams(
      MuseovirastoLayer.Muinaisjäännökset_piste,
      resultArray
    );
    return resultArray.join(";");
  };

  private addMuinaisjaannosLayerDefinitionFilterParams = (
    layer: MuseovirastoLayer,
    allLayerDefinitions: Array<string>
  ) => {
    const layerDefinitions = [];

    const tyyppiFilters = this.filterParameters[layer].tyyppi;
    if (
      tyyppiFilters.length > 0 &&
      tyyppiFilters.length != muinaisjaannosTyyppiAllValues.length
    ) {
      const layerDefinition = tyyppiFilters
        .map(tyyppi => "tyyppi LIKE '%" + tyyppi + "%'")
        .join(" OR ");
      layerDefinitions.push("(" + layerDefinition + ")");
    }

    const ajoitusFilter = this.filterParameters[layer].ajoitus;
    if (
      ajoitusFilter.length > 0 &&
      ajoitusFilter.length != muinaisjaannosAjoitusAllValues.length
    ) {
      var layerDefinition = ajoitusFilter
        .map(ajoitus => "ajoitus LIKE '%" + ajoitus + "%'")
        .join(" OR ");
      layerDefinitions.push("(" + layerDefinition + ")");
    }

    if (layerDefinitions.length > 0) {
      allLayerDefinitions.push(
        this.filterParameters[layer].layerId +
          ":" +
          layerDefinitions.join(" AND ")
      );
    }
  };

  public layerSelectionChanged = (
    layerId: MuseovirastoLayerId,
    isSelected: boolean
  ) => {
    const selectedLayerIds = this.getSelectedMuinaismuistotLayerIds();

    if (isSelected) {
      if (selectedLayerIds.indexOf(layerId) === -1) {
        selectedLayerIds.push(layerId);
      }
    } else {
      var i = selectedLayerIds.indexOf(layerId);
      if (i > -1) {
        selectedLayerIds.splice(i, 1);
      }
    }

    this.setSelectedMuinaismuistotLayerIds(selectedLayerIds);
  };
}
