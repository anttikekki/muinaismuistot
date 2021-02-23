import * as React from "react"
import { Page, PageVisibility } from "../Page"
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel"
import { OtherLayerSelectionPanel } from "./component/OtherLayerSelectionPanel"
import { FeatureLayerFilterPanel } from "./component/FeatureLayerFilterPanel"
import { useTranslation } from "react-i18next"
import { GTKMapLayerSelectionPanel } from "./component/GTKMapLayerSelectionPanel"
import { MuseovirastoLayerSelectionPanel } from "./component/MuseovirastoLayerSelectionPanel"
import { AhvenanmaaLayerSelectionPanel } from "./component/AhvenanmaaLayerSelectionPanel"

interface Props {
  visibility: PageVisibility
  hidePage: () => void
}

export const SettingsPage: React.FC<Props> = ({ visibility, hidePage }) => {
  const { t } = useTranslation()
  return (
    <Page
      title={t(`settings.title`)}
      visibility={visibility}
      hidePage={hidePage}
    >
      <MMLMapLayerSelectionPanel />
      <GTKMapLayerSelectionPanel />
      <MuseovirastoLayerSelectionPanel />
      <AhvenanmaaLayerSelectionPanel />
      <OtherLayerSelectionPanel />
      <FeatureLayerFilterPanel />
    </Page>
  )
}
