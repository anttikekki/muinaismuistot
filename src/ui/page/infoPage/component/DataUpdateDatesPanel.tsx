import * as React from "react";
import { Panel } from "../../../component/Panel";
import { DataLatestUpdateDates } from "../../../../data";

const UpdatedDate: React.FC<{ date: Date | null | undefined }> = ({ date }) => {
  if (date === undefined) {
    return <p>Tietoa selvitetään parhaillaan...</p>;
  }
  if (date === null) {
    return <p>Päivityshetkeä ei valitettavasti saatu selville</p>;
  }
  return <p>{date.toLocaleDateString("fi")}</p>;
};

interface Props {
  dataLatestUpdateDates?: DataLatestUpdateDates;
}

export const DataUpdateDatesPanel: React.FC<Props> = ({
  dataLatestUpdateDates
}) => {
  return (
    <Panel title="Aineisto päivitetty viimeksi">
      <h5>Museoviraston aineistot</h5>
      <UpdatedDate date={dataLatestUpdateDates?.museovirasto} />

      <h5>Ahvenamaan paikallishallinnon aineistot</h5>
      <UpdatedDate date={dataLatestUpdateDates?.ahvenanmaa} />
    </Panel>
  );
};
