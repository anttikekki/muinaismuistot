import * as React from "react"
import {
  ArgisFeature,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"
import {
  getFeatureTypeIconURL,
  getFeatureTypeName,
  getFeatureLocation,
  getFeatureName,
  getGeoJSONFeatureLocation,
  getTypeIconURL
} from "../../../../common/util/featureParser"
import { createLocationHash } from "../../../../common/util/URLHashHelper"

interface FeatureCollapsePanelProps {
  isOpen: boolean
  onToggleOpen: () => void
  permanentLink: string | undefined
  featureName: string
  featureTypeIconURL: string | undefined
  featureTypeName: string | undefined
}

const FeatureCollapsePanel: React.FC<FeatureCollapsePanelProps> = ({
  isOpen,
  onToggleOpen,
  permanentLink,
  featureName,
  featureTypeIconURL,
  featureTypeName,
  children
}) => {
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
            {featureName}
          </a>
          <a className="pull-right" href={permanentLink}>
            <span className="glyphicon glyphicon-link" aria-hidden="true" />
          </a>
        </h4>
        <h6 className="panel-title">
          <a role="button" href="" onClick={onTitleClick}>
            <img className="feature-icon" src={featureTypeIconURL} />
            <span>{featureTypeName}</span>
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

interface ArgisFeatureCollapsePanelProps {
  isOpen: boolean
  onToggleOpen: () => void
  feature: ArgisFeature
  has3dModels?: boolean
  hasMaisemanMuistiFeatures?: boolean
}

export const ArgisFeatureCollapsePanel: React.FC<ArgisFeatureCollapsePanelProps> = ({
  isOpen,
  onToggleOpen,
  feature,
  has3dModels,
  hasMaisemanMuistiFeatures,
  children
}) => {
  const coordinates = getFeatureLocation(feature)
  const permanentLink = coordinates && createLocationHash(coordinates)
  const featureName = getFeatureName(feature)
  const featureTypeIconURL = getFeatureTypeIconURL(
    feature,
    has3dModels,
    hasMaisemanMuistiFeatures
  )
  const featureTypeName = getFeatureTypeName(
    feature,
    has3dModels,
    hasMaisemanMuistiFeatures
  )

  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      permanentLink={permanentLink}
      featureName={featureName}
      featureTypeIconURL={featureTypeIconURL}
      featureTypeName={featureTypeName}
    >
      {children}
    </FeatureCollapsePanel>
  )
}

interface MaisemanMuistiFeatureCollapsePanelProps {
  isOpen: boolean
  onToggleOpen: () => void
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  has3dModels?: boolean
}

export const MaisemanMuistiFeatureCollapsePanel: React.FC<MaisemanMuistiFeatureCollapsePanelProps> = ({
  isOpen,
  onToggleOpen,
  feature,
  has3dModels,
  children
}) => {
  const coordinates = getGeoJSONFeatureLocation(feature)
  const permanentLink = coordinates && createLocationHash(coordinates)
  const featureName = `${feature.properties.name}, ${feature.properties.registerName}`
  const featureTypeIconURL = getTypeIconURL("maiseman-muisti", has3dModels)
  const featureTypeName =
    "Kiinteä muinaisjäännös, Valtakunnallisesti merkittävä muinaisjäännös"

  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      permanentLink={permanentLink}
      featureName={featureName}
      featureTypeIconURL={featureTypeIconURL}
      featureTypeName={featureTypeName}
    >
      {children}
    </FeatureCollapsePanel>
  )
}
