import TileLayer from "ol/layer/Tile"
import TileArcGISRestSource from "ol/source/TileArcGISRest"
import { TileSourceEvent } from "ol/source/Tile"
import { Coordinate } from "ol/coordinate"
import { Size } from "ol/size"
import { Extent } from "ol/extent"
import {
  museovirastoLayerIdMap,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  MuseovirastoLayerId,
  ArgisIdentifyResult,
  ArgisFindResult,
  ArgisFeature
} from "../../common/types"
import { trim } from "../../common/util/featureParser"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (
  layer: TileLayer<TileArcGISRestSource>
) => void

export default class MuseovirastoTileLayer {
  private source?: TileArcGISRestSource
  private layer?: TileLayer<TileArcGISRestSource>
  private store: Store<Settings, ActionTypes>
  private updateTileLoadingStatus: ShowLoadingAnimationFn
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  private dataLatestUpdateDate?: Date

  public constructor(
    store: Store<Settings, ActionTypes>,
    updateTileLoadingStatus: ShowLoadingAnimationFn,
    onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  ) {
    this.store = store
    this.updateTileLoadingStatus = updateTileLoadingStatus
    this.onLayerCreatedCallbackFn = onLayerCreatedCallbackFn
    this.addLayer()
  }

  private addLayer = () => {
    const settings = this.store.getState()
    this.source = this.createSource()
    this.layer = new TileLayer({
      source: this.source
    })
    this.layer.setOpacity(settings.museovirasto.opacity)

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private createSource = () => {
    const settings = this.store.getState()
    const newSource = new TileArcGISRestSource({
      urls: [settings.museovirasto.url.export],
      params: {
        layers: this.getSourceLayerSelectionSettings(),
        layerDefs: this.getSourceLayerDefinitionFilterParams()
      }
    })

    newSource.on("tileloadstart", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(true)
    })
    newSource.on("tileloadend", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })
    newSource.on("tileloaderror", (evt: TileSourceEvent) => {
      this.updateTileLoadingStatus(false)
    })

