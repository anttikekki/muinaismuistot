import * as React from "react";
import { Settings, MaanmittauslaitosLayer } from "../../../data";
import { Page } from "../Page";
import { MMLMapLayerSelectionPanel } from "./component/MMLMapLayerSelectionPanel";

interface Props {
  visible: boolean;
  hidePage: () => void;
  settings: Settings;
  onSelectMaanmittauslaitosLayer: (layer: MaanmittauslaitosLayer) => void;
}

export const SettingsPage: React.FC<Props> = ({
  visible,
  hidePage,
  settings,
  onSelectMaanmittauslaitosLayer
}) => {
  return (
    <Page visible={visible} hidePage={hidePage}>
      <MMLMapLayerSelectionPanel
        selectedLayer={settings.selectedMaanmittauslaitosLayer}
        onSelectLayer={onSelectMaanmittauslaitosLayer}
      />
    </Page>
  );
};
