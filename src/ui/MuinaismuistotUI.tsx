import "bootstrap/dist/css/bootstrap.min.css"
import "../css/muinaismuistot.css"
import * as React from "react"
import * as ReactDOM from "react-dom"
import {
  ArgisFeature,
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi,
  DataLatestUpdateDates,
  ModelFeatureProperties,
  AhvenanmaaLayer,
  LayerGroup,
  ModelLayer,
  MaisemanMuistiLayer,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../common/types"
import { LoadingAnimation } from "./component/LoadingAnimation"
import { ZoomInButton } from "./component/ZoomInButton"
import { ZoomOutButton } from "./component/ZoomOutButton"
import { CenterToCurrentPositionButton } from "./component/CenterToCurrentPositionButton"
import { ShowInfoPageButton } from "./component/OpenInfoPageButton"
import { FeatureDetailsPage } from "./page/featureDetailsPage/FeatureDetailsPage"
import { SearchPage } from "./page/searchPage/SearchPage"
import { InfoPage } from "./page/infoPage/InfoPage"
import { OpenSearchPageButton } from "./component/OpenSearchPageButton"
import { SettingsPage } from "./page/settingsPage/SettingsPage"
import { OpenSettingsPage } from "./component/OpenSettingsPage"
import { PageVisibility } from "./page/Page"

enum PageId {
  Search = "searchPage",
  Info = "infoPage",
  Settings = "settingsPage",
  Details = "detailsPage"
}

const toggleSelection = function <T>(value: T, values: Array<T>) {
  if (values.includes(value)) {
    return values.filter((v) => v !== value)
  } else {
    return [...values, value]
  }
}

export interface EventListeners {
  searchFeatures: (searchText: string) => void
  zoomIn: () => void
  zoomOut: () => void
  centerToCurrentPositions: () => void
  selectedMaanmittauslaitosLayerChanged: (settings: Settings) => void
  selectedFeatureLayersChanged: (
    settings: Settings,
    changedLayerGroup: LayerGroup
  ) => void
  selectedMuinaisjaannosTypesChanged: (settings: Settings) => void
  selectedMuinaisjaannosDatingsChanged: (settings: Settings) => void
  fetchDataLatestUpdateDates: () => void
}

export default class MuinaismuistotUI {
  private settings: Settings
  private visiblePage?: PageId
  private selectedFeatures?: Array<ArgisFeature>
  private selectedModels?: Array<ModelFeatureProperties>
  private selectedMaisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
  private searchResultFeatures?: Array<ArgisFeature>
  private dataLatestUpdateDates?: DataLatestUpdateDates
  private pageClosingAnimationTimeoutID: Partial<Record<PageId, number>> = {}
  private loadingAnimationTimeoutID?: number
  private loadingAnimationCounter = 0
  private eventListeners: EventListeners

  public constructor(
    initialSettings: Settings,
    eventListeners: EventListeners
  ) {
    this.settings = initialSettings
    this.eventListeners = eventListeners
    this.renderUI()
  }

  private onSearchFeatures = (searchText: string) => {
    this.eventListeners.searchFeatures(searchText)
    this.searchResultFeatures = undefined
    this.renderUI()
  }

  private onSelectMaanmittauslaitosLayer = (layer: MaanmittauslaitosLayer) => {
    this.settings = {
      ...this.settings,
      maanmittauslaitos: {
        ...this.settings.maanmittauslaitos,
        selectedLayer: layer
      }
    }
    this.eventListeners.selectedMaanmittauslaitosLayerChanged(this.settings)
    this.renderUI()
  }

  private onSelectMuseovirastoLayer = (layer: MuseovirastoLayer) => {
    this.settings = {
      ...this.settings,
      museovirasto: {
        ...this.settings.museovirasto,
        selectedLayers: toggleSelection(
          layer,
          this.settings.museovirasto.selectedLayers
        )
      }
    }
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.Museovirasto
    )
    this.renderUI()
  }

  private onSelectAhvenanmaaLayer = (layer: AhvenanmaaLayer) => {
    this.settings = {
      ...this.settings,
      ahvenanmaa: {
        ...this.settings.ahvenanmaa,
        selectedLayers: toggleSelection(
          layer,
          this.settings.ahvenanmaa.selectedLayers
        )
      }
    }
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.Ahvenanmaa
    )
    this.renderUI()
  }

  private onSelectModelLayer = (layer: ModelLayer) => {
    this.settings = {
      ...this.settings,
      models: {
        ...this.settings.models,
        selectedLayers: toggleSelection(
          layer,
          this.settings.models.selectedLayers
        )
      }
    }
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.Models
    )
    this.renderUI()
  }

  private onSelectMaisemanMuistiLayer = (layer: MaisemanMuistiLayer) => {
    this.settings = {
      ...this.settings,
      maisemanMuisti: {
        ...this.settings.maisemanMuisti,
        selectedLayers: toggleSelection(
          layer,
          this.settings.maisemanMuisti.selectedLayers
        )
      }
    }
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.MaisemanMuisti
    )
    this.renderUI()
  }

  private onSelectMuinaisjaannosType = (type: MuinaisjaannosTyyppi) => {
    this.settings = {
      ...this.settings,
      museovirasto: {
        ...this.settings.museovirasto,
        selectedMuinaisjaannosTypes: toggleSelection(
          type,
          this.settings.museovirasto.selectedMuinaisjaannosTypes
        )
      }
    }
    this.eventListeners.selectedMuinaisjaannosTypesChanged(this.settings)
    this.renderUI()
  }

  private onSelectMuinaisjaannosDating = (dating: MuinaisjaannosAjoitus) => {
    this.settings = {
      ...this.settings,
      museovirasto: {
        ...this.settings.museovirasto,
        selectedMuinaisjaannosDatings: toggleSelection(
          dating,
          this.settings.museovirasto.selectedMuinaisjaannosDatings
        )
      }
    }
    this.eventListeners.selectedMuinaisjaannosDatingsChanged(this.settings)
    this.renderUI()
  }

  private renderUI = () => {
    const isLoading = this.loadingAnimationCounter > 0
    const { zoomIn, zoomOut, centerToCurrentPositions } = this.eventListeners

    ReactDOM.render(
      <>
        <LoadingAnimation visible={isLoading} />
        <ZoomInButton onClick={zoomIn} />
        <ZoomOutButton onClick={zoomOut} />
        <CenterToCurrentPositionButton onClick={centerToCurrentPositions} />
        <OpenSearchPageButton onClick={() => this.showPage(PageId.Search)} />
        <ShowInfoPageButton onClick={() => this.showPage(PageId.Info)} />
        <OpenSettingsPage onClick={() => this.showPage(PageId.Settings)} />

        <FeatureDetailsPage
          visibility={this.getPageVisibility(PageId.Details)}
          hidePage={this.hidePage}
          features={this.selectedFeatures}
          models={this.selectedModels}
          maisemanMuistiFeatures={this.selectedMaisemanMuistiFeatures}
        />
        <SearchPage
          visibility={this.getPageVisibility(PageId.Search)}
          hidePage={this.hidePage}
          searchFeatures={this.onSearchFeatures}
          searchResultFeatures={this.searchResultFeatures}
        />
        <InfoPage
          visibility={this.getPageVisibility(PageId.Info)}
          hidePage={this.hidePage}
          dataLatestUpdateDates={this.dataLatestUpdateDates}
        />
        <SettingsPage
          visibility={this.getPageVisibility(PageId.Settings)}
          hidePage={this.hidePage}
          settings={this.settings}
          onSelectMaanmittauslaitosLayer={this.onSelectMaanmittauslaitosLayer}
          onSelectMuseovirastoLayer={this.onSelectMuseovirastoLayer}
          onSelectAhvenanmaaLayer={this.onSelectAhvenanmaaLayer}
          onSelectModelLayer={this.onSelectModelLayer}
          onSelectMaisemanMuistiLayer={this.onSelectMaisemanMuistiLayer}
          onSelectMuinaisjaannosType={this.onSelectMuinaisjaannosType}
          onSelectMuinaisjaannosDating={this.onSelectMuinaisjaannosDating}
        />
      </>,
      document.getElementById("ui")
    )
  }

  private getPageVisibility = (page: PageId): PageVisibility => {
    if (this.visiblePage === page) {
      return PageVisibility.Visible
    }
    if (this.pageClosingAnimationTimeoutID[page]) {
      return PageVisibility.Closing
    }
    return PageVisibility.Hidden
  }

  private showPage = (page: PageId) => {
    if (this.visiblePage === page) {
      return
    }
    this.abortClosingPage(page)
    this.visiblePage = page

    if (page === PageId.Info) {
      this.eventListeners.fetchDataLatestUpdateDates()
    }

    this.renderUI()
  }

  private hidePage = () => {
    if (this.visiblePage) {
      this.startClosingPage(this.visiblePage)
    }

    this.visiblePage = undefined
    this.renderUI()
  }

  private startClosingPage = (page: PageId) => {
    this.pageClosingAnimationTimeoutID[page] = window.setTimeout(() => {
      this.pageClosingAnimationTimeoutID[page] = undefined
      this.renderUI()
    }, 500)
  }

  private abortClosingPage = (page: PageId) => {
    if (this.pageClosingAnimationTimeoutID[page]) {
      window.clearTimeout(this.pageClosingAnimationTimeoutID[page])
      this.pageClosingAnimationTimeoutID[page] = undefined
    }
  }

  public showLoadingAnimation = (show: boolean) => {
    const oldCounterValue = this.loadingAnimationCounter
    if (show) {
      this.loadingAnimationCounter++
    } else {
      this.loadingAnimationCounter--
    }

    if (oldCounterValue === 0 && this.loadingAnimationCounter === 1) {
      this.loadingAnimationTimeoutID = window.setTimeout(() => {
        if (this.loadingAnimationTimeoutID) {
          this.renderUI()
        }
      }, 300)
    }

    if (oldCounterValue === 1 && this.loadingAnimationCounter === 0) {
      window.clearTimeout(this.loadingAnimationTimeoutID)
      this.loadingAnimationTimeoutID = undefined
      this.renderUI()
    }
  }

  public featuresSelected = (
    selectedFeatures: Array<ArgisFeature>,
    models: Array<ModelFeatureProperties>,
    maisemanMuistiFeatures: Array<
      GeoJSONFeature<MaisemanMuistiFeatureProperties>
    >
  ) => {
    if (selectedFeatures.length === 0 && maisemanMuistiFeatures.length === 0) {
      return
    }
    this.selectedFeatures = selectedFeatures
    this.selectedModels = models
    this.selectedMaisemanMuistiFeatures = maisemanMuistiFeatures
    this.visiblePage = PageId.Details
    this.renderUI()
  }

  public featureSearchReady = (features: Array<ArgisFeature>) => {
    this.searchResultFeatures = features
    this.renderUI()
  }

  public dataLatestUpdateDatesReady = (dates: DataLatestUpdateDates) => {
    this.dataLatestUpdateDates = dates
    this.renderUI()
  }
}
