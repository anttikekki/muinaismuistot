import "bootstrap/dist/css/bootstrap.min.css"
import "../css/muinaismuistot.css"
import React from "react"
import * as ReactDOM from "react-dom"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import fiTranslations from "../common/translations/fi.json"
import svTranslations from "../common/translations/sv.json"
import { Language } from "../common/types"
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
import { FullscreenButton } from "./component/mapButton/FullscreenButton"
import { Store } from "redux"
import { Provider } from "react-redux"
import { ActionTypes } from "../store/actionTypes"
import { PageId, Settings } from "../store/storeTypes"

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
  private visiblePage?: PageId
  private pageClosingAnimationTimeoutID: Partial<Record<PageId, number>> = {}
  private loadingAnimationTimeoutID?: number
  private loadingAnimationCounter = 0
  private store: Store<Settings, ActionTypes>

  public constructor(store: Store<Settings, ActionTypes>) {
    this.store = store

    i18n.changeLanguage(this.store.getState().language)
    this.renderUI()
  }

  private toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen()
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  private renderUI = () => {
    ReactDOM.render(
      <Provider store={this.store}>
        <LoadingAnimation />
        <ZoomInButton />
        <ZoomOutButton />
        <CenterToCurrentPositionButton />
        <OpenSearchPageButton onClick={() => this.showPage(PageId.Search)} />
        <ShowInfoPageButton onClick={() => this.showPage(PageId.Info)} />
        <OpenSettingsPage onClick={() => this.showPage(PageId.Settings)} />
        <FullscreenButton
          onClick={this.toggleFullscreen}
          fullscreenPossible={document.fullscreenEnabled}
        />

        <FeatureDetailsPage
          visibility={this.getPageVisibility(PageId.Details)}
          hidePage={this.hidePage}
        />
        <SearchPage
          visibility={this.getPageVisibility(PageId.Search)}
          hidePage={this.hidePage}
        />
        <InfoPage
          visibility={this.getPageVisibility(PageId.Info)}
          hidePage={this.hidePage}
        />
        <SettingsPage
          visibility={this.getPageVisibility(PageId.Settings)}
          hidePage={this.hidePage}
        />
      </Provider>,
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
}
