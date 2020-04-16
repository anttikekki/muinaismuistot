import * as React from "react";
import { Page, PageVisibility } from "../Page";
import { SiteInfoPanel } from "./component/SiteInfoPanel";
import { MapSymbolPanel } from "./component/MapSymbolPanel";
import { DataAndLicencesPanel } from "./component/DataAndLicencesPanel";
import { VersionHistoryPanel } from "./component/VersionHistoryPanel";
import { DataUpdateDatesPanel } from "./component/DataUpdateDatesPanel";
import { DataLatestUpdateDates } from "../../../common/types";

interface Props {
  visibility: PageVisibility;
  hidePage: () => void;
  dataLatestUpdateDates?: DataLatestUpdateDates;
}

export const InfoPage: React.FC<Props> = ({
  visibility,
  hidePage,
  dataLatestUpdateDates
}) => {
  return (
    <Page
      title="Lisätietoja sivustosta"
      visibility={visibility}
      hidePage={hidePage}
    >
      <DataUpdateDatesPanel dataLatestUpdateDates={dataLatestUpdateDates} />
      <SiteInfoPanel />
      <MapSymbolPanel />
      <DataAndLicencesPanel />
      <VersionHistoryPanel />
    </Page>
  );
};
