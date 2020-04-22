import * as React from "react";
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
  ModelLayer,
} from "../../../common/types";
import { Page, PageVisibility } from "../Page";
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel";
import { FeatureLayerSelectionPanel } from "./component/FeatureLayerSelectionPanel";
import { FeatureLayerFilterPanel } from "./component/FeatureLayerFilterPanel";

interface Props {
  visibility: PageVisibility;
  hidePage: () => void;
  settings: Settings;
  onSelectMaanmittauslaitosLayer: (layer: MaanmittauslaitosLayer) => void;
  onSelectMuseovirastoLayer: (layer: MuseovirastoLayer) => void;
  onSelectAhvenanmaaLayer: (layer: AhvenanmaaLayer) => void;
  onSelectModelLayer: (layer: ModelLayer) => void;
  onSelectMuinaisjaannosType: (type: MuinaisjaannosTyyppi) => void;
  onSelectMuinaisjaannosDating: (dating: MuinaisjaannosAjoitus) => void;
}

export const SettingsPage: React.FC<Props> = ({
  visibility,
  hidePage,
  settings,
  onSelectMaanmittauslaitosLayer,
  onSelectMuseovirastoLayer,
  onSelectAhvenanmaaLayer,
  onSelectModelLayer,
  onSelectMuinaisjaannosType,
  onSelectMuinaisjaannosDating,
}) => {
  return (
    <Page title="Asetukset" visibility={visibility} hidePage={hidePage}>
      <MMLMapLayerSelectionPanel
        selectedLayer={settings.maanmittauslaitos.selectedLayer}
        onSelectLayer={onSelectMaanmittauslaitosLayer}
      />
      <FeatureLayerSelectionPanel
        selectedMuseovirastoLayers={settings.museovirasto.selectedLayers}
        selectedAhvenanmaaLayers={settings.ahvenanmaa.selectedLayers}
        selectedModelLayers={settings.models.selectedLayers}
        onSelectMuseovirastoLayer={onSelectMuseovirastoLayer}
        onSelectAhvenanmaaLayer={onSelectAhvenanmaaLayer}
        onSelectModelLayer={onSelectModelLayer}
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
  );
};
