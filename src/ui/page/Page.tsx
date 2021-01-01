import * as React from "react"
import { useTranslation } from "react-i18next"
import { Language } from "../../common/types"

export enum PageVisibility {
  Visible = "Visible",
  Closing = "Closing",
  Hidden = "Hidden"
}

const LangSelection: React.FC<{ lang: Language }> = ({ lang }) => {
  const { i18n } = useTranslation()
  const isSelectedLang = i18n.language === lang
  return (
    <label className={`btn btn-default ${isSelectedLang ? "active" : ""}`}>
      <input
        type="radio"
        name="selectedLanguage"
        checked={isSelectedLang}
        onChange={() => i18n.changeLanguage(lang)}
      />
      <b>{lang.toUpperCase()}</b>
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
  const { t } = useTranslation()
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
          <div className="col-xs-2 col-sm-2 col-md-2">
            <button className="btn btn-primary btn-sm" onClick={hidePage}>
              <span className="glyphicon glyphicon-remove" aria-hidden="true" />
              {t(`common.button.close`)}
            </button>
          </div>
          <div
            className="col-xs-6 col-sm-7 col-md-7"
            style={{ textAlign: "center" }}
          >
            <span className="pageHeaderText">{title}</span>
          </div>
          <div
            className="col-xs-4 col-sm-3 col-md-3"
            style={{ textAlign: "right" }}
          >
            <div className="btn-group" data-toggle="buttons">
              <LangSelection lang={Language.FI} />
              <LangSelection lang={Language.SV} />
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
