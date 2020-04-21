import * as React from "react";
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
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
  onSelectMuinaisjaannosType,
  onSelectMuinaisjaannosDating,
}) => {
  return (
    <Page title="Asetukset" visibility={visibility} hidePage={hidePage}>
      <MMLMapLayerSelectionPanel
        selectedLayer={settings.selectedMaanmittauslaitosLayer}
        onSelectLayer={onSelectMaanmittauslaitosLayer}
      />
      <FeatureLayerSelectionPanel
        selectedMuseovirastoLayers={settings.selectedMuseovirastoLayers}
        selectedAhvenanmaaLayers={settings.selectedAhvenanmaaLayers}
        onSelectMuseovirastoLayer={onSelectMuseovirastoLayer}
        onSelectAhvenanmaaLayer={onSelectAhvenanmaaLayer}
      />
      <FeatureLayerFilterPanel
        selectedMuinaisjaannosTypes={settings.selectedMuinaisjaannosTypes}
        selectedMuinaisjaannosDatings={settings.selectedMuinaisjaannosDatings}
        onSelectMuinaisjaannosType={onSelectMuinaisjaannosType}
        onSelectMuinaisjaannosDating={onSelectMuinaisjaannosDating}
      />
    </Page>
  );
};
