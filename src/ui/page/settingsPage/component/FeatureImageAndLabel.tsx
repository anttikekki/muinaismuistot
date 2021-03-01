import React from "react"

interface Props {
  iconPath: string
  label: string
}

export const FeatureImageAndLabel: React.FC<Props> = ({ iconPath, label }) => {
  return (
    <div className="checkbox sub-layer-select-checkbox-container">
      <img className="feature-icon" src={iconPath} />
      <span>{label}</span>
    </div>
  )
}
