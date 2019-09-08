import * as React from "react";
import { Page, PageVisibility } from "../Page";
import { SiteInfoPanel } from "./component/SiteInfoPanel";
import { MapSymbolPanel } from "./component/MapSymbolPanel";
import { DataAndLicencesPanel } from "./component/DataAndLicencesPanel";
import { VersionHistoryPanel } from "./component/VersionHistoryPanel";

interface Props {
  visibility: PageVisibility;
  hidePage: () => void;
}

export const InfoPage: React.FC<Props> = ({ visibility, hidePage }) => {
  return (
    <Page
      title="Lisätietoja sivustosta"
      visibility={visibility}
      hidePage={hidePage}
    >
      <SiteInfoPanel />
      <MapSymbolPanel />
      <DataAndLicencesPanel />
      <VersionHistoryPanel />
    </Page>
  );
};
