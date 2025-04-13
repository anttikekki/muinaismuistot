import React from "react"
import { Trans, useTranslation } from "react-i18next"
import regexifyString from "regexify-string"
import { Panel } from "../../../component/Panel"

export const SiteInfoPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`info.siteInfo.title`)}>
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

      <p>{t(`info.siteInfo.info1`)}</p>

      <p>
        {regexifyString({
          pattern: /ICON/gm,
          decorator: () => {
            return <i className="bi bi-link-45deg" aria-hidden="true" />
          },
          input: t(`info.siteInfo.info2`)
        })}
      </p>

      <h6>
        <Trans
          i18nKey="data.register.nameWithLink.3Dmodels"
          components={{ a: <a /> }}
        />
      </h6>
      <p>
        <Trans i18nKey="info.siteInfo.3DModelsInfo" components={{ a: <a /> }} />
      </p>

      <h6>{t(`info.siteInfo.positioningTitle`)}</h6>
      <p>
        {regexifyString({
          pattern: /ICON/gm,
          decorator: (match) => {
            return (
              <span
                key={match}
                className="glyphicon glyphicon-screenshot"
                aria-hidden="true"
              />
            )
          },
          input: t(`info.siteInfo.positioningInfo`)
        })}
      </p>

      <h6>{t(`info.siteInfo.searchTitle`)}</h6>
      <p>
        {regexifyString({
          pattern: /SEARCH_ICON|PIN_ICON/gm,
          decorator: (match) => {
            if (match === "SEARCH_ICON") {
              return (
                <span
                  key={match}
                  className="glyphicon glyphicon-search"
                  aria-hidden="true"
                />
              )
            }
            if (match === "PIN_ICON") {
              return <img key={match} src="images/map-pin-small.png" />
            }
            return ""
          },
          input: t(`info.siteInfo.searchInfo`)
        })}
      </p>

      <h6>{t(`info.siteInfo.settingsTitle`)}</h6>
      <p>
        {regexifyString({
          pattern: /ICON/gm,
          decorator: (match) => {
            return (
              <span
                key={match}
                className="glyphicon glyphicon-cog"
                aria-hidden="true"
              />
            )
          },
          input: t(`info.siteInfo.settingsInfo`)
        })}
      </p>

      <h6>{t(`info.siteInfo.feedbackTitle`)}</h6>
      <p>
        <Trans i18nKey="info.siteInfo.feedbackInfo" components={{ a: <a /> }} />
      </p>

      <h6>{t(`info.siteInfo.developersTitle`)}</h6>
      <p>
        <Trans
          i18nKey="info.siteInfo.developersInfo"
          components={{ br: <br /> }}
        />
      </p>
    </Panel>
  )
}
