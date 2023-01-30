import React from "react"
import { Trans, useTranslation } from "react-i18next"
import regexifyString from "regexify-string"
import { Panel } from "../../../component/Panel"

export const SiteInfoPanel: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`info.siteInfo.title`)}>
      <p>{t(`info.siteInfo.registerInfo`)}:</p>

      <h5>{t(`common.organization.Museovirasto`)}</h5>
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

      <h5>{t(`common.organization.Ahvenanmaan paikallishallinto`)}</h5>
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

      <h5>{t(`common.organization.Geologian tutkimuskeskus`)}</h5>
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

      <h5>{t(`common.organization.Helsingin kaupunki`)}</h5>
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
          decorator: (match) => {
            return (
              <span
                key={match}
                className="glyphicon glyphicon-link"
                aria-hidden="true"
              />
            )
          },
          input: t(`info.siteInfo.info2`)
        })}
      </p>

      <h5>
        <Trans
          i18nKey="data.register.nameWithLink.3Dmodels"
          components={{ a: <a /> }}
        />
      </h5>
      <p>
        <Trans i18nKey="info.siteInfo.3DModelsInfo" components={{ a: <a /> }} />
      </p>

      <h5>{t(`info.siteInfo.positioningTitle`)}</h5>
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

      <h5>{t(`info.siteInfo.searchTitle`)}</h5>
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

      <h5>{t(`info.siteInfo.settingsTitle`)}</h5>
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

      <h5>{t(`info.siteInfo.feedbackTitle`)}</h5>
      <p>
        <Trans i18nKey="info.siteInfo.feedbackInfo" components={{ a: <a /> }} />
      </p>

      <h5>{t(`info.siteInfo.developersTitle`)}</h5>
      <p>
        <Trans
          i18nKey="info.siteInfo.developersInfo"
          components={{ br: <br /> }}
        />
      </p>
    </Panel>
  )
}
