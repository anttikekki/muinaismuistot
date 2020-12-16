import * as React from "react"
import { useTranslation } from "react-i18next"

export enum PageVisibility {
  Visible = "Visible",
  Closing = "Closing",
  Hidden = "Hidden"
}

const LangSelection: React.FC<{ lang: string }> = ({ lang }) => {
  const { i18n } = useTranslation()
  return (
    <label
      className={`btn btn-default ${i18n.language === lang ? "active" : ""}`}
    >
      <input
        type="radio"
        name="selectedLanguage"
        checked={i18n.language === lang}
        onChange={() => i18n.changeLanguage(lang)}
      />
      FI
    </label>
  )
}

interface Props {
  title: string
  visibility: PageVisibility
  hidePage: () => void
}

export const Page: React.FC<Props> = ({
  title,
  visibility,
  hidePage,
  children
}) => {
  const { t, i18n } = useTranslation()
  let classes = ""
  switch (visibility) {
    case PageVisibility.Visible:
      classes = "page-right-visible"
      break
    case PageVisibility.Closing:
      classes = "page-right-closing"
      break
    case PageVisibility.Hidden:
      classes = "page-right-hidden"
      break
  }

  return (
    <div className={`container page ${classes}`}>
      {visibility !== PageVisibility.Hidden && (
        <div className="row pageHeader">
          <div className="col-xs-1 col-sm-1">
            <button className="btn btn-primary btn-sm" onClick={hidePage}>
              <span className="glyphicon glyphicon-remove" aria-hidden="true" />
              {t(`common.close`)}
            </button>
          </div>
          <div className="col-xs-8 col-sm-9" style={{ textAlign: "center" }}>
            <span className="pageHeaderText">{title}</span>
          </div>
          <div className="col-xs-3 col-sm-2" style={{ textAlign: "right" }}>
            <div className="btn-group" data-toggle="buttons">
              <LangSelection lang="fi" />
              <LangSelection lang="sv" />
            </div>
          </div>
        </div>
      )}

      {visibility !== PageVisibility.Hidden && (
        <div className="pageContent">{children}</div>
      )}
    </div>
  )
}
