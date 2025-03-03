import i18n from "i18next"
import React, { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { initReactI18next } from "react-i18next"
import { ModelFeatureProperties } from "../../common/3dModels.types"
import { GeoJSONFeature, GeoJSONResponse } from "../../common/geojson.types"
import fiTranslations from "../../common/translations/fi.json"
import { getGeoJSONDataLatestUpdateDate } from "../../common/util/featureParser"
import { DatabaseIntro } from "./DatabaseIntro"
import { DatabaseStructure } from "./DatabaseStructure"
import { Download } from "./Download"
import { ModelsTable } from "./ModelsTable"
import { Registers } from "./Registers"
import { TableOfContent } from "./TableOfContent"

i18n.use(initReactI18next).init({
  resources: {
    fi: { translation: fiTranslations }
  },
  lng: "fi",
  fallbackLng: "fi",
  interpolation: {
    escapeValue: false
  }
})

export const Content: React.FC = () => {
  const [models, setModels] = useState<
    Array<GeoJSONFeature<ModelFeatureProperties>>
  >([])
  const [latestUpdateDate, setLatestUpdateDate] = useState<Date>()

  useEffect(() => {
    fetch("3d.json")
      .then((response) => response.json())
      .then((data) => data as GeoJSONResponse<ModelFeatureProperties>)
      .then((data) => setModels(data.features))
  }, [])

  useEffect(() => {
    setLatestUpdateDate(getGeoJSONDataLatestUpdateDate(models))
  }, [models])

  return (
    <>
      <div className="p-5 rounded-3 bg-body-secondary mb-5">
        <Container>
          <h1 className="text-body-emphasis">
            Kulttuuriperinnön 3D-mallien tietokanta
          </h1>

          <p className="lead">
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

          <p>
            <a
              href="/#zoom=5"
              target="_blank"
              className="btn btn-primary btn-lg active"
              role="button"
            >
              Näytä kartalla
            </a>
          </p>
        </Container>
      </div>
      <Container>
        <TableOfContent />
        <DatabaseIntro />
        <Registers />
        <DatabaseStructure />
        <Download />

        <h2 id="lisenssit">Lisenssit</h2>
        <p>
          Tekijä on määritellyt Sketchfab-palvelussa mallille käyttölisenssin.
          Tämä tieto on mukana tietokannassa.
        </p>
        <p>
          Itse tämä 3D-mallien tietokanta on{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/deed.fi">
            Creative Commons CC By 4.0
          </a>{" "}
          -lisenssillä.
        </p>
        <p>
          Kohteiden tunnus{" "}
          <a
            href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
            target="_blank"
          >
            Muinaisjäännösrekisterissä
          </a>
          , koordinaatit ja kunta ovat Museoviraston{" "}
          <a href="https://www.museovirasto.fi/fi/palvelut-ja-ohjeet/tietojarjestelmat/kulttuuriympariston-tietojarjestelmat/kulttuuriympaeristoen-paikkatietoaineistot">
            avoimesta paikkatietoaineistosta
          </a>{" "}
          (julkaistu{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/deed.fi">
            Creative Commons CC By 4.0
          </a>{" "}
          -lisenssillä)
        </p>

        <h2 id="yllapito">Ylläpito</h2>
        <p>
          Tätä tietokantaa ylläpitää Antti Kekki. Voit ilmoittaa uuden mallin
          tietokantaan lähettämällä sähköpostia osoitteeseen{" "}
          <a href="mailto:antti.kekki@gmail.com">antti.kekki@gmail.com</a>. Myös
          yhteydeotot ja kyselyt samaan osoitteeseen.
        </p>

        <ModelsTable models={models} />
      </Container>
    </>
  )
}
