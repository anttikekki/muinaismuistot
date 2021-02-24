import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Language } from "../../common/types"
import { changeLanguage, showPage } from "../../store/actionCreators"
import { PageId, Settings } from "../../store/storeTypes"

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
  pageId: PageId
}

export const Page: React.FC<Props> = ({ title, pageId, children }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const visiblePage = useSelector((settings: Settings) => settings.visiblePage)
  const [
    pageClosingAnimationTimeoutID,
    setPageClosingAnimationTimeoutID
  ] = useState<number | undefined>()
  const [pageVisibility, setPageVisibility] = useState<PageVisibility>(
    PageVisibility.Hidden
  )

  useEffect(() => {
    if (visiblePage === pageId) {
      setPageVisibility(PageVisibility.Visible)
    }
    if (visiblePage !== pageId && pageVisibility === PageVisibility.Visible) {
      setPageVisibility(PageVisibility.Closing)
    }
  }, [visiblePage, pageVisibility])

  useEffect(() => {
    if (pageVisibility === PageVisibility.Closing) {
      // Start closing page
      const id = window.setTimeout(() => {
        setPageClosingAnimationTimeoutID(undefined)
        setPageVisibility(PageVisibility.Hidden)
      }, 500)
      setPageClosingAnimationTimeoutID(id)
    }
  }, [pageVisibility])

  useEffect(() => {
    if (
      pageVisibility === PageVisibility.Visible &&
      pageClosingAnimationTimeoutID !== undefined
    ) {
      // Abort closing page because it is visible again
      window.clearTimeout(pageClosingAnimationTimeoutID)
      setPageClosingAnimationTimeoutID(undefined)
    }
  }, [pageVisibility, pageClosingAnimationTimeoutID])

  let classes = ""
  switch (pageVisibility) {
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

  const onHidePage = useCallback(() => {
    dispatch(showPage(undefined))
  }, [dispatch])

  return (
    <div className={`container page ${classes}`}>
      {pageVisibility !== PageVisibility.Hidden && (
        <div className="row pageHeader">
          <div className="col-xs-2 col-sm-2 col-md-2">
            <button className="btn btn-primary btn-sm" onClick={onHidePage}>
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

      {pageVisibility !== PageVisibility.Hidden && (
        <div className="pageContent">{children}</div>
      )}
    </div>
  )
}
