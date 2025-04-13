import React from "react"
import { Accordion, Col, Form, Row } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { ModelFeatureProperties } from "../../../../common/3dModels.types"
import { GeoJSONFeature } from "../../../../common/geojson.types"

interface Props {
  models: GeoJSONFeature<ModelFeatureProperties>[]
}

export const Info: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Accordion>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <i className="bi bi-info-circle pe-1" aria-hidden="true" />
          {t(`details.3d.infoHeading`)}
        </Accordion.Header>
        <Accordion.Body>
          <p>
            <Trans i18nKey="details.3d.infoText1" components={{ a: <a /> }} />
          </p>
          <p>
            <Trans
              i18nKey="details.3d.infoText2"
              components={{ kbd: <kbd /> }}
            />
            <i className="bi bi-arrows-angle-expand ps-1" aria-hidden="true" />
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
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export const EmbeddedModels: React.FC<Props> = ({ models = [] }) => {
  const { t } = useTranslation()

  if (models.length === 0) {
    return null
  }

  return (
    <Row className="mt-2">
      <Col>
        <h6>{t(`details.3d.title`)}</h6>

        <Info />

        {models.map((feature) => {
          const { name, url } = feature.properties.model
          return (
            <Form.Group className="pt-2" key={url} controlId={name}>
              <Form.Label className="fw-bold">{name}</Form.Label>
              <iframe
                title={name}
                width="100%"
                height="400"
                src={`${url}/embed`}
                allow="fullscreen"
                allowFullScreen={true}
              />
            </Form.Group>
          )
        })}
      </Col>
    </Row>
  )
}
