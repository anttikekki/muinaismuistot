import TileLayer from "ol/layer/Tile"
import { TileSourceEvent } from "ol/source/Tile"
import { Coordinate } from "ol/coordinate"
import { trim } from "../../common/util/featureParser"
import { Settings } from "../../store/storeTypes"
import { Store } from "redux"
import { ActionTypes } from "../../store/actionTypes"
import TileWMS, { Options } from "ol/source/TileWMS"
import { Projection } from "ol/proj"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoWmsFeature,
  MuseovirastoWmsFeatureInfoResult,
  isMuinaisjaannosPisteWmsFeature
} from "../../common/museovirasto.types"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer<TileWMS>) => void

export default class MuseovirastoTileLayer {
  private source?: TileWMS
  private layer?: TileLayer<TileWMS>
  private store: Store<Settings, ActionTypes>
  private updateTileLoadingStatus: ShowLoadingAnimationFn
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn
  private dataLatestUpdateDate?: Date | null

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
    const options: Options = {
      urls: [settings.museovirasto.url.wms],
      params: {
        LAYERS: settings.museovirasto.selectedLayers.join(","),
        TILED: true
      },
      serverType: "geoserver"
    }
    const newSource = new TileWMS(options)

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

  public selectedFeatureLayersChanged = () => {
    this.updateLayerSource()
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    resolution: number | undefined,
    projection: Projection
  ): Promise<MuseovirastoWmsFeatureInfoResult> => {
    const settings = this.store.getState()

    if (this.source && resolution !== undefined) {
      const url = this.source.getFeatureInfoUrl(
        coordinate,
        resolution,
        projection,
        {
          INFO_FORMAT: "application/json",
          QUERY_LAYERS: settings.museovirasto.selectedLayers.join(","),
          FEATURE_COUNT: 100,
          /**
           * Geoserver vendor specific param to extend the search radius pixels. Similar to ArcGis tolerance.
           * @see https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#buffer
           */
          BUFFER: 15
        }
      )
      if (url) {
        const response = await fetch(String(url))
        const result =
          (await response.json()) as MuseovirastoWmsFeatureInfoResult

        return this.trimAnsSplitMultivalueFields(result)
      }
    }
    return Promise.reject()
  }
  /*
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
  
    return Promise.reject()
  }
    */

  private trimAnsSplitMultivalueFields = async (
    data: MuseovirastoWmsFeatureInfoResult
  ): Promise<MuseovirastoWmsFeatureInfoResult> => {
    const result: MuseovirastoWmsFeatureInfoResult = {
      ...data,
      features: data.features?.map((feature): MuseovirastoWmsFeature => {
        if (isMuinaisjaannosPisteWmsFeature(feature)) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              tyyppiSplitted: trim(feature.properties.tyyppi)
                .replace("taide, muistomerkit", "taide-muistomerkit")
                .split(", ")
                .map((t) =>
                  t === "taide-muistomerkit" ? "taide, muistomerkit" : t
                ) as Array<MuinaisjaannosTyyppi>,
              ajoitusSplitted: trim(feature.properties.ajoitus).split(
                ", "
              ) as Array<MuinaisjaannosAjoitus>,
              alatyyppiSplitted: trim(feature.properties.alatyyppi)
                .replace("rajamerkit, puu", "rajamerkit-puu")
                .split(", ")
                .map((t) => (t === "rajamerkit-puu" ? "rajamerkit, puu" : t))
            }
          }
        }
        return feature
      })
    }
    return result
  }

  // http://paikkatieto.nba.fi/aineistot/MV_inspire_atom.xml
  // https://www.avoindata.fi/data/fi/dataset/museoviraston-paikkatietojen-tiedostolataus
  public getDataLatestUpdateDate = (): Promise<Date | null> => {
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
  ): Promise<Date | null> => {
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
    return Promise.resolve(null)
  }

  public opacityChanged = () => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.museovirasto.opacity)
    }
  }
}
