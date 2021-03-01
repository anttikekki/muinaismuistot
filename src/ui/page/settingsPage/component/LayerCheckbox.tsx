import React, { ReactNode } from "react"
import { FeatureLayer } from "../../../../common/types"
import { getLayerIconURLs } from "../../../../common/util/featureParser"

interface LayerCheckboxProps<T extends FeatureLayer> {
  label: string
  layer: T
  selectedLayers: Array<T>
  onSelectLayer: (layer: T) => void
  showIcon?: boolean
  children?: ReactNode
}

export const LayerCheckbox = <T extends FeatureLayer>(
  props: LayerCheckboxProps<T>
) => {
  const {
    label,
    layer,
    selectedLayers,
    onSelectLayer,
    showIcon = true,
    children
  } = props
  const isSelected = selectedLayers.includes(layer)

  return (
    <div className="checkbox sub-layer-select-checkbox-container">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectLayer(layer)}
          checked={isSelected}
        />
        {showIcon
          ? getLayerIconURLs(layer).map((url, index) => (
              <img className="feature-icon" key={index} src={url} />
            ))
          : null}

        <span>{label}</span>
      </label>
      {children}
    </div>
  )
}
