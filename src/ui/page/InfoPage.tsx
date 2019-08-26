import * as React from "react";

interface Props {
  visible: boolean;
  hidePage: () => void;
}

export const InfoPage: React.FC<Props> = ({ visible, hidePage }) => {
  return (
    <div
      id="infoPage"
      className={`container page ${
        visible ? "page-right-visible" : "page-right-hidden"
      }`}
    >
      <div className="row pageHeader">
        <div className="col-xs-3">
          <button
            className="btn btn-primary btn-sm"
            id="hide-infoPage-button"
            onClick={hidePage}
          >
            <span className="glyphicon glyphicon-remove" aria-hidden="true" />{" "}
            Sulje
          </button>
        </div>
        <div className="col-xs-9">
          <span className="pageHeaderText">Ohjeet</span>
        </div>
      </div>

      <div className="pageContent">
        <div className="panel panel-default">
          <div className="panel-heading">Tietoa sivustosta</div>
          <div className="panel-body">
            <p>Tällä sivustolla näet kartalla seuraavien rekisterien tiedot:</p>

            <h5>Museovirasto</h5>
            <ul>
              <li>
                <a href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx">
                  Muinaisjäännösrekisteri
                </a>
              </li>
              <li>
                <a href="https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_default.aspx">
                  Rakennusperintörekisteri
                </a>
              </li>
              <li>
                <a href="https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa">
                  Maailmanperintökohteet
                </a>
              </li>
              <li>
                <a href="http://www.rky.fi/">
                  Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt
                </a>
              </li>
            </ul>

            <h5>Ahvenamaan paikallishallinto</h5>
            <ul>
              <li>
                <a href="http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret">
                  Muinaisjäännösrekisteri
                </a>
              </li>
            </ul>

            <p>
              Kaikki näytettävät kohteet ovat avointa dataa ja haettu rekisterin
              ylläpitäjän tarjoamasta karttapalvelusta.
            </p>

            <p>
              Kohteista saa lisätietoikkunan näkyviin klikkaamalla kohdetta
              kartalla. Tästä näkymästä on myös linkki kohteen lisätietoihin
              rekisterin ylläpitäjän sivustolla. Kohteen otsikon vieressä
              olevasta kuvakkeesta (
              <span className="glyphicon glyphicon-link" aria-hidden="true" />)
              saa talteen pysyvän linkin kohteen sijaintiin kartalla.
            </p>

            <h5>Paikannus</h5>
            <p>
              Kartta keskitetään oletuksena nykyiseen sijaintiisi jos annat
              selaimelle luvan luovuttaa se tieto. Keskityksen nykyiseen
              sijaintiin voi suorittaa myös myöhemmin{" "}
              <span
                className="glyphicon glyphicon-screenshot"
                aria-hidden="true"
              />{" "}
              painikkeesta.
            </p>

            <h5>Haku</h5>
            <p>
              Museoviraston rekisterien kohteita pystyy hakemaan nimen
              perusteella hakunäkymässä (
              <span className="glyphicon glyphicon-search" aria-hidden="true" />
              ). Hakutuloksen klikkaaminen keskittää kartan kohteeseen ja lisää
              siihen paikkamerkin <img src="images/map-pin-small.png" />.
            </p>

            <h5>Asetukset</h5>
            <p>
              Pohjakartan voi vaihtaa taustakartan ja maastokartan välillä
              asetuksista (
              <span className="glyphicon glyphicon-cog" aria-hidden="true" />
              ). Samasta näkymästä voi piilottaa Museoviraston rekisterien
              kohteita tyypin ja muinaisjäännöksiä myös ajoituksen mukaan jos
              haluaa tarkastella esimerkiksi pelkästään muinaisjäännöksiä
              rautakaudelta.
            </p>

            <p>
              Palautetta sivustosta otetaan mielellään vastaan osoitteeseen{" "}
              <a href="mailto:antti.kekki@gmail.com">antti.kekki@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="panel panel-default">
          <div className="panel-heading">Karttasymbolit</div>
          <div className="panel-body">
            <div>
              <h5>Museoviraston muinaisjäännösrekisteri</h5>

              <p>
                <img src="images/muinaisjaannos_kohde.png" />
                <span>Kiinteä muinaisjäännös</span>
              </p>

              <p>
                <img src="images/muinaisjaannos_alue.png" />
                <span>Kiinteä muinaisjäännös (alue)</span>
              </p>

              <p>
                <img src="images/muu_kulttuuriperintokohde_kohde.png" />
                <span>Muu kulttuuriperintökohde</span>
              </p>

              <p>
                <img src="images/muu-kulttuuriperintokohde-alue.png" />
                <span>Muu kulttuuriperintökohde (alue)</span>
              </p>
            </div>

            <br />

            <div>
              <h5>Ahvenanmaan muinaisjäännösrekisteri</h5>

              <img src="images/ahvenanmaa_muinaisjaannos.png" />
              <span>Kohde</span>
            </div>

            <br />

            <div>
              <h5>Rakennusperintörekisteri</h5>

              <img src="images/rakennusperintorekisteri_rakennus.png" />
              <span>Rakennus</span>

              <img src="images/rakennusperintorekisteri_alue.png" />
              <span>Alue</span>
            </div>

            <br />

            <div>
              <h5>Maailmanperintökohteet</h5>

              <img src="images/maailmanperinto_piste.png" />
              <span>Kohde</span>

              <img src="images/maailmanperinto_alue.png" />
              <span>Alue</span>

              <img src="images/maailmanperinto_suoja_alue.png" />
              <span>Suoja-alue</span>
            </div>

            <br />

            <div>
              <h5>
                Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt
              </h5>

              <img src="images/rky_piste.png" />
              <span>Kohde</span>

              <img src="images/rky_viiva.png" />
              <span>Viiva (esim. tie)</span>

              <img src="images/rky_alue.png" />
              <span>Alue</span>
            </div>
          </div>
        </div>

        <div className="panel panel-default">
          <div className="panel-heading">Tekninen toteutus</div>
          <div className="panel-body">
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
          </div>
        </div>

        <div className="panel panel-default">
          <div className="panel-heading">Muutoshistoria</div>
          <div className="panel-body">
            <h5>Elokuu 2019</h5>
            <p>
              Siirrytty käyttämään Ahvenanmaan maakuntahallinnon uutta{" "}
              <a href="https://www.kartor.ax/datasets/fornminnen">kartor.ax</a>{" "}
              karttapalvelua. Samalla kohteiden haku alkoi toimimaan myös
              Ahvenanmaan kohteille.
            </p>

            <br />

            <h5>Heinäkuu 2019</h5>
            <p>
              Korjattu Museoviraston muinaisjäännösrekisterin pisteiden
              filtteröinti ajoituksen ja tyypin perusteella.
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
          </div>
        </div>
      </div>
    </div>
  );
};
