import React from "react"
import { FeatureLayer } from "../../common/layers.types"
import { getLayerIconURLs } from "../../common/util/featureParser"

interface Props {
  layer: FeatureLayer
  label: string
}

export const LayerFeatureIcons: React.FC<Props> = ({ layer, label }) => {
  return (
    <div className="ms-3">
      {getLayerIconURLs(layer).map((url, index) => (
        <img className="feature-icon" key={index} src={url} />
      ))}
      <span>{label}</span>
    </div>
  )
}
