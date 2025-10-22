import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { Projection } from "ol/proj"
import TileWMS, { Options } from "ol/source/TileWMS"
import { MuseovirastoLayer } from "../../common/layers.types"
import {
  getMuseovirastoFeatureIdField,
  getMuseovirastoFeatureNameField,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoFeatureInfoResult
} from "../../common/museovirasto.types"
import { Settings } from "../../store/storeTypes"

const emptyIdentifyResult: MuseovirastoFeatureInfoResult = {
  type: "FeatureCollection",
  features: []
}

export type ShowLoadingAnimationFn = (show: boolean) => void

export default class MuseovirastoTileLayer {
  private source?: TileWMS
  private readonly layer: TileLayer<TileWMS>
  private readonly updateTileLoadingStatus: ShowLoadingAnimationFn

  public constructor(
    settings: Settings,
    updateTileLoadingStatus: ShowLoadingAnimationFn
  ) {
    this.updateTileLoadingStatus = updateTileLoadingStatus

    this.source = this.createSource(settings)
    this.layer = new TileLayer({
      source: this.source
    })
    this.opacityChanged(settings)
    this.updateLayerVisibility(settings)
  }

  private createSource = (settings: Settings): TileWMS => {
    const { url, selectedLayers } = settings.museovirasto

    const options: Options = {
      urls: [url.wms],
      params: {
        LAYERS: selectedLayers.join(","),
        TILED: true,
        CQL_FILTER: this.getLayerFilter(settings)
      },
      serverType: "geoserver"
    }
    const newSource = new TileWMS(options)

    newSource.on("tileloadstart", () => {
      this.updateTileLoadingStatus(true)
    })
    newSource.on("tileloadend", () => {
      this.updateTileLoadingStatus(false)
    })
    newSource.on("tileloaderror", () => {
      this.updateTileLoadingStatus(false)
    })

    return newSource
  }

  private updateLayerSource = (settings: Settings): void => {
    this.source = this.createSource(settings)
    this.layer.setSource(this.source)
    this.updateLayerVisibility(settings)
  }

  public updateLayerVisibility = (settings: Settings) => {
    const {
      museovirasto: { selectedLayers, enabled }
    } = settings
    this.layer.setVisible(enabled && selectedLayers.length > 0)
  }

  public selectedFeatureLayersChanged = (settings: Settings): void => {
    this.updateLayerSource(settings)
  }

  public selectedMuinaisjaannosTypesChanged = (settings: Settings): void => {
    this.updateLayerSource(settings)
  }

  public selectedMuinaisjaannosDatingsChanged = (settings: Settings): void => {
    this.updateLayerSource(settings)
  }

  public identifyFeaturesAt = async (
    coordinate: Coordinate,
    resolution: number | undefined,
    projection: Projection,
    settings: Settings
  ): Promise<MuseovirastoFeatureInfoResult> => {
    if (
      !this.source ||
      resolution === undefined ||
      settings.museovirasto.selectedLayers.length === 0 ||
      !settings.museovirasto.enabled
    ) {
      return emptyIdentifyResult
    }

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
      return (await response.json()) as MuseovirastoFeatureInfoResult
    }
    return emptyIdentifyResult
  }

  public findFeatures = async (
    searchText: string,
    settings: Settings
  ): Promise<MuseovirastoFeatureInfoResult> => {
    if (!settings.museovirasto.enabled) {
      return emptyIdentifyResult
    }

    let selectedLayers = settings.museovirasto.selectedLayers

    //Muinaismustot areas always have same name as main point so do not search those
    if (selectedLayers.includes(MuseovirastoLayer.Muinaisjaannokset_alue)) {
      selectedLayers = selectedLayers.filter(
        (l) => l !== MuseovirastoLayer.Muinaisjaannokset_alue
      )
    }
    if (selectedLayers.length === 0) {
      return emptyIdentifyResult
    }

    let isSearchTextNumber = false
    if (!isNaN(parseInt(searchText))) {
      isSearchTextNumber = true
    }

    const layerFilters = selectedLayers
      .map((layer) => {
        if (isSearchTextNumber) {
          const idField = getMuseovirastoFeatureIdField(layer)
          if (idField) {
            return { layer, filter: `${idField} = ${searchText}` }
          }
          return undefined
        }
        return {
          layer,
          filter: `${getMuseovirastoFeatureNameField(layer)} ILIKE '%${searchText}%'`
        }
      })
      .filter((f) => !!f)

    const results = (await Promise.all(
      layerFilters.map(({ layer, filter }) => {
        const urlParams = new URLSearchParams({
          service: "WFS",
          acceptversions: "2.0.0",
          request: "GetFeature",
          typeNames: layer,
          count: "50",
          outputFormat: "application/json",
          cql_filter: filter
        })

        const url = new URL(settings.museovirasto.url.wfs)
        url.search = String(urlParams)

        return fetch(String(url)).then((result) => result.json())
      })
    )) as MuseovirastoFeatureInfoResult[]

    return {
      type: "FeatureCollection",
      features: results.flatMap(({ features }) => features)
    }
  }

  public opacityChanged = (settings: Settings): void => {
    this.layer.setOpacity(settings.museovirasto.opacity)
  }

  private getLayerFilter = (settings: Settings): string => {
    const {
      selectedLayers,
      selectedMuinaisjaannosDatings,
      selectedMuinaisjaannosTypes
    } = settings.museovirasto

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
            const filters: string[] = []
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

  public getLayer = (): TileLayer<TileWMS> => this.layer
}
