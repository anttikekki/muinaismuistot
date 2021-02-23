import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Language } from "../../common/types"
import { changeLanguage } from "../../store/actionCreators"

export enum PageVisibility {
  Visible = "Visible",
  Closing = "Closing",
  Hidden = "Hidden"
}

interface LangSelectionProps {
  lang: Language
  onLanguageChange: (language: Language) => void
}

const LangSelection: React.FC<LangSelectionProps> = ({
  lang,
  onLanguageChange
}) => {
  const { i18n } = useTranslation()
  const isSelectedLang = i18n.language === lang

  return (
    <label className={`btn btn-default ${isSelectedLang ? "active" : ""}`}>
      <input
        type="radio"
        name="selectedLanguage"
        checked={isSelectedLang}
        onChange={() => onLanguageChange(lang)}
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
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()

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

  const onLanguageChange = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language)
      dispatch(changeLanguage(language))
    },
    [dispatch, i18n]
  )

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
              <LangSelection
                lang={Language.FI}
                onLanguageChange={onLanguageChange}
              />
              <LangSelection
                lang={Language.SV}
                onLanguageChange={onLanguageChange}
              />
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
