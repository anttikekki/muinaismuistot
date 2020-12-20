import * as React from "react"
import { Form } from "react-bootstrap"
import { Trans } from "react-i18next"
import {
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"

interface Props {
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
}

export const MaisemanMuistiField: React.FC<Props> = ({ feature }) => {
  return (
    <Form.Group>
      <Form.Label>
        <b>
          <Trans
            i18nKey="data.register.maisemanMuisti"
            components={{ a: <a /> }}
          />
        </b>
      </Form.Label>
      <p>
        <img className="feature-icon" src="images/maiseman-muisti.png" />
        <span>{feature.properties.name}</span>
      </p>
    </Form.Group>
  )
}
