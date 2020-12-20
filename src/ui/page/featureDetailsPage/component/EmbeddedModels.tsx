import * as React from "react"
import { Accordion, Button, Card, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { ModelFeatureProperties } from "../../../../common/types"

interface Props {
  models?: Array<ModelFeatureProperties>
}

const linkButtonStyles: React.CSSProperties = {
  padding: "0",
  textAlign: "left"
}

export const Info: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          <Button variant="link" style={linkButtonStyles}>
            <i className="bi bi-info-circle" />
            <span style={{ marginLeft: "5px" }}>
              {t(`details.3d.infoHeading`)}
            </span>
          </Button>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <p>
              <Trans i18nKey="details.3d.infoText1" components={{ a: <a /> }} />
            </p>
            <p>
              <Trans
                i18nKey="details.3d.infoText2"
                components={{ kbd: <kbd /> }}
              />{" "}
              <img src="images/sketchfab-fullscreen.png" />
            </p>
            <p>{t(`details.3d.controls.title`)}:</p>
            <ul>
              <li>
                <b>{t(`details.3d.controls.rotateTitle`)}:</b>{" "}
                {t(`details.3d.controls.rotate`)}
              </li>
              <li>
                <b>{t(`details.3d.controls.zoomTitle`)}:</b>{" "}
                {t(`details.3d.controls.zoom`)}
              </li>
              <li>
                <b>{t(`details.3d.controls.zoomTitle`)}:</b>{" "}
                {t(`details.3d.controls.zoom`)}
              </li>
            </ul>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

export const EmbeddedModels: React.FC<Props> = ({ models = [] }) => {
  const { t } = useTranslation()

  if (models.length === 0) {
    return null
  }

  return (
    <>
      <br />
      <h4>{t(`details.3d.title`)}</h4>

      <Info />

      {models.map((model) => (
        <Form.Group key={model.model.url}>
          <Form.Label>
            <b>{model.model.name}</b>
          </Form.Label>
          <iframe
            title={model.model.name}
            width="100%"
            height="400"
            src={`${model.model.url}/embed`}
            allow="fullscreen"
            allowFullScreen={true}
          />
        </Form.Group>
      ))}
    </>
  )
}
