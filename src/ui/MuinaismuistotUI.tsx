import "bootstrap/dist/css/bootstrap.min.css"
import "../css/muinaismuistot.css"
import * as React from "react"
import * as ReactDOM from "react-dom"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import fiTranslations from "../common/translations/fi.json"
import svTranslations from "../common/translations/sv.json"
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
  MaisemanMuistiFeatureProperties,
  Language
} from "../common/types"
import { LoadingAnimation } from "./component/LoadingAnimation"
import { ZoomInButton } from "./component/mapButton/ZoomInButton"
import { ZoomOutButton } from "./component/mapButton/ZoomOutButton"
import { CenterToCurrentPositionButton } from "./component/mapButton/CenterToCurrentPositionButton"
import { ShowInfoPageButton } from "./component/mapButton/OpenInfoPageButton"
import { FeatureDetailsPage } from "./page/featureDetailsPage/FeatureDetailsPage"
import { SearchPage } from "./page/searchPage/SearchPage"
import { InfoPage } from "./page/infoPage/InfoPage"
import { OpenSearchPageButton } from "./component/mapButton/OpenSearchPageButton"
import { SettingsPage } from "./page/settingsPage/SettingsPage"
import { OpenSettingsPage } from "./component/mapButton/OpenSettingsPage"
import { PageVisibility } from "./page/Page"
import {
  updateAhvenanmaaSelectedLayers,
  updateLanguage,
  updateMaanmittauslaitosSelectedLayer,
  updateMaisemanMuistiSelectedLayers,
  updateModelSelectedLayers,
  updateMuseovirastoSelectedLayers,
  updateSelectMuinaisjaannosDatings,
  updateSelectMuinaisjaannosTypes
} from "../settings"

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
  selectedLanguageChanged: (settings: Settings) => void
  fetchDataLatestUpdateDates: () => void
}

i18n.use(initReactI18next).init({
  resources: {
    fi: { translation: fiTranslations },
    sv: { translation: svTranslations }
  },
  lng: Language.FI,
  supportedLngs: Object.values(Language),
  fallbackLng: Language.FI,
  defaultNS: "translation",
  interpolation: {
    escapeValue: false
  }
})

export default class MuinaismuistotUI {
  private settings: Settings
  private visiblePage?: PageId
  private selectedFeatures?: Array<ArgisFeature>
  private selectedModels?: Array<GeoJSONFeature<ModelFeatureProperties>>
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

    i18n.changeLanguage(this.settings.language)
    i18n.on("languageChanged", (lang) => {
      this.settings = updateLanguage(this.settings, lang as Language)
      this.eventListeners.selectedLanguageChanged(this.settings)
    })

    this.renderUI()
  }

  private onSearchFeatures = (searchText: string) => {
    this.eventListeners.searchFeatures(searchText)
    this.searchResultFeatures = undefined
    this.renderUI()
  }

  private onSelectMaanmittauslaitosLayer = (layer: MaanmittauslaitosLayer) => {
    this.settings = updateMaanmittauslaitosSelectedLayer(this.settings, layer)
    this.eventListeners.selectedMaanmittauslaitosLayerChanged(this.settings)
    this.renderUI()
  }

  private onSelectMuseovirastoLayer = (layer: MuseovirastoLayer) => {
    this.settings = updateMuseovirastoSelectedLayers(
      this.settings,
      toggleSelection(layer, this.settings.museovirasto.selectedLayers)
    )
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.Museovirasto
    )
    this.renderUI()
  }

  private onSelectAhvenanmaaLayer = (layer: AhvenanmaaLayer) => {
    this.settings = updateAhvenanmaaSelectedLayers(
      this.settings,
      toggleSelection(layer, this.settings.ahvenanmaa.selectedLayers)
    )
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.Ahvenanmaa
    )
    this.renderUI()
  }

  private onSelectModelLayer = (layer: ModelLayer) => {
    this.settings = updateModelSelectedLayers(
      this.settings,
      toggleSelection(layer, this.settings.models.selectedLayers)
    )
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.Models
    )
    this.renderUI()
  }

  private onSelectMaisemanMuistiLayer = (layer: MaisemanMuistiLayer) => {
    this.settings = updateMaisemanMuistiSelectedLayers(
      this.settings,
      toggleSelection(layer, this.settings.maisemanMuisti.selectedLayers)
    )
    this.eventListeners.selectedFeatureLayersChanged(
      this.settings,
      LayerGroup.MaisemanMuisti
    )
    this.renderUI()
  }

  private onSelectMuinaisjaannosType = (
    type: MuinaisjaannosTyyppi | Array<MuinaisjaannosTyyppi>
  ) => {
    if (Array.isArray(type)) {
      this.settings = updateSelectMuinaisjaannosTypes(this.settings, type)
    } else {
      this.settings = updateSelectMuinaisjaannosTypes(
        this.settings,
        toggleSelection(
          type,
          this.settings.museovirasto.selectedMuinaisjaannosTypes
        )
      )
    }
    this.eventListeners.selectedMuinaisjaannosTypesChanged(this.settings)
    this.renderUI()
  }

  private onSelectMuinaisjaannosDating = (
    dating: MuinaisjaannosAjoitus | Array<MuinaisjaannosAjoitus>
  ) => {
    if (Array.isArray(dating)) {
      this.settings = updateSelectMuinaisjaannosDatings(this.settings, dating)
    } else {
      this.settings = updateSelectMuinaisjaannosDatings(
        this.settings,
        toggleSelection(
          dating,
          this.settings.museovirasto.selectedMuinaisjaannosDatings
        )
      )
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
    models: Array<GeoJSONFeature<ModelFeatureProperties>>,
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
