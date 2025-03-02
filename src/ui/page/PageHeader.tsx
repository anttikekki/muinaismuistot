import React, { useCallback } from "react"
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap"
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
}

export const PageHeader: React.FC<Props> = ({ title }) => {
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
    <Container>
      <Row>
        <Col xs={4} sm={3} md={3} className="text-start">
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
        <Col xs={6} sm={7} md={7} className="text-center">
          <h5>{title}</h5>
        </Col>
      </Row>
    </Container>
  )
}
