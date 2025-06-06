import React from "react"
import { Alert, Col, Row } from "react-bootstrap"
import { Trans } from "react-i18next"
import { GeoJSONFeature } from "../../../../common/geojson.types"
import { MaisemanMuistiFeatureProperties } from "../../../../common/maisemanMuisti.types"

interface Props {
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
}

export const MaisemanMuistiField: React.FC<Props> = ({ feature }) => {
  return (
    <Row className="mt-2">
      <Col>
        <Alert variant="light">
          <Trans
            i18nKey="data.register.nameWithLink.maisemanMuisti"
            components={{ a: <Alert.Link /> }}
          />
          :
          <div>
            <img className="feature-icon" src="images/maiseman-muisti.png" />
            <span>{feature.properties.name}</span>
          </div>
        </Alert>
      </Col>
    </Row>
  )
}
