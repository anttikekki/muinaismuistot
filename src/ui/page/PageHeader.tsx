import React, { useCallback } from "react"
import { Button, ButtonGroup, Col, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Language } from "../../common/layers.types"
import { AppDispatch } from "../../store/storeTypes"
import { changeLanguageThunk } from "../../store/thunks/language"

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
  onHidePage: () => void
}

export const PageHeader: React.FC<Props> = ({ title, onHidePage }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const onLanguageChange = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language)
      dispatch(changeLanguageThunk(language))
    },
    [dispatch, i18n]
  )

  return (
    <Row className="pageHeader">
      <Col xs={2} sm={2} md={2}>
        <Button size="sm" onClick={onHidePage}>
          <i className="bi bi-x" aria-hidden="true" />
          {t(`common.button.close`)}
        </Button>
      </Col>
      <Col xs={6} sm={7} md={7} className="text-center">
        <span className="pageHeaderText">{title}</span>
      </Col>
      <Col xs={4} sm={3} md={3} className="text-end">
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
  )
}
