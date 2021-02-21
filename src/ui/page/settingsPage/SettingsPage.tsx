import * as React from "react"
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
  GtkLayer
} from "../../../common/types"
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
  settings: Settings
  onSelectMaanmittauslaitosLayer: (layer: MaanmittauslaitosLayer) => void
  onSelectGtkLayer: (layer: GtkLayer) => void
  onGtkLayerOpacityChange: (opacity: number) => void
  onSelectMuseovirastoLayer: (layer: MuseovirastoLayer) => void
  onSelectAhvenanmaaLayer: (layer: AhvenanmaaLayer) => void
  onSelectModelLayer: (layer: ModelLayer) => void
  onSelectMaisemanMuistiLayer: (layer: MaisemanMuistiLayer) => void
  onSelectMuinaisjaannosType: (
    layer: MuinaisjaannosTyyppi | Array<MuinaisjaannosTyyppi>
  ) => void
  onSelectMuinaisjaannosDating: (
    layer: MuinaisjaannosAjoitus | Array<MuinaisjaannosAjoitus>
  ) => void
}

export const SettingsPage: React.FC<Props> = ({
  visibility,
  hidePage,
  settings,
  onSelectMaanmittauslaitosLayer,
  onSelectGtkLayer,
  onGtkLayerOpacityChange,
  onSelectMuseovirastoLayer,
  onSelectAhvenanmaaLayer,
  onSelectModelLayer,
  onSelectMaisemanMuistiLayer,
  onSelectMuinaisjaannosType,
  onSelectMuinaisjaannosDating
}) => {
  const { t } = useTranslation()
  return (
    <Page
      title={t(`settings.title`)}
      visibility={visibility}
      hidePage={hidePage}
    >
      <MMLMapLayerSelectionPanel
        selectedLayer={settings.maanmittauslaitos.selectedLayer}
        onSelectLayer={onSelectMaanmittauslaitosLayer}
      />
      <GTKMapLayerSelectionPanel
        selectedLayers={settings.gtk.selectedLayers}
        opacity={settings.gtk.opacity}
        onSelectLayer={onSelectGtkLayer}
        onOpacityChange={onGtkLayerOpacityChange}
      />
      <MuseovirastoLayerSelectionPanel
        selectedMuseovirastoLayers={settings.museovirasto.selectedLayers}
        onSelectMuseovirastoLayer={onSelectMuseovirastoLayer}
      />
      <AhvenanmaaLayerSelectionPanel
        selectedAhvenanmaaLayers={settings.ahvenanmaa.selectedLayers}
        onSelectAhvenanmaaLayer={onSelectAhvenanmaaLayer}
      />
      <OtherLayerSelectionPanel
        selectedModelLayers={settings.models.selectedLayers}
        selectedMaisemanMuistiLayers={settings.maisemanMuisti.selectedLayers}
        onSelectModelLayer={onSelectModelLayer}
        onSelectMaisemanMuistiLayer={onSelectMaisemanMuistiLayer}
      />
      <FeatureLayerFilterPanel
        selectedMuinaisjaannosTypes={
          settings.museovirasto.selectedMuinaisjaannosTypes
        }
        selectedMuinaisjaannosDatings={
          settings.museovirasto.selectedMuinaisjaannosDatings
        }
        onSelectMuinaisjaannosType={onSelectMuinaisjaannosType}
        onSelectMuinaisjaannosDating={onSelectMuinaisjaannosDating}
      />
    </Page>
  )
}
