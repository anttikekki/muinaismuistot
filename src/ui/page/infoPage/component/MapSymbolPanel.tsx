import * as React from "react"
import { Trans, useTranslation } from "react-i18next"
import { Panel } from "../../../component/Panel"

export const MapSymbolPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Panel title="Karttasymbolit">
      <div>
        <div>
          <h5>
            {t(
              `data.register.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
            )}
          </h5>

          <p>
            <img className="feature-icon" src="images/rky_piste.png" />
            <span>{t(`common.features.Kohde`)}</span>
          </p>

          <p>
            <img className="feature-icon" src="images/rky_viiva.png" />
            <span>{t(`common.features.Viiva`)}</span>
          </p>

          <p>
            <img className="feature-icon" src="images/rky_alue.png" />
            <span>{t(`common.features.Alue`)}</span>
          </p>
        </div>

        <br />

        <div>
          <h5>{t(`data.register.Maailmanperintökohteet`)}</h5>

          <p>
            <img
              className="feature-icon"
              src="images/maailmanperinto_piste.png"
            />
            <span>{t(`common.features.Kohde`)}</span>
          </p>

          <p>
            <img
              className="feature-icon"
              src="images/maailmanperinto_alue.png"
            />
            <span>{t(`common.features.Alue`)}</span>
          </p>
        </div>

        <br />

        <div>
          <h5>{t(`data.register.Rakennusperintörekisteri`)}</h5>

          <p>
            <img
              className="feature-icon"
              src="images/rakennusperintorekisteri_rakennus.png"
            />
            <span>{t(`common.features.Rakennus`)}</span>
          </p>

          <p>
            <img
              className="feature-icon"
              src="images/rakennusperintorekisteri_alue.png"
            />
            <span>{t(`common.features.Alue`)}</span>
          </p>
        </div>

        <br />

        <h5>{t(`data.register.Muinaisjäännösrekisteri`)}</h5>

        <p>
          <img className="feature-icon" src="images/muinaisjaannos_kohde.png" />
          <span>{t(`data.featureType.Kiinteä muinaisjäännös`)}</span>
        </p>

        <p>
          <img className="feature-icon" src="images/muinaisjaannos_alue.png" />
          <span>{t(`data.featureType.Kiinteä muinaisjäännös (alue)`)}</span>
        </p>

        <p>
          <img
            className="feature-icon"
            src="images/muu_kulttuuriperintokohde_kohde.png"
          />
          <span>{t(`data.featureType.Muu kulttuuriperintökohde`)}</span>
        </p>

        <p>
          <img
            className="feature-icon"
            src="images/muu-kulttuuriperintokohde-alue.png"
          />
          <span>{t(`data.featureType.Muu kulttuuriperintökohde (alue)`)}</span>
        </p>
      </div>

      <br />

      <div>
        <h5>{t(`data.register.Ahvenamaan muinaisjäännösrekisteri`)}</h5>

        <p>
          <img
            className="feature-icon"
            src="images/ahvenanmaa_muinaisjaannos.png"
          />
          <span>{t(`common.features.Kohde`)}</span>
        </p>
      </div>

      <br />
      <div>
        <h5>
          {t(`data.register.Ahvenamaan merellinen kulttuuriperintörekisteri`)}
        </h5>

        <p>
          <img className="feature-icon" src="images/ahvenanmaa_hylky.png" />
          <span>{t(`common.features.Kohde`)}</span>
        </p>
      </div>

      <br />

      <div>
        <h5>
          <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
        </h5>

        <p>
          <img className="feature-icon" src="images/3d_malli_circle.png" />
          <img className="feature-icon" src="images/3d_malli_square.png" />
          <span>{t(`common.features.3D-malli`)}</span>
        </p>
      </div>

      <br />

      <div>
        <h5>
          <Trans
            i18nKey="data.register.maisemanMuisti"
            components={{ a: <a /> }}
          />
        </h5>

        <p>
          <img className="feature-icon" src="images/maiseman-muisti.png" />
          <span>
            {t(`common.features.Valtakunnallisesti merkittävä muinaisjäännös`)}
          </span>
        </p>
      </div>
    </Panel>
  )
}
