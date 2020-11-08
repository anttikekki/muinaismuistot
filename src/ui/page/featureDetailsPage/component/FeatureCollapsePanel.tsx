import * as React from "react"
import { ArgisFeature } from "../../../../common/types"
import {
  getFeatureTypeIconURL,
  getFeatureTypeName,
  getFeatureLocation,
  getFeatureName
} from "../../../../common/util/featureParser"
import { createLocationHash } from "../../../../common/util/URLHashHelper"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: ArgisFeature
  has3dModels?: boolean
  hasMaisemanMuistiFeatures?: boolean
}

export const FeatureCollapsePanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  has3dModels,
  hasMaisemanMuistiFeatures,
  children
}) => {
  const coordinates = getFeatureLocation(feature)
  const permanentLink = coordinates && createLocationHash(coordinates)
  const onTitleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    onToggleOpen()
  }

  return (
    <div className="panel panel-default">
      <div className="panel-heading feature-collapse-panel-heading" role="tab">
        <h4 className="panel-title">
          <a role="button" href="" onClick={onTitleClick}>
            {getFeatureName(feature)}
          </a>
          <a className="pull-right" href={permanentLink}>
            <span className="glyphicon glyphicon-link" aria-hidden="true" />
          </a>
        </h4>
        <h6 className="panel-title">
          <a role="button" href="" onClick={onTitleClick}>
            <img
              className="feature-icon"
              src={getFeatureTypeIconURL(
                feature,
                has3dModels,
                hasMaisemanMuistiFeatures
              )}
            />
            <span>
              {getFeatureTypeName(
                feature,
                has3dModels,
                hasMaisemanMuistiFeatures
              )}
            </span>
          </a>
        </h6>
      </div>
      <div
        className={`panel-collapse collapse ${isOpen ? "in" : ""}`}
        role="tabpanel"
      >
        <div className="panel-body">{children}</div>
      </div>
    </div>
  )
}
