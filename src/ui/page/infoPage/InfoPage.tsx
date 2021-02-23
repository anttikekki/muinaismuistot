import React from "react"
import { useTranslation } from "react-i18next"
import { Page } from "../Page"
import { SiteInfoPanel } from "./component/SiteInfoPanel"
import { MapSymbolPanel } from "./component/MapSymbolPanel"
import { DataAndLicencesPanel } from "./component/DataAndLicencesPanel"
import { VersionHistoryPanel } from "./component/VersionHistoryPanel"
import { DataUpdateDatesPanel } from "./component/DataUpdateDatesPanel"
import { PageId } from "../../../store/storeTypes"

export const InfoPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t(`info.title`)} pageId={PageId.Info}>
      <DataUpdateDatesPanel />
      <SiteInfoPanel />
      <MapSymbolPanel />
      <DataAndLicencesPanel />
      <VersionHistoryPanel />
    </Page>
  )
}
