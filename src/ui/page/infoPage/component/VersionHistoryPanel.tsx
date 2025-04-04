import React from "react"
import { Panel } from "../../../component/Panel"

export const VersionHistoryPanel: React.FC = () => {
  return (
    <Panel title="Versiohistoria">
      <h6>Huhtikuu 2025</h6>
      <p>
        Lisätty Maanmittauslaitoksen{" "}
        <a
          href="https://www.maanmittauslaitos.fi/ajankohtaista/yli-30-000-vanhaa-karttaa-jopa-150-vuoden-takaa-nyt-paikkatietona"
          target="_blank"
        >
          vanhoja karttoja
        </a>
        .
      </p>

      <h6>Tammikuu 2024</h6>
      <p>
        Lisätty Museoviraston Muu kulttuuperintökohde -karttataso pisteille ja
        alueille. Nämä sisältyivät vanhalla karttapalvelimella Kiinteät
        muinaisjäännökset -karttatasolle mutta uudess palvelimessa ne ovat
        erillinen taso.
      </p>

      <h6>Joulukuu 2023</h6>
      <p>
        Vaihdettu Museoviraston karttapalvelin suljetusta ArcGIS{" "}
        <a href="https://kartta.nba.fi" target="_blank">
          kartta.nba.fi
        </a>{" "}
        palvelimesta uuteen{" "}
        <a href="https://geoserver.museovirasto.fi/geoserver" target="_blank">
          geoserver.museovirasto.fi
        </a>{" "}
        palvelimeen. Kiinteiden muinaisjäännösten filtteröinti kartalla on yhä
        rikki.
      </p>

      <h6>Huhtikuu 2022</h6>
      <p>Korjattu Ahvenanmaan aineistojen päivityspäivämäärien haku.</p>
      <p>
        Lisätty{" "}
        <a
          href="https://en.wikipedia.org/wiki/Progressive_web_application"
          target="_blank"
        >
          Progressive web application
        </a>{" "}
        -tuki. Nyt sivustoon voi lisätä pikakuvakkeen älylaitteen työpöydälle,
        josta aukeutuvassa versiossa ei näy selaimen osoitepalkkia.
      </p>

      <h6>Maaliskuu 2021</h6>
      <p>
        Lisätty Helsingin kaupungin{" "}
        <a
          href="https://hri.fi/data/fi/dataset/helsingin-ensimmaisen-maailmansodan-aikaiset-maalinnoitukset"
          target="_blank"
        >
          Helsingin ensimmäisen maailmansodan aikaiset maalinnoitukset
        </a>
        -aineisto karttatasona.
      </p>

      <h6>Helmikuu 2021</h6>
      <p>
        Lisätty{" "}
        <a href="https://www.gtk.fi/" target="_blank">
          Geologian tutkimuskeskuksen
        </a>{" "}
        <a
          href="https://tupa.gtk.fi/paikkatieto/meta/ancient_shorelines.html"
          target="_blank"
        >
          Muinaisrannat
        </a>
        -aineisto karttatasona.
      </p>

      <h6>Tammikuu 2021</h6>
      <p>
        Lisätty käännökset ruotsin kielelle (kiitos Jenni Lucenius ja Mikko
        Helminen!).
      </p>
      <p>Hakutuloksissa saa nyt kohteen tarkemmat tiedot auki suoraan.</p>
      <p>
        Kiinteiden muinaisjäännösten tyyppi ja alatyyppi ovat nyt linkkejä{" "}
        <a href="http://akp.nba.fi" target="_blank">
          Arkeologisen kulttuuriperinnön opas
        </a>{" "}
        -sivustolle.
      </p>
      <p>Kokoruudun tila.</p>

      <h6>Joulukuu 2020</h6>
      <p>
        Lisätty Ahvenanmaan muinaisjäännösrekisterin kohteisiin tyyppi, ajoitus
        ja alakohteiden lukumäärä.
      </p>
      <p>
        Haku toimii nyt myös Ahvenanmaan muinaisjäännösrekisterin kohteen
        tunnuksella (esim. Sa 14.1).
      </p>

      <h6>Marraskuu 2020</h6>
      <p>
        Lisätty{" "}
        <a href="./maisemanmuisti/" target="_blank">
          Maiseman muisti - Valtakunnallisesti merkittävät muinaisjäännökset
        </a>{" "}
        -kirjan paikkatietoaineisto kartalle{" "}
        <img src="images/maiseman-muisti.png" /> korostuksella.
      </p>
      <p>
        Karttatasojen näkyvyyksien asetukset päivitetään nyt selaimen
        osoitepalkkiin jolloin sivun lataaminen uudelleen palauttaa samat
        asetukset.
      </p>
      <p>
        Hakukenttä hyväksyy nyt myös kohteen tunnuksen Museoviraston
        rekistereissä.
      </p>

      <h6>Toukokuu 2020</h6>
      <p>
        Päivitetty Museoviraston{" "}
        <a
          href="http://kartta.nba.fi/arcgis/rest/services/WMS/MV_KulttuuriymparistoSuojellut/MapServer"
          target="_blank"
        >
          paikkatietoaineiston
        </a>{" "}
        WMS-karttatasojen nimet koska niistä poistuivat ääkköset.
      </p>

      <h6>Huhtikuu 2020</h6>
      <p>
        Lisätty 3D-mallien{" "}
        <a href="./3d/" target="_blank">
          tietokanta
        </a>{" "}
        ja karttaan <img src="images/3d_malli_circle.png" />
        <img src="images/3d_malli_square.png" /> korostus kohteille, joille
        löytyy 3D-malleja.
      </p>

      <h6>Helmikuu 2020</h6>
      <p>
        Lisätty kartta-aineistojen viimeisin päivitysaika näkyviin "Lisätietoja
        sivustosta" -sivulle.
      </p>
      <p>Paikannus päivittää nyt automaattisesti omaa sijaintia kartalla.</p>

      <h6>Elokuu 2019</h6>
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

      <h6>Heinäkuu 2019</h6>
      <p>
        Korjattu Museoviraston muinaisjäännösrekisterin pisteiden filtteröinti
        ajoituksen ja tyypin perusteella.
      </p>

      <h6>Joulukuu 2018</h6>
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
        Siirrytty käyttämään Museoviraston uutta{" "}
        <a href="https://www.avoindata.fi/data/fi/dataset/museoviraston-kulttuuriymparistoaineistot-suojellut-kohteet-wms-palvelu">
          karttapalvelua
        </a>
        , jonka myötä saatiin käyttöön ruskeat "Muu kulttuuriperintökohde"
        -pisteet kartalle.
      </p>

      <h6>Marraskuu 2017</h6>
      <p>
        Lisätty kartalle Ahvenanmaan maakuntahallinnon{" "}
        <a href="http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret">
          muinaijäännösten rekisteri
        </a>
        .
      </p>

      <h6>Lokakuu 2015</h6>
      <p>Ensimmäinen versio julkaistu.</p>
    </Panel>
  )
}