    return newSource
  }

  private updateLayerSource = () => {
    if (this.layer) {
      this.source = this.createSource()
      this.layer.setSource(this.source)
    }
  }

  private getSourceLayerSelectionSettings = (): string | undefined => {
    const settings = this.store.getState()
    const allLayers: Array<MuseovirastoLayer> = Object.values(MuseovirastoLayer)
    if (allLayers.length === settings.museovirasto.selectedLayers.length) {
      // All layers are selected. No need to filter.
      return undefined
    }
    const selectedLayerIds = this.toLayerIds(
      settings.museovirasto.selectedLayers
    )

    if (selectedLayerIds.length > 0) {
      return "show:" + selectedLayerIds.join(",")
    } else {
      // No selected layers. Hide all.
      // "hide:" dows not work for all layers. Let's just try to display invalid layer.
      return "show:-1"
    }
  }

  private getSourceLayerDefinitionFilterParams = () => {
    const settings = this.store.getState()
    const layerDefinitions: Array<string> = []

    const selectedTypes = settings.museovirasto.selectedMuinaisjaannosTypes
    if (
      selectedTypes.length > 0 &&
      selectedTypes.length != Object.values(MuinaisjaannosTyyppi).length
    ) {
      const layerDefinition = selectedTypes
        .sort()
        .map((tyyppi) => "tyyppi LIKE '%" + tyyppi + "%'")
        .join(" OR ")
      layerDefinitions.push("(" + layerDefinition + ")")
    }
    if (selectedTypes.length === 0) {
      layerDefinitions.push("(tyyppi LIKE 'NONE')")
    }

    const selectedDatings = settings.museovirasto.selectedMuinaisjaannosDatings
    if (
      selectedDatings.length > 0 &&
      selectedDatings.length != Object.values(MuinaisjaannosAjoitus).length
    ) {
      const layerDefinition = selectedDatings
        .sort()
        .map((ajoitus) => "ajoitus LIKE '%" + ajoitus + "%'")
        .join(" OR ")
      layerDefinitions.push("(" + layerDefinition + ")")
    }
    if (selectedDatings.length === 0) {
      layerDefinitions.push("(ajoitus LIKE 'NONE')")
    }

    if (layerDefinitions.length > 0) {
      return (
        museovirastoLayerIdMap[MuseovirastoLayer.Muinaisjaannokset_piste] +
        ":" +
        layerDefinitions.join(" AND ")
      )
    }
    return undefined
  }

  private toLayerIds = (
    layers: Array<MuseovirastoLayer>
  ): Array<MuseovirastoLayerId> => {
    return layers
      .map((layer) => museovirastoLayerIdMap[layer])
      .sort((a, b) => a - b)
  }

  public selectedFeatureLayersChanged = () => {
    this.updateLayerSource()
  }

  public selectedMuinaisjaannosTypesChanged = () => {
    this.updateLayerSource()
  }

  public selectedMuinaisjaannosDatingsChanged = () => {
    this.updateLayerSource()
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    mapSize: Size,
    mapExtent: Extent
  ): Promise<ArgisIdentifyResult> => {
    const settings = this.store.getState()
    const visibleLayerIds =
      settings.museovirasto.selectedLayers.length > 0
        ? this.toLayerIds(settings.museovirasto.selectedLayers)
        : [-1]

    const urlParams = new URLSearchParams({
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: "10",
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers: "visible:" + visibleLayerIds.join(","),
      f: "json",
      returnGeometry: "true"
    })

    const url = new URL(settings.museovirasto.url.identify)
    url.search = String(urlParams)

    const response = await fetch(String(url))
    const result = (await response.json()) as ArgisIdentifyResult

    return this.trimAnsSplitMultivalueFields(result)
  }

  public findFeatures = async (
    searchText: string
  ): Promise<ArgisFindResult> => {
    const settings = this.store.getState()
    let selectedLayers = settings.museovirasto.selectedLayers

    //Muinaismustot areas always have same name as main point so do not search those
    if (selectedLayers.includes(MuseovirastoLayer.Muinaisjaannokset_alue)) {
      selectedLayers = selectedLayers.filter(
        (l) => l !== MuseovirastoLayer.Muinaisjaannokset_alue
      )
    }
    if (selectedLayers.length === 0) {
      return { results: [] }
    }

    let searchFields = "Kohdenimi, Nimi, KOHDENIMI"
    let contains = "true"
    if (!isNaN(parseInt(searchText))) {
      // Search text is number, search by id
      searchFields = "mjtunnus, kohdeID, ID"
      contains = "false"
    }

    const urlParams = new URLSearchParams({
      searchText,
      contains,
      searchFields,
      layers: this.toLayerIds(selectedLayers).join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    })

    const url = new URL(settings.museovirasto.url.find)
    url.search = String(urlParams)

    const response = await fetch(String(url))
    const result = (await response.json()) as ArgisFindResult

    return this.trimAnsSplitMultivalueFields(result)
  }

  private trimAnsSplitMultivalueFields = async (
    data: ArgisIdentifyResult
  ): Promise<ArgisIdentifyResult> => {
    const result: ArgisIdentifyResult = {
      ...data,
      results: data.results?.map((result): ArgisFeature => {
        if (result.layerName === MuseovirastoLayer.Muinaisjaannokset_piste) {
          return {
            ...result,
            attributes: {
              ...result.attributes,
              tyyppiSplitted: trim(result.attributes.tyyppi)
                .replace("taide, muistomerkit", "taide-muistomerkit")
                .split(", ")
                .map((t) =>
                  t === "taide-muistomerkit" ? "taide, muistomerkit" : t
                ) as Array<MuinaisjaannosTyyppi>,
              ajoitusSplitted: trim(result.attributes.ajoitus).split(
                ", "
              ) as Array<MuinaisjaannosAjoitus>,
              alatyyppiSplitted: trim(result.attributes.alatyyppi)
                .replace("rajamerkit, puu", "rajamerkit-puu")
                .split(", ")
                .map((t) => (t === "rajamerkit-puu" ? "rajamerkit, puu" : t))
            }
          }
        }
        return result
      })
    }
    return result
  }

  // http://paikkatieto.nba.fi/aineistot/MV_inspire_atom.xml
  // https://www.avoindata.fi/data/fi/dataset/museoviraston-paikkatietojen-tiedostolataus
  public getDataLatestUpdateDate = (): Promise<Date> => {
    const settings = this.store.getState()
    if (this.dataLatestUpdateDate) {
      return Promise.resolve(this.dataLatestUpdateDate)
    }

    return fetch(settings.museovirasto.url.updateDate)
      .then((response) => response.text())
      .then((str) => new DOMParser().parseFromString(str, "text/xml"))
      .then(this.parseSuunnitteluaineistoUpdatedDate)
  }

  private parseSuunnitteluaineistoUpdatedDate = (
    doc: Document
  ): Promise<Date> => {
    let date: string | null | undefined

    // IE 11 does not support Document.evaluate() XPath so we need to use query selectors
    doc.querySelectorAll("entry").forEach((value: Element) => {
      if (
        value.querySelector("id")?.textContent ===
        "http://paikkatieto.nba.fi/aineistot/suunnitteluaineisto"
      ) {
        date = value.querySelector("updated")?.textContent
      }
    })

    if (date) {
      this.dataLatestUpdateDate = new Date(date)
      return Promise.resolve(this.dataLatestUpdateDate)
    }
    return Promise.reject(new Error("Museovirasto updated date not found"))
  }

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.museovirasto.opacity)
    }
  }
}
