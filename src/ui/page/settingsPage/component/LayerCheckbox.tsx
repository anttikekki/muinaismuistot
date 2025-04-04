import React, { ReactNode } from "react"
import { Form } from "react-bootstrap"
import { FeatureLayer } from "../../../../common/layers.types"
import { getLayerIconURLs } from "../../../../common/util/featureParser"

interface LayerCheckboxProps<T extends FeatureLayer> {
  label: string
  layer: T
  selectedLayers: Array<T>
  onSelectLayer: (layer: T) => void
  showIcon?: boolean
  disabled?: boolean
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
    disabled,
    children
  } = props
  const isSelected = selectedLayers.includes(layer)

  return (
    <Form.Check
      type="checkbox"
      className="ms-3"
      id={label}
      onChange={() => onSelectLayer(layer)}
      checked={isSelected}
      disabled={disabled}
      label={
        <>
          {showIcon
            ? getLayerIconURLs(layer).map((url, index) => (
                <img className="feature-icon" key={index} src={url} />
              ))
            : null}

          <span>{label}</span>
          {children}
        </>
      }
    ></Form.Check>
  )
}
