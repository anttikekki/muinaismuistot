import React from "react"
import { Col, Container, Dropdown, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Language } from "../../common/layers.types"
import { ActionTypeEnum } from "../../store/actionTypes"
import { AppDispatch } from "../../store/storeTypes"

interface Props {
  title: string
}

export const PageHeader: React.FC<Props> = ({ title }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const onLanguageChange = (language: Language) => () => {
    i18n.changeLanguage(language)
    dispatch({
      type: ActionTypeEnum.CHANGE_LANGUAGE,
      language
    })
  }

  return (
    <Container className="ps-0">
      <Row>
        <Col xs={3} className="text-start">
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              title={t("common.button.languageSelection")}
            >
              {i18n.language.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as="button"
                onClick={onLanguageChange(Language.FI)}
              >
                suomeksi (FI)
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={onLanguageChange(Language.SV)}
              >
                på svenska (SV)
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={onLanguageChange(Language.EN)}
              >
                in english (EN)
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={7} className="text-center">
          <h5>{title}</h5>
        </Col>
      </Row>
    </Container>
  )
}
