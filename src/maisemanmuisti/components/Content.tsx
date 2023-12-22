import React, { useEffect, useState } from "react"
import { TableOfContent } from "./TableOfContent"
import { DatabaseStructure } from "./DatabaseStructure"
import { Download } from "./Download"
import { FeatureTable } from "./FeatureTable"
import { DatabaseIntro } from "./DatabaseIntro"
import { MaisemanMuistiFeatureProperties } from "../../common/maisemanMuisti.types"
import { GeoJSONFeature, GeoJSONResponse } from "../../common/geojson.types"

export const Content: React.FC = () => {
  const [features, setFeatures] = useState<
    Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
  >([])

  useEffect(() => {
    fetch("maisemanmuisti.json")
      .then((response) => response.json())
      .then((data) => data as GeoJSONResponse<MaisemanMuistiFeatureProperties>)
      .then((data) => setFeatures(data.features))
  }, [])

  return (
    <>
      <div className="jumbotron">
        <div className="container">
          <h1>Paikkatietoaineisto</h1>
          <h2>
            Maiseman muisti - Valtakunnallisesti merkittävät muinaisjäännökset
          </h2>

          <p>
            Tälle sivulle on koostettu Museoviraston vuonna 2001 julkaiseman
            kirjan perusteella paikkatietoaineisto, joka mahdollistaa kohteiden
            näyttämisen karttasovelluksissa.
          </p>

          <p>
            <a
              href="/#museovirastoLayer=none&zoom=3"
              target="_blank"
              className="btn btn-primary btn-lg active"
              role="button"
            >
              Näytä kartalla
            </a>
          </p>
        </div>
      </div>
      <div className="container">
        <div>
          <div className="row">
            <div className="col-md-3">
              <img src="images/maiseman-muisti-kansi.jpg" />
            </div>
            <div className="col-md-9">
              <p>
                <b>
                  Maiseman muisti - Valtakunnallisesti merkittävät
                  muinaisjäännökset
                </b>
              </p>
              <p>Vastaava toimittaja: Paula Purhonen</p>
              <p>Toimittajat: Pirjo Hamari ja Helena Ranta</p>
              <p>
                Julkaisija: Museovirasto, arkeologian osasto, PL 913, 00101
                Helsinki
              </p>
              <p>
                Kansikuva: Karjaan Junkarsborgin keskiaikainen linnoitus. Kuva
                Museovirasto/Jukka Moisanen
              </p>
              <p>ISBN 951-616-071-9</p>
              <p>Vammalan Kirjapaino Oy</p>
              <p>2001</p>
            </div>
          </div>
        </div>
        <TableOfContent />
        <DatabaseIntro />

        <h2 id="lisenssit">Lisenssit</h2>
        <p>
          Kirjan sisältö on Museoviraston ja sen tekijöiden tekijänoikeuden
          alaista materiaalia. Tällä sivulla lainataan kirja sisällöstä
          kohdeluettelo (205 kpl), kohteen maakunta ja kohteiden nimet.
        </p>
        <p>
          Kohteiden rekisteritunnus{" "}
          <a
            href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
            target="_blank"
          >
            Muinaisjäännösrekisterissä
          </a>
          , rekisterinimi, koordinaatit, kunta, tyyppi, alatyyppi ja ajoitus
          ovat Museoviraston{" "}
          <a href="https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot">
            avoimesta paikkatietoaineistosta
          </a>{" "}
          (julkaistu{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/deed.fi">
            Creative Commons CC By 4.0
          </a>{" "}
          -lisenssillä).
        </p>

        <DatabaseStructure />
        <Download />

        <FeatureTable features={features} />
      </div>
    </>
  )
}
