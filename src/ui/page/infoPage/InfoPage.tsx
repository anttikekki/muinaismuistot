import * as React from "react";
import { Page } from "../Page";
import { SiteInfoPanel } from "./component/SiteInfoPanel";
import { MapSymbolPanel } from "./component/MapSymbolPanel";
import { DataAndLicencesPanel } from "./component/DataAndLicencesPanel";
import { VersionHistoryPanel } from "./component/VersionHistoryPanel";

interface Props {
  visible: boolean;
  hidePage: () => void;
}

export const InfoPage: React.FC<Props> = ({ visible, hidePage }) => {
  return (
    <Page title="Lisätietoja sivustosta" visible={visible} hidePage={hidePage}>
      <SiteInfoPanel />
      <MapSymbolPanel />
      <DataAndLicencesPanel />
      <VersionHistoryPanel />
    </Page>
  );
};
