import * as React from "react"
import { useTranslation } from "react-i18next"
import { Page, PageVisibility } from "../Page"
import { SiteInfoPanel } from "./component/SiteInfoPanel"
import { MapSymbolPanel } from "./component/MapSymbolPanel"
import { DataAndLicencesPanel } from "./component/DataAndLicencesPanel"
import { VersionHistoryPanel } from "./component/VersionHistoryPanel"
import { DataUpdateDatesPanel } from "./component/DataUpdateDatesPanel"

interface Props {
  visibility: PageVisibility
  hidePage: () => void
}

export const InfoPage: React.FC<Props> = ({ visibility, hidePage }) => {
  const { t } = useTranslation()
  return (
    <Page title={t(`info.title`)} visibility={visibility} hidePage={hidePage}>
      <DataUpdateDatesPanel />
      <SiteInfoPanel />
      <MapSymbolPanel />
      <DataAndLicencesPanel />
      <VersionHistoryPanel />
    </Page>
  )
}
