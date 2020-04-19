import * as React from "react";
import { TableOfContent } from "./TableOfContent";
import { DatabaseStructure } from "./DatabaseStructure";
import { Registers } from "./Registers";
import { Download } from "./Download";
import { ModelsTable } from "./ModelsTable";
import { GeoJSONFeature, GeoJSONResponse } from "../../common/types";
import { getGeoJSONDataLatestUpdateDate } from "../../common/util/featureParser";

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

        <h2 id="Tietokannan-tarkoitus">Tietokannan tarkoitus</h2>
        <p>
          Museot, Museovirasto, Ahvenanmaan paikallishallinto ja harrastajat
          ovat julkaisseet 3D-malleja arkeologisista- ja
          rakennusperintökohteista <a href="https://sketchfab.com">Sketchfab</a>
          -sivustolla mutta niitä on vaikea löytää ja listata. Lisäksi ne eivät
          linkity helposti Museoviraston ja Ahvenanmaan paikallishallinnon
          rekistereihin tai niistä koostettuihin avoimiin
          paikkatietoaineistoihin joten malleja ei saa mitenkään helposti
          kartalle. Tämä tietokanta yrittää korjata tämän ongelman.
        </p>

        <p>
          Tässä tietokannassa Sketchfab-palvelussa oleva 3D-malli linkitetään
          Museoviraston ja Ahvenanmaan paikallishallinnon rekisterien kohteisiin
          ja sijaintiin kartalla. Tällöin tämän linkityksen avulla pystyy
          vastaamaan seuraaviin kysymyksiin:
        </p>
        <ol>
          <li>
            Onko rekisterin kohteella julkisesti saatavilla olevia 3D-malleja?
          </li>
          <li>
            Mitä rekisterin kohdetta Sketchfabissa oleva 3D-malli esittää?
          </li>
          <li>Missä sijainnissa kartalla 3D-mallin esittämä kohde on?</li>
        </ol>

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

        <h2 id="listaus">Aineston listaus</h2>
        <p>
          Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot
          löytyvät suoraan tietokannasta. Kohteen nimi on linkki suoraan
          Museoviraston ja Ahvenanmaan paikallishallinnon rekisteriin. Mallin
          nimi on linkki 3D-malliin{" "}
          <a href="https://sketchfab.com" target="_blank">
            Sketchfab
          </a>
          -sivustolla.
        </p>
        <p>
          Tämän aineston näkee kartalla{" "}
          <a href="https://muinaismuistot.info" target="_blank">
            muinaismuistot.info
          </a>{" "}
          -sivustolta.
        </p>
        <ModelsTable models={models} />
      </div>
    </>
  );
};
