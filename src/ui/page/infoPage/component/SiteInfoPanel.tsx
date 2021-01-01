import * as React from "react"
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
            {t(`data.register.Muinaisjäännösrekisteri`)}
          </a>
        </li>
        <li>
          <a
            href="https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_default.aspx"
            target="_blank"
          >
            {t(`data.register.Rakennusperintörekisteri`)}
          </a>
        </li>
        <li>
          <a
            href="https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa"
            target="_blank"
          >
            {t(`data.register.Maailmanperintökohteet`)}
          </a>
        </li>
        <li>
          <a href="http://www.rky.fi/" target="_blank">
            {t(
              `data.register.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`
            )}
          </a>
        </li>
      </ul>

      <h5>{t(`common.organization.Ahvenamaan paikallishallinto`)}</h5>
      <ul>
        <li>
          <a
            href="http://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/fornlamningsregistret"
            target="_blank"
          >
            {t(`data.register.Ahvenamaan muinaisjäännösrekisteri`)}
          </a>
        </li>
        <li>
          <a
            href="https://www.regeringen.ax/kulturarv/arkeologi-fornlamningar/marinarkeologi"
            target="_blank"
          >
            {t(`data.register.Ahvenamaan merellinen kulttuuriperintörekisteri`)}
          </a>
        </li>
      </ul>

      <p>{t(`info.siteInfo.info1`)}</p>

      <p>
        {regexifyString({
          pattern: /ICON/gm,
          decorator: (match) => {
            return (
              <span className="glyphicon glyphicon-link" aria-hidden="true" />
            )
          },
          input: t(`info.siteInfo.info2`)
        })}
      </p>

      <h5>
        <Trans i18nKey="data.register.3Dmodels" components={{ a: <a /> }} />
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
          pattern: /SEARCH_ICON|ALUE_ICONS/gm,
          decorator: (match) => {
            if (match === "SEARCH_ICON") {
              return (
                <span
                  className="glyphicon glyphicon-search"
                  aria-hidden="true"
                />
              )
            }
            if (match === "PIN_ICON") {
              return <img src="images/map-pin-small.png" />
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
              <span className="glyphicon glyphicon-cog" aria-hidden="true" />
            )
          },
          input: t(`info.siteInfo.settingsInfo`)
        })}
      </p>

      <h5>{t(`info.siteInfo.feedbackTitle`)}</h5>
      <p>
        <Trans i18nKey="info.siteInfo.feedbackInfo" components={{ a: <a /> }} />
      </p>
    </Panel>
  )
}
