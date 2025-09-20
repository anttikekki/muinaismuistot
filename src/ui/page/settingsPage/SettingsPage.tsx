import React from "react"
import { Accordion } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { PageId } from "../../../store/storeTypes"
import { Page } from "../Page"
import { AhvenanmaaLayerSelectionPanel } from "./component/AhvenanmaaLayerSelectionPanel"
import { GTKMapLayerSelectionPanel } from "./component/GTKMapLayerSelectionPanel"
import { HelsinkiMapLayerSelectionPanel } from "./component/HelsinkiMapLayerSelectionPanel"
import { MaannousuInfoLayerSettingsPanel } from "./component/MaannousuInfoLayerSettingsPanel"
import { MaisemanMuistiLayerSelectionPanel } from "./component/MaisemanMuistiLayerSelectionPanel"
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel"
import { ModelsLayerSelectionPanel } from "./component/ModelsLayerSelectionPanel"
import { MuseovirastoLayerSelectionPanel } from "./component/MuseovirastoLayerSelectionPanel"

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t(`settings.title`)} pageId={PageId.Settings}>
      <Accordion alwaysOpen>
        <MMLMapLayerSelectionPanel />
        <GTKMapLayerSelectionPanel />
        <MaannousuInfoLayerSettingsPanel />
        <MuseovirastoLayerSelectionPanel />
        <AhvenanmaaLayerSelectionPanel />
        <HelsinkiMapLayerSelectionPanel />
        <ModelsLayerSelectionPanel />
        <MaisemanMuistiLayerSelectionPanel />
      </Accordion>
    </Page>
  )
}
