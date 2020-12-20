import * as React from "react"
import {
  Button,
  Col,
  Container,
  Row,
  ToggleButton,
  ToggleButtonGroup
} from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Language } from "../../common/types"

export enum PageVisibility {
  Visible = "Visible",
  Closing = "Closing",
  Hidden = "Hidden"
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
    <Container className={`page ${classes}`}>
      {visibility !== PageVisibility.Hidden && (
        <Row className="pageHeader">
          <Col xs={1} sm={1}>
            <Button variant="primary" size="sm" onClick={hidePage}>
              <span aria-hidden="true">&times;</span>
              {t(`common.button.close`)}
            </Button>
          </Col>
          <Col xs={8} sm={9} style={{ textAlign: "center" }}>
            <span className="pageHeaderText">{title}</span>
          </Col>
          <Col xs={3} sm={2} style={{ textAlign: "right" }}>
            <ToggleButtonGroup
              name="lang"
              value={i18n.language}
              onChange={(lang: Language) => i18n.changeLanguage(lang)}
            >
              <ToggleButton value={Language.FI} variant="outline-secondary">
                <b>FI</b>
              </ToggleButton>
              <ToggleButton value={Language.SV} variant="outline-secondary">
                <b>SV</b>
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      )}

      {visibility !== PageVisibility.Hidden && (
        <div className="pageContent">{children}</div>
      )}
    </Container>
  )
}
