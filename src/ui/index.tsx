import "bootstrap/dist/css/bootstrap.min.css"
import "../css/muinaismuistot.css"
import React from "react"
import { createRoot } from "react-dom/client"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import fiTranslations from "../common/translations/fi.json"
import svTranslations from "../common/translations/sv.json"
import { Language } from "../common/layers.types"
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
import { FullscreenButton } from "./component/mapButton/FullscreenButton"
import { Store } from "redux"
import { Provider } from "react-redux"
import { ActionTypes } from "../store/actionTypes"
import { Settings } from "../store/storeTypes"

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen()
  } else if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

export const createUI = (store: Store<Settings, ActionTypes>) => {
  i18n.use(initReactI18next).init({
    resources: {
      fi: { translation: fiTranslations },
      sv: { translation: svTranslations }
    },
    lng: store.getState().language,
    supportedLngs: Object.values(Language),
    fallbackLng: Language.FI,
    defaultNS: "translation",
    interpolation: {
      escapeValue: false
    }
  })

  const root = createRoot(document.getElementById("ui")!)
  root.render(
    <Provider store={store}>
      <LoadingAnimation />
      <ZoomInButton />
      <ZoomOutButton />
      <CenterToCurrentPositionButton />
      <OpenSearchPageButton />
      <ShowInfoPageButton />
      <OpenSettingsPage />
      <FullscreenButton
        onClick={toggleFullscreen}
        fullscreenPossible={document.fullscreenEnabled}
      />

      <FeatureDetailsPage />
      <SearchPage />
      <InfoPage />
      <SettingsPage />
    </Provider>
  )
}
