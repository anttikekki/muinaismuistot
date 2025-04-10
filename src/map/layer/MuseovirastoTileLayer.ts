import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { Projection } from "ol/proj"
import { TileSourceEvent } from "ol/source/Tile"
import TileWMS, { Options } from "ol/source/TileWMS"
import { Store } from "redux"
import { MuseovirastoLayer } from "../../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoWmsFeature,
  MuseovirastoWmsFeatureInfoResult,
  isMuinaisjaannosPisteWmsFeature,
  isMuuKulttuuriperintokohdePisteWmsFeature
} from "../../common/museovirasto.types"
import { trim } from "../../common/util/featureParser"
import { ActionTypes } from "../../store/actionTypes"
import { Settings } from "../../store/storeTypes"

export type ShowLoadingAnimationFn = (show: boolean) => void
export type OnLayersCreatedCallbackFn = (layer: TileLayer<TileWMS>) => void

export default class MuseovirastoTileLayer {
  private source?: TileWMS
  private layer?: TileLayer<TileWMS>
  private store: Store<Settings, ActionTypes>
  private updateTileLoadingStatus: ShowLoadingAnimationFn
  private onLayerCreatedCallbackFn: OnLayersCreatedCallbackFn

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

  private addLayer = (): void => {
    const settings = this.store.getState()
    this.source = this.createSource()
    this.layer = new TileLayer({
      source: this.source
    })
    this.opacityChanged()
    this.updateLayerVisibility()

    this.onLayerCreatedCallbackFn(this.layer)
  }

  private createSource = (): TileWMS => {
    const { url, selectedLayers } = this.store.getState().museovirasto

    const options: Options = {
      urls: [url.wms],
      params: {
        LAYERS: selectedLayers.join(","),
        TILED: true,
        CQL_FILTER: this.getLayerFilter()
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

  private updateLayerSource = (): void => {
    if (this.layer) {
      this.source = this.createSource()
      this.layer.setSource(this.source)
      this.updateLayerVisibility()
    }
  }

  public updateLayerVisibility = () => {
    if (this.layer) {
      const {
        museovirasto: { selectedLayers, enabled }
      } = this.store.getState()
      this.layer.setVisible(enabled && selectedLayers.length > 0)
    }
  }

  public selectedFeatureLayersChanged = (): void => {
    this.updateLayerSource()
  }

  public selectedMuinaisjaannosTypesChanged = (): void => {
    this.updateLayerSource()
  }

  public selectedMuinaisjaannosDatingsChanged = (): void => {
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

  public findFeatures = async (
    searchText: string
  ): Promise<MuseovirastoWmsFeatureInfoResult> => {
    const settings = this.store.getState()
    /*
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
    */

    // https://geoserver.museovirasto.fi/geoserver/ows?service=WFS&acceptversions=2.0.0&request=GetFeature&typeNames=rajapinta_suojellut:muinaisjaannos_piste&count=20&outputFormat=application/json&filter=<Filter><PropertyIsLike wildCard="*" singleChar="." escape="!"><PropertyName>kohdenimi</PropertyName><Literal>*Kissa*</Literal></PropertyIsLike></Filter>

    const urlParams = new URLSearchParams({
      service: "WFS",
      acceptversions: "2.0.0",
      request: "GetFeature",
      typeNames: MuseovirastoLayer.Muinaisjaannokset_piste,
      count: "50",
      outputFormat: "application/json",
      filter: `
      <Filter>
        <Or>
          <PropertyIsLike wildCard="*" singleChar="." escape="!">
            <PropertyName>kohdenimi</PropertyName>
            <Literal>*${searchText}*</Literal>
          </PropertyIsLike>
        </Or>
      </Filter>`
    })

    const url = new URL(settings.museovirasto.url.wfs)
    url.search = String(urlParams)

    const response = await fetch(String(url))
    const result = (await response.json()) as MuseovirastoWmsFeatureInfoResult

    return this.trimAnsSplitMultivalueFields(result)
  }

  private trimAnsSplitMultivalueFields = (
    data: MuseovirastoWmsFeatureInfoResult
  ): MuseovirastoWmsFeatureInfoResult => {
    return {
      ...data,
      features: data.features?.map((feature): MuseovirastoWmsFeature => {
        if (
          isMuinaisjaannosPisteWmsFeature(feature) ||
          isMuuKulttuuriperintokohdePisteWmsFeature(feature)
        ) {
          feature.properties.tyyppiSplitted = trim(feature.properties.tyyppi)
            .replace("taide, muistomerkit", "taide-muistomerkit")
            .split(", ")
            .map((t) =>
              t === "taide-muistomerkit" ? "taide, muistomerkit" : t
            ) as MuinaisjaannosTyyppi[]
          feature.properties.ajoitusSplitted = trim(
            feature.properties.ajoitus
          ).split(", ") as MuinaisjaannosAjoitus[]
          feature.properties.alatyyppiSplitted = trim(
            feature.properties.alatyyppi
          )
            .replace("rajamerkit, puu", "rajamerkit-puu")
            .split(", ")
            .map((t) => (t === "rajamerkit-puu" ? "rajamerkit, puu" : t))

          return feature
        }
        return feature
      })
    }
  }

  public opacityChanged = (): void => {
    if (this.layer) {
      const settings = this.store.getState()
      this.layer.setOpacity(settings.museovirasto.opacity)
    }
  }

  private getLayerFilter = (): string => {
    const {
      selectedLayers,
      selectedMuinaisjaannosDatings,
      selectedMuinaisjaannosTypes
    } = this.store.getState().museovirasto

    const hasDatingsFilter =
      selectedMuinaisjaannosDatings.length !=
      Object.values(MuinaisjaannosAjoitus).length

    const hasTypeFilter =
      selectedMuinaisjaannosTypes.length !=
      Object.values(MuinaisjaannosTyyppi).length

    if (hasDatingsFilter || hasTypeFilter) {
      return selectedLayers
        .map((layer) => {
          if (layer === MuseovirastoLayer.Muinaisjaannokset_piste) {
            const filters: Array<string> = []
            if (hasDatingsFilter) {
              // Add '%' prefix and postfix wildcard because values are like 'keskiaikainen, rautakautinen, , ,'
              const filter = selectedMuinaisjaannosDatings
                .map((dating) => `ajoitus LIKE '%${dating}%'`)
                .join(" OR ")
              filters.push(`(${filter})`)
            }
            if (hasTypeFilter) {
              // Add '%' prefix and postfix wildcard because values are like 'hautapaikat, työ- ja valmistuspaikat, , '
              const filter = selectedMuinaisjaannosTypes
                .map((type) => `tyyppi LIKE '%${type}%'`)
                .join(" OR ")
              filters.push(`(${filter})`)
            }

            return filters.join(" AND ")
          }
          // No filter for this layer, include all values
          return "INCLUDE"
        })
        .join(";")
    }
    return ""
  }
}
