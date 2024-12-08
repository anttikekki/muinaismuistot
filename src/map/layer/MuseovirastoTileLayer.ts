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
  isMuinaisjaannosPisteWmsFeature,
  isMuuKulttuuriperintokohdePisteWmsFeature
} from "../../common/museovirasto.types"
import { MuseovirastoLayer } from "../../common/layers.types"

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
    this.layer.setOpacity(settings.museovirasto.opacity)

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

    let selectedLayers = settings.museovirasto.selectedLayers

    //Muinaismustot areas always have same name as main point so do not search the areas
    if (
      selectedLayers.includes(MuseovirastoLayer.Muinaisjaannokset_alue) &&
      selectedLayers.includes(MuseovirastoLayer.Muinaisjaannokset_piste)
    ) {
      selectedLayers = selectedLayers.filter(
        (l) => l !== MuseovirastoLayer.Muinaisjaannokset_alue
      )
    }

    let filter = ""

    // Search text is number, search by id
    if (!isNaN(parseInt(searchText))) {
      // Maailmanperintö-features do not have any id field, so drop those layers from search
      selectedLayers = selectedLayers.filter(
        (layer) =>
          layer != MuseovirastoLayer.Maailmanperinto_piste &&
          layer != MuseovirastoLayer.Maailmanperinto_alue
      )

      filter = selectedLayers
        .map((layer) => {
          let idField = "mjtunnus"
          if (
            layer === MuseovirastoLayer.Suojellut_rakennukset_piste ||
            layer === MuseovirastoLayer.Suojellut_rakennukset_alue
          ) {
            idField = "kohdeID"
          }
          if (
            layer === MuseovirastoLayer.RKY_piste ||
            layer === MuseovirastoLayer.RKY_viiva ||
            layer === MuseovirastoLayer.RKY_alue
          ) {
            idField = "id"
          }
          return `${idField} = '${searchText}'`
        })
        .join(";")
    } else {
      // Search by name
      filter = selectedLayers
        .map((layer) => {
          let nameField = "kohdenimi"
          if (
            layer === MuseovirastoLayer.Maailmanperinto_piste ||
            layer === MuseovirastoLayer.Maailmanperinto_alue
          ) {
            nameField = "nimi"
          }
          return `${nameField} LIKE '%${searchText}%'`
        })
        .join(";")
    }

    const urlParams = new URLSearchParams({
      service: "WFS",
      acceptversions: "2.0.0",
      request: "GetFeature",
      typeNames: selectedLayers.join(","),
      count: "50",
      outputFormat: "application/json",
      CQL_FILTER: filter
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

  // ECQL reference: https://docs.geoserver.org/latest/en/user/filter/ecql_reference.html#filter-ecql-reference
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
