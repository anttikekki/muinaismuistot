import React, { useCallback } from "react"
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Language } from "../../common/layers.types"
import { ActionTypeEnum } from "../../store/actionTypes"
import { AppDispatch } from "../../store/storeTypes"

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
  const { i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const onLanguageChange = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language)
      dispatch({
        type: ActionTypeEnum.CHANGE_LANGUAGE,
        language
      })
    },
    [dispatch, i18n]
  )

  return (
    <Container className="ps-0">
      <Row>
        <Col xs={3} className="text-start">
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
        <Col xs={7} className="text-center">
          <h5>{title}</h5>
        </Col>
      </Row>
    </Container>
  )
}
