import * as React from "react"
import {
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"

interface Props {
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
}

export const MaisemanMuistiField: React.FC<Props> = ({ feature }) => (
  <div className="form-group">
    <label>
      Maiseman muisti - Valtakunnallisesti merkittävät muinaisjäännökset (
      <a href="./maisemanmuisti/" target="_blank">
        lisätietoa
      </a>
      )
    </label>
    <p>
      <img className="feature-icon" src="images/maiseman-muisti.png" />
      <span>{feature.properties.name}</span>
    </p>
  </div>
)
