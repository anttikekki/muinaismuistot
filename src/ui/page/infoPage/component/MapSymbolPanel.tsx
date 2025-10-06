import React from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"

export const MapSymbolPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Accordion.Item eventKey="info.symbols">
      <Accordion.Header as="div">{t(`info.symbols`)}</Accordion.Header>
      <Accordion.Body>
        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/rky_piste.png" />
            <span>{t(`common.features.Kohde`)}</span>
          </div>

          <div className="ms-3">
            <img className="feature-icon" src="images/rky_viiva.png" />
            <span>{t(`common.features.Viiva`)}</span>
          </div>

          <div className="ms-3">
            <img className="feature-icon" src="images/rky_alue.png" />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Maailmanperintökohteet`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/maailmanperinto_piste.png"
            />
            <span>{t(`common.features.Kohde`)}</span>
          </div>

          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/maailmanperinto_alue.png"
            />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Rakennusperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/rakennusperintorekisteri_rakennus.png"
            />
            <span>{t(`common.features.Rakennus`)}</span>
          </div>

          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/rakennusperintorekisteri_alue.png"
            />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/muinaisjaannos_kohde.png"
            />
            <span>{t(`data.featureType.Kiinteä muinaisjäännös`)}</span>
          </div>

          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/muinaisjaannos_alue.png"
            />
            <span>{t(`data.featureType.Kiinteä muinaisjäännös (alue)`)}</span>
          </div>

          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/muu_kulttuuriperintokohde_kohde.png"
            />
            <span>{t(`data.featureType.Muu kulttuuriperintökohde`)}</span>
          </div>

          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/muu-kulttuuriperintokohde-alue.png"
            />
            <span>
              {t(`data.featureType.Muu kulttuuriperintökohde (alue)`)}
            </span>
          </div>

          <div className="ms-3">
            <img className="feature-icon" src="images/loytopaikka_piste.png" />
            <span>{t(`data.featureType.löytöpaikkaPiste`)}</span>
          </div>

          <div className="ms-3">
            <img className="feature-icon" src="images/loytopaikka_alue.png" />
            <span>{t(`data.featureType.löytöpaikkaAlue`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.vark`}
            components={{ a: <a /> }}
          />
        </h6>

        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/vark_piste.png" />
            <span>{t(`common.features.keskipisteet`)}</span>
          </div>

          <div className="ms-3">
            <img className="feature-icon" src="images/vark_alue.png" />
            <span>{t(`common.features.aluerajaukset`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/ahvenanmaa_muinaisjaannos.png"
            />
            <span>{t(`common.features.Kohde`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan merellinen kulttuuriperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/ahvenanmaa_hylky.png" />
            <span>{t(`common.features.Kohde`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.maalinnoitus`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/maalinnoitus-asema.png" />
            <span>{t(`data.helsinki.feature.asema`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/maalinnoitus-luola.png" />
            <span>{t(`data.helsinki.feature.luola`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/maalinnoitus-tykkitie.png"
            />
            <span>{t(`data.helsinki.feature.tykkitie`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/maalinnoitus-tykkipatteri.png"
            />
            <span>{t(`data.helsinki.feature.tykkipatteri`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/maalinnoitus-puolustusaseman-raja.png"
            />
            <span>{t(`data.helsinki.feature.puolustusasemanRaja`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/maalinnoitus-tukikohdan-raja.png"
            />
            <span>{t(`data.helsinki.feature.tukikohdanRaja`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.viabundus`}
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-kaupunki.png" />
            <span>{t(`data.viabundus.place.town`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/viabundus-asuttu-paikka.png"
            />
            <span>{t(`data.viabundus.place.settlement`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-silta.png" />
            <span>{t(`data.viabundus.place.bridge`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-satama.png" />
            <span>{t(`data.viabundus.place.harbour`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-lossi.png" />
            <span>{t(`data.viabundus.place.ferry`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-tulli.png" />
            <span>{t(`data.viabundus.place.toll`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-maantie.png" />
            <span>{t(`data.viabundus.road.land`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/viabundus-maantie-epavarma.png"
            />
            <span>{t(`data.viabundus.road.landUncertain`)}</span>
          </div>
          <div className="ms-3">
            <img className="feature-icon" src="images/viabundus-talvitie.png" />
            <span>{t(`data.viabundus.road.winter`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/viabundus-vesivayla.png"
            />
            <span>{t(`data.viabundus.road.coast`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/viabundus-vesivayla-epavarma.png"
            />
            <span>{t(`data.viabundus.road.coastUncertain`)}</span>
          </div>
          <div className="ms-3">
            <img
              className="feature-icon"
              src="images/viabundus-kaupungin-rajat.png"
            />
            <span>{t(`data.viabundus.townOutline`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey="data.register.nameWithLink.3Dmodels"
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/3d_malli_circle.png" />
            <img className="feature-icon" src="images/3d_malli_square.png" />
            <span>{t(`common.features.3D-malli`)}</span>
          </div>
        </div>

        <h6>
          <Trans
            i18nKey="data.register.nameWithLink.maisemanMuisti"
            components={{ a: <a /> }}
          />
        </h6>
        <div className="mb-3">
          <div className="ms-3">
            <img className="feature-icon" src="images/maiseman-muisti.png" />
            <span>
              {t(
                `common.features.Valtakunnallisesti merkittävä muinaisjäännös`
              )}
            </span>
          </div>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  )
}
