import React from "react"
import { Trans, useTranslation } from "react-i18next"
import { Panel } from "../../../component/Panel"

export const MapSymbolPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`info.symbols`)}>
      <div>
        <div>
          <h5>
            {t(
              `data.register.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
            )}
          </h5>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img className="feature-icon" src="images/rky_piste.png" />
            <span>{t(`common.features.Kohde`)}</span>
          </div>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img className="feature-icon" src="images/rky_viiva.png" />
            <span>{t(`common.features.Viiva`)}</span>
          </div>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img className="feature-icon" src="images/rky_alue.png" />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <div>
          <h5>{t(`data.register.Maailmanperintökohteet`)}</h5>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img
              className="feature-icon"
              src="images/maailmanperinto_piste.png"
            />
            <span>{t(`common.features.Kohde`)}</span>
          </div>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img
              className="feature-icon"
              src="images/maailmanperinto_alue.png"
            />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <div>
          <h5>{t(`data.register.Rakennusperintörekisteri`)}</h5>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img
              className="feature-icon"
              src="images/rakennusperintorekisteri_rakennus.png"
            />
            <span>{t(`common.features.Rakennus`)}</span>
          </div>

          <div className="checkbox sub-layer-select-checkbox-container">
            <img
              className="feature-icon"
              src="images/rakennusperintorekisteri_alue.png"
            />
            <span>{t(`common.features.Alue`)}</span>
          </div>
        </div>

        <h5>{t(`data.register.Muinaisjäännösrekisteri`)}</h5>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img className="feature-icon" src="images/muinaisjaannos_kohde.png" />
          <span>{t(`data.featureType.Kiinteä muinaisjäännös`)}</span>
        </div>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img className="feature-icon" src="images/muinaisjaannos_alue.png" />
          <span>{t(`data.featureType.Kiinteä muinaisjäännös (alue)`)}</span>
        </div>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img
            className="feature-icon"
            src="images/muu_kulttuuriperintokohde_kohde.png"
          />
          <span>{t(`data.featureType.Muu kulttuuriperintökohde`)}</span>
        </div>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img
            className="feature-icon"
            src="images/muu-kulttuuriperintokohde-alue.png"
          />
          <span>{t(`data.featureType.Muu kulttuuriperintökohde (alue)`)}</span>
        </div>
      </div>

      <div>
        <h5>{t(`data.register.Ahvenanmaan muinaisjäännösrekisteri`)}</h5>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img
            className="feature-icon"
            src="images/ahvenanmaa_muinaisjaannos.png"
          />
          <span>{t(`common.features.Kohde`)}</span>
        </div>
      </div>

      <div>
        <h5>
          {t(`data.register.Ahvenanmaan merellinen kulttuuriperintörekisteri`)}
        </h5>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img className="feature-icon" src="images/ahvenanmaa_hylky.png" />
          <span>{t(`common.features.Kohde`)}</span>
        </div>
      </div>

      <div>
        <h5>
          <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
        </h5>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img className="feature-icon" src="images/3d_malli_circle.png" />
          <img className="feature-icon" src="images/3d_malli_square.png" />
          <span>{t(`common.features.3D-malli`)}</span>
        </div>
      </div>

      <div>
        <h5>
          <Trans
            i18nKey="data.register.maisemanMuisti"
            components={{ a: <a /> }}
          />
        </h5>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img className="feature-icon" src="images/maiseman-muisti.png" />
          <span>
            {t(`common.features.Valtakunnallisesti merkittävä muinaisjäännös`)}
          </span>
        </div>
      </div>
    </Panel>
  )
}
