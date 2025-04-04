import React from "react"
import { useTranslation } from "react-i18next"
import { PageId } from "../../../store/storeTypes"
import { Page } from "../Page"
import { AhvenanmaaLayerSelectionPanel } from "./component/AhvenanmaaLayerSelectionPanel"
import { FeatureLayerFilterPanel } from "./component/FeatureLayerFilterPanel"
import { GTKMapLayerSelectionPanel } from "./component/GTKMapLayerSelectionPanel"
import { HelsinkiMapLayerSelectionPanel } from "./component/HelsinkiMapLayerSelectionPanel"
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel"
import { MMLVanhatKartatLayerSelectionPanel } from "./component/MMLVanhatKartatMapLayerSelectionPanel"
import { MuseovirastoLayerSelectionPanel } from "./component/MuseovirastoLayerSelectionPanel"
import { OtherLayerSelectionPanel } from "./component/OtherLayerSelectionPanel"

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t(`settings.title`)} pageId={PageId.Settings}>
      <MMLMapLayerSelectionPanel />
      <MMLVanhatKartatLayerSelectionPanel />
      <GTKMapLayerSelectionPanel />
      <MuseovirastoLayerSelectionPanel />
      <AhvenanmaaLayerSelectionPanel />
      <HelsinkiMapLayerSelectionPanel />
      <OtherLayerSelectionPanel />
      <FeatureLayerFilterPanel />
    </Page>
  )
}
