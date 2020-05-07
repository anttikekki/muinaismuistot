import * as React from "react";
import { Panel } from "../../../component/Panel";

export const DataAndLicencesPanel: React.FC = () => {
  return (
    <Panel title="Avoin data, lisenssit ja lähdekoodi">
      <p>
        Museoviraston rekistereistä tietoa haetaan{" "}
        <a href="https://www.avoindata.fi/data/fi/dataset/museoviraston-kulttuuriymparistoaineistot-suojellut-kohteet-wms-palvelu">
          avoimen rajapinnan
        </a>{" "}
        kautta (
        <a href="https://creativecommons.org/licenses/by/4.0/">
          Creative Commons CC By 4.0 -lisenssillä
        </a>
        ).
      </p>

      <p>
        Ahvenanmaan maakuntahallinnon rekisteristö tietoa haetaan{" "}
        <a href="https://www.kartor.ax/datasets/fornminnen">
          avoimen rajapinnan
        </a>{" "}
        kautta (
        <a href="https://creativecommons.org/licenses/by/4.0/">
          Creative Commons CC By 4.0 -lisenssillä
        </a>
        ).
      </p>

      <p>
        Taustakarttana on{" "}
        <a href="https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/asiantuntevalle-kayttajalle/kartta-ja-paikkatietojen-rajapintapalvelut-17">
          Maanmittauslaitoksen
        </a>{" "}
        tausta-, ortokuva- ja peruskartta (
        <a href="https://www.maanmittauslaitos.fi/avoindata-lisenssi-cc40">
          {" "}
          Creative Commons Nimeä 4.0 Kansainvälinen -lisenssillä
        </a>
        ).
      </p>

      <p>
        3D-mallit ovat avoimesta <a href="./3d/">tietokannasta</a>, joka listaa
        harrastajien sekä virallisen toimijoiden (museot, Museovirasto,
        Ahvenanmaan paikallioshallinto) tekemiä 3D-mallinnuksia. Mallien
        lisenssit on listattu tietokannassa mallikohtaisesti.
      </p>

      <p>
        Tämän sivuston tekninen toteutus on{" "}
        <a href="https://github.com/anttikekki/muinaismuistot">
          avointa lähdekoodia
        </a>
        , lisenssinä on{" "}
        <a href="https://github.com/anttikekki/muinaismuistot/blob/master/LICENSE">
          MIT
        </a>
        .
      </p>
    </Panel>
  );
};
