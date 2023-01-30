import React from "react"
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
    <div className="form-group">
      <label>
        <Trans
          i18nKey="data.register.nameWithLink.maisemanMuisti"
          components={{ a: <a /> }}
        />
      </label>
      <p>
        <img className="feature-icon" src="images/maiseman-muisti.png" />
        <span>{feature.properties.name}</span>
      </p>
    </div>
  )
}
