import * as React from "react";
import {
  Settings,
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus,
  AhvenanmaaLayer,
  ModelLayer,
  MaisemanMuistiLayer,
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
  onSelectMaisemanMuistiLayer: (layer: MaisemanMuistiLayer) => void;
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
  onSelectMaisemanMuistiLayer,
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
        selectedMaisemanMuistiLayers={settings.maisemanMuisti.selectedLayers}
        onSelectMuseovirastoLayer={onSelectMuseovirastoLayer}
        onSelectAhvenanmaaLayer={onSelectAhvenanmaaLayer}
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
  );
};
