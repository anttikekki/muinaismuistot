import React from "react"
import { Accordion } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { PageId } from "../../../store/storeTypes"
import { Page } from "../Page"
import { DataAndLicencesPanel } from "./component/DataAndLicencesPanel"
import { DataUpdateDatesPanel } from "./component/DataUpdateDatesPanel"
import { MapSymbolPanel } from "./component/MapSymbolPanel"
import { SiteInfoPanel } from "./component/SiteInfoPanel"
import { VersionHistoryPanel } from "./component/VersionHistoryPanel"

export const InfoPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t(`info.title`)} pageId={PageId.Info}>
      <Accordion alwaysOpen>
        <DataUpdateDatesPanel />
        <SiteInfoPanel />
        <MapSymbolPanel />
        <DataAndLicencesPanel />
        <VersionHistoryPanel />
      </Accordion>
    </Page>
  )
}
