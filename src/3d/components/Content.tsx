import * as React from "react";
import { TableOfContent } from "./TableOfContent";
import { DatabaseStructure } from "./DatabaseStructure";
import { Registers } from "./Registers";
import { Download } from "./Download";
import { ModelsTable } from "./ModelsTable";
import { GeoJSONFeature, GeoJSONResponse } from "../../common/types";
import { getGeoJSONDataLatestUpdateDate } from "../../common/util/featureParser";
import { DatabaseIntro } from "./DatabaseIntro";

export const Content: React.FC = () => {
  const [models, setModels] = React.useState<Array<GeoJSONFeature>>([]);
  const [latestUpdateDate, setLatestUpdateDate] = React.useState<Date>();

  React.useEffect(() => {
    fetch("3d.json")
      .then((response) => response.json())
      .then((data) => data as GeoJSONResponse)
      .then((data) => setModels(data.features));
  }, []);

  React.useEffect(() => {
    setLatestUpdateDate(getGeoJSONDataLatestUpdateDate(models));
  }, [models]);

  return (
    <>
      <div className="jumbotron">
        <div className="container">
          <h1>Kulttuuriperinnön 3D-mallien tietokanta</h1>

          <p>
            Tämä tietokanta yrittää kerätä Suomen arkeologisesta
            kulttuuriperinnöstä ja rakennetuista kulttuuriympäristöistä tehtyjä
            3D-malleja yhteen paikkaan helposti käytettävänä
            paikkatietoaineistona.
          </p>

          <p>
            <b>Uusin lisäys tietokantaan:</b>{" "}
            <span>{latestUpdateDate?.toLocaleDateString("fi")}</span>
            <br />
            <b>3D-malleja tietokannassa:</b> <span>{models.length} kpl</span>
            <br />
          </p>
        </div>
      </div>
      <div className="container">
        <TableOfContent />
        <DatabaseIntro />
        <Registers />
        <DatabaseStructure />
        <Download />

        <h2 id="lisenssit">3D-mallien lisenssit</h2>
        <p>
          Tekijä on määritellyt Sketchfab-palvelussa mallille käyttölisenssin.
          Tämä tieto on mukana tietokannassa.
        </p>

        <h2 id="yllapito">Ylläpito</h2>
        <p>
          Tätä tietokantaa ylläpitää Antti Kekki. Voit ilmoittaa uuden mallin
          tietokantaan lähettämällä sähköpostia osoitteeseen{" "}
          <a href="mailto:antti.kekki@gmail.com">antti.kekki@gmail.com</a>. Myös
          yhteydeotot ja kyselyt samaan osoitteeseen.
        </p>

        <ModelsTable models={models} />
      </div>
    </>
  );
};
