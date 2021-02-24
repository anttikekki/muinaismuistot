import * as React from "react"
import { Page } from "../Page"
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel"
import { OtherLayerSelectionPanel } from "./component/OtherLayerSelectionPanel"
import { FeatureLayerFilterPanel } from "./component/FeatureLayerFilterPanel"
import { useTranslation } from "react-i18next"
import { GTKMapLayerSelectionPanel } from "./component/GTKMapLayerSelectionPanel"
import { MuseovirastoLayerSelectionPanel } from "./component/MuseovirastoLayerSelectionPanel"
import { AhvenanmaaLayerSelectionPanel } from "./component/AhvenanmaaLayerSelectionPanel"
import { PageId } from "../../../store/storeTypes"

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t(`settings.title`)} pageId={PageId.Settings}>
      <MMLMapLayerSelectionPanel />
      <GTKMapLayerSelectionPanel />
      <MuseovirastoLayerSelectionPanel />
      <AhvenanmaaLayerSelectionPanel />
      <OtherLayerSelectionPanel />
      <FeatureLayerFilterPanel />
    </Page>
  )
}
