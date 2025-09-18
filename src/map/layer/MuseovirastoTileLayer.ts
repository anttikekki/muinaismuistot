import { Coordinate } from "ol/coordinate"
import TileLayer from "ol/layer/Tile"
import { Projection } from "ol/proj"
import TileWMS, { Options } from "ol/source/TileWMS"
import { MuseovirastoLayer } from "../../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  MuseovirastoFeature,
  MuseovirastoFeatureInfoResult,
  isMuinaisjaannosPisteFeature,
  isMuuKulttuuriperintokohdePisteFeature
} from "../../common/museovirasto.types"
import { trim } from "../../common/util/featureParser"
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
      const result = (await response.json()) as MuseovirastoFeatureInfoResult

      return this.trimAnsSplitMultivalueFields(result)
    }
    return emptyIdentifyResult
  }

  public findFeatures = async (
    searchText: string,
    settings: Settings
  ): Promise<MuseovirastoFeatureInfoResult> => {
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
    const result = (await response.json()) as MuseovirastoFeatureInfoResult

    return this.trimAnsSplitMultivalueFields(result)
  }

  private trimAnsSplitMultivalueFields = (
    data: MuseovirastoFeatureInfoResult
  ): MuseovirastoFeatureInfoResult => {
    return {
      ...data,
      features: data.features?.map((feature): MuseovirastoFeature => {
        if (
          isMuinaisjaannosPisteFeature(feature) ||
          isMuuKulttuuriperintokohdePisteFeature(feature)
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
