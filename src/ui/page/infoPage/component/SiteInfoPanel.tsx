import React from "react"
import { Accordion } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"

export const SiteInfoPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Accordion.Item eventKey="info.siteInfo.title">
      <Accordion.Header as="div">{t(`info.siteInfo.title`)}</Accordion.Header>
      <Accordion.Body>
        <p>{t(`info.siteInfo.registerInfo`)}:</p>

        <h6>{t(`common.organization.Museovirasto`)}</h6>
        <ul>
          <li>
            <a
              href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
              target="_blank"
            >
              {t(`data.register.name.Muinaisjäännösrekisteri`)}
            </a>
          </li>
          <li>
            <a
              href="https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_default.aspx"
              target="_blank"
            >
              {t(`data.register.name.Rakennusperintörekisteri`)}
            </a>
          </li>
          <li>
            <a
              href="https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"
              target="_blank"
            >
              {t(`data.register.name.Maailmanperintökohteet`)}
            </a>
          </li>
          <li>
            <a href="http://www.rky.fi/" target="_blank">
              {t(
                `data.register.name.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
              )}
            </a>
          </li>
          <li>
            <a
              href="https://www.kyppi.fi/palveluikkuna/VARKL/asp/v_default.aspx"
              target="_blank"
            >
              {t(`data.register.name.vark`)}
            </a>
          </li>
        </ul>

        <h6>{t(`common.organization.Ahvenanmaan paikallishallinto`)}</h6>
        <ul>
          <li>
            <a
              href="https://hub.arcgis.com/datasets/aland::fornminnen-1/"
              target="_blank"
            >
              {t(`data.register.name.Ahvenanmaan muinaisjäännösrekisteri`)}
            </a>
          </li>
          <li>
            <a
              href="https://hub.arcgis.com/datasets/aland::maritimt-kulturarv-vrak-1/"
              target="_blank"
            >
              {t(
                `data.register.name.Ahvenanmaan merellinen kulttuuriperintörekisteri`
              )}
            </a>
          </li>
        </ul>

        <h6>{t(`common.organization.Geologian tutkimuskeskus`)}</h6>
        <ul>
          <li>
            <a
              href="https://tupa.gtk.fi/paikkatieto/meta/ancient_shorelines.html"
              target="_blank"
            >
              {t(`data.register.name.muinaisrannat`)}
            </a>
          </li>
        </ul>

        <h6>{t(`common.organization.Helsingin kaupunki`)}</h6>
        <ul>
          <li>
            <a
              href="https://hri.fi/data/fi/dataset/helsingin-ensimmaisen-maailmansodan-aikaiset-maalinnoitukset"
              target="_blank"
            >
              {t(`data.register.name.maalinnoitus`)}
            </a>
          </li>
        </ul>

        <h6>{t(`common.organization.viabundus`)}</h6>
        <ul>
          <li>
            <a
              href="https://www.landesgeschichte.uni-goettingen.de/handelsstrassen/info.php?lang=fin"
              target="_blank"
            >
              {t(`data.register.name.viabundus`)}
            </a>
          </li>
        </ul>

        <p>{t(`info.siteInfo.info1`)}</p>

        <p>
          <Trans i18nKey="info.siteInfo.info2" components={{ i: <i /> }} />
        </p>

        <h6>
          <Trans
            i18nKey="data.register.nameWithLink.3Dmodels"
            components={{ a: <a /> }}
          />
        </h6>
        <p>
          <Trans
            i18nKey="info.siteInfo.3DModelsInfo"
            components={{ a: <a /> }}
          />
        </p>

        <h6>{t(`info.siteInfo.positioningTitle`)}</h6>
        <p>
          <Trans
            i18nKey="info.siteInfo.positioningInfo"
            components={{ i: <i /> }}
          />
        </p>

        <h6>{t(`info.siteInfo.searchTitle`)}</h6>
        <p>
          <Trans
            i18nKey="info.siteInfo.searchInfo"
            components={{ i: <i />, img: <img /> }}
          />
        </p>

        <h6>{t(`info.siteInfo.settingsTitle`)}</h6>
        <p>
          <Trans
            i18nKey="info.siteInfo.settingsInfo"
            components={{ i: <i /> }}
          />
        </p>

        <h6>{t(`info.siteInfo.feedbackTitle`)}</h6>
        <p>
          <Trans
            i18nKey="info.siteInfo.feedbackInfo"
            components={{ a: <a /> }}
          />
        </p>

        <h6>{t(`info.siteInfo.developersTitle`)}</h6>
        <p>
          <Trans
            i18nKey="info.siteInfo.developersInfo"
            components={{ br: <br /> }}
          />
        </p>
      </Accordion.Body>
    </Accordion.Item>
  )
}
