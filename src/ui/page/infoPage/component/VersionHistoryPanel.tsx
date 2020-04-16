import * as React from "react";
import { Panel } from "../../../component/Panel";

export const VersionHistoryPanel: React.FC = () => {
  return (
    <Panel title="Tietoa sivustosta">
      <h5>Huhtikuu 2020</h5>
      <p>
        Lisätty 3D-mallien{" "}
        <a href="./3d/" target="_blank">
          tietokanta
        </a>{" "}
        ja karttaan <img src="images/3d_malli.png" /> korostus kohteille, joille
        löytyy 3D-malleja.
      </p>

      <br />
      <h5>Helmikuu 2020</h5>
      <p>
        Lisätty kartta-aineistojen viimeisin päivitysaika näkyviin "Lisätietoja
        sivustosta" -sivulle.
      </p>
      <p>Paikannus päivittää nyt automaattisesti omaa sijaintia kartalla.</p>

      <br />

      <h5>Elokuu 2019</h5>
      <p>
        Siirrytty käyttämään Ahvenanmaan maakuntahallinnon uutta{" "}
        <a href="https://www.kartor.ax/datasets/fornminnen">kartor.ax</a>{" "}
        karttapalvelua. Samalla kohteiden haku alkoi toimimaan myös Ahvenanmaan
        kohteille.
      </p>
      <p>
        Kartalle klikattujen kohteiden listassa näkyy nyt otsikossa kohteen
        nimi. Listassa voi nyt myös olla monta saman tyyppistä kohdetta.
      </p>

      <br />

      <h5>Heinäkuu 2019</h5>
      <p>
        Korjattu Museoviraston muinaisjäännösrekisterin pisteiden filtteröinti
        ajoituksen ja tyypin perusteella.
      </p>

      <br />

      <h5>Joulukuu 2018</h5>
      <p>
        Siirrytty käyttämään Maanmittauslaitoksen uutta{" "}
        <a href="https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/asiantuntevalle-kayttajalle/kartta-ja-paikkatietojen-rajapintapalvelut-17">
          karttapalvelua
        </a>
        , jonka myötä taustakartan ulkonäkö muuttui selkeämmäksi ja{" "}
        <a href="https://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/asiantuntevalle-kayttajalle/tuotekuvaukset/ortokuva">
          Ortokuvat
        </a>{" "}
        saatiin käyttöön.
      </p>
      <p>
        Siirrytty käyttämään Museoviraston uuta{" "}
        <a href="https://www.avoindata.fi/data/fi/dataset/museoviraston-kulttuuriymparistoaineistot-suojellut-kohteet-wms-palvelu">
          karttapalvelua
        </a>
        , jonka myötä saatiin käyttöön ruskeat "Muu kulttuuriperintökohde"
        -pisteet kartalle.
      </p>

      <br />

      <h5>Marraskuu 2017</h5>
      <p>
        Lisätty kartalle Ahvenanmaan maakuntahallinnon{" "}
        <a href="http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret">
          muinaijäännösten rekisteri
        </a>
        .
      </p>

      <br />

      <h5>Lokakuu 2015</h5>
      <p>Ensimmäinen versio julkaistu.</p>
    </Panel>
  );
};
