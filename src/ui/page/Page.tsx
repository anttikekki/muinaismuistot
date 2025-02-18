import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Language } from "../../common/layers.types"
import { showPage } from "../../store/actionCreators"
import { AppDispatch, PageId, Settings } from "../../store/storeTypes"
import { changeLanguageThunk } from "../../store/thunks/language"

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
    <Button
      variant="outline-dark"
      size="sm"
      active={isSelectedLang}
      onClick={() => onLanguageChange(lang)}
    >
      {lang.toUpperCase()}
    </Button>
  )
}

interface Props {
  title: string
  pageId: PageId
  children: ReactNode
}

export const Page: React.FC<Props> = ({ title, pageId, children }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const visiblePage = useSelector((settings: Settings) => settings.visiblePage)
  const [pageClosingAnimationTimeoutID, setPageClosingAnimationTimeoutID] =
    useState<number | undefined>()
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
      dispatch(changeLanguageThunk(language))
    },
    [dispatch, i18n]
  )

  const onHidePage = useCallback(() => {
    dispatch(showPage(undefined))
  }, [dispatch])

  return (
    <Container className={`page ${classes}`}>
      {pageVisibility !== PageVisibility.Hidden && (
        <Row className="pageHeader">
          <Col xs={2} sm={2} md={2}>
            <Button size="sm" onClick={onHidePage}>
              <i className="bi bi-x" aria-hidden="true" />
              {t(`common.button.close`)}
            </Button>
          </Col>
          <Col xs={6} sm={7} md={7} style={{ textAlign: "center" }}>
            <span className="pageHeaderText">{title}</span>
          </Col>
          <Col xs={4} sm={3} md={3} style={{ textAlign: "right" }}>
            <ButtonGroup aria-label="Kielivalinta">
              <LangSelection
                lang={Language.FI}
                onLanguageChange={onLanguageChange}
              />
              <LangSelection
                lang={Language.SV}
                onLanguageChange={onLanguageChange}
              />
            </ButtonGroup>
          </Col>
        </Row>
      )}

      {pageVisibility !== PageVisibility.Hidden && (
        <div className="pageContent">{children}</div>
      )}
    </Container>
  )
}
