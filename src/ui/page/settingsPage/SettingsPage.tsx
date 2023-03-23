import React from "react"
import { useTranslation } from "react-i18next"
import { Page } from "../Page"
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel"
import { OtherLayerSelectionPanel } from "./component/OtherLayerSelectionPanel"
import { FeatureLayerFilterPanel } from "./component/FeatureLayerFilterPanel"
import { GTKMapLayerSelectionPanel } from "./component/GTKMapLayerSelectionPanel"
import { MuseovirastoLayerSelectionPanel } from "./component/MuseovirastoLayerSelectionPanel"
import { AhvenanmaaLayerSelectionPanel } from "./component/AhvenanmaaLayerSelectionPanel"
import { PageId } from "../../../store/storeTypes"
import { HelsinkiMapLayerSelectionPanel } from "./component/HelsinkiMapLayerSelectionPanel"
import { MaankohoaminenLayerSelectionPanel } from "./component/MaankohoaminenLayerSelectionPanel"

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t(`settings.title`)} pageId={PageId.Settings}>
      <MMLMapLayerSelectionPanel />
      <GTKMapLayerSelectionPanel />
      <MaankohoaminenLayerSelectionPanel />
      <MuseovirastoLayerSelectionPanel />
      <AhvenanmaaLayerSelectionPanel />
      <HelsinkiMapLayerSelectionPanel />
      <OtherLayerSelectionPanel />
      <FeatureLayerFilterPanel />
    </Page>
  )
}
