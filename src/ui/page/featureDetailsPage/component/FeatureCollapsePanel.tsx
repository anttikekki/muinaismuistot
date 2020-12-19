import * as React from "react"
import { Accordion, Button, Card } from "react-bootstrap"
import { useTranslation } from "react-i18next"
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
  featureUniqueId: string
  permanentLink: string | undefined
  featureName: string
  featureTypeIconURL: string | undefined
  featureTypeName: string | undefined
}

const linkButtonStyles = { color: "black", padding: "0" }

const FeatureCollapsePanel: React.FC<FeatureCollapsePanelProps> = ({
  isOpen,
  featureUniqueId,
  permanentLink,
  featureName,
  featureTypeIconURL,
  featureTypeName,
  children
}) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey={featureUniqueId}>
        <Button
          variant="link"
          className="float-right"
          style={{ ...linkButtonStyles, marginLeft: "5px", fontSize: "26px" }}
        >
          {isOpen ? (
            <i className="bi bi-caret-up-fill" />
          ) : (
            <i className="bi bi-caret-down-fill" />
          )}
        </Button>
        <a
          className="float-right"
          href={permanentLink}
          style={{ color: "black", fontSize: "26px" }}
        >
          <i className="bi bi-link" />
        </a>
        <Button variant="link" style={linkButtonStyles}>
          <b>{featureName}</b>
        </Button>
        <div>
          <Button variant="link" style={linkButtonStyles}>
            <img className="feature-icon" src={featureTypeIconURL} />
            <span>{featureTypeName}</span>
          </Button>
        </div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={featureUniqueId}>
        <Card.Body>{children}</Card.Body>
      </Accordion.Collapse>
    </Card>
  )
}

interface ArgisFeatureCollapsePanelProps {
  isOpen: boolean
  featureUniqueId: string
  feature: ArgisFeature
  has3dModels?: boolean
  hasMaisemanMuistiFeatures?: boolean
}

export const ArgisFeatureCollapsePanel: React.FC<ArgisFeatureCollapsePanelProps> = ({
  isOpen,
  featureUniqueId,
  feature,
  has3dModels,
  hasMaisemanMuistiFeatures,
  children
}) => {
  const { t } = useTranslation()
  const coordinates = getFeatureLocation(feature)
  const permanentLink = coordinates && createLocationHash(coordinates)
  const featureName = getFeatureName(feature)
  const featureTypeIconURL = getFeatureTypeIconURL(
    feature,
    has3dModels,
    hasMaisemanMuistiFeatures
  )
  const featureTypeName = getFeatureTypeName(
    t,
    feature,
    has3dModels,
    hasMaisemanMuistiFeatures
  )

  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      featureUniqueId={featureUniqueId}
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
  featureUniqueId: string
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  has3dModels?: boolean
}

export const MaisemanMuistiFeatureCollapsePanel: React.FC<MaisemanMuistiFeatureCollapsePanelProps> = ({
  isOpen,
  featureUniqueId,
  feature,
  has3dModels,
  children
}) => {
  const { t } = useTranslation()
  const coordinates = getGeoJSONFeatureLocation(feature)
  const permanentLink = coordinates && createLocationHash(coordinates)
  const featureName = `${feature.properties.name}, ${feature.properties.registerName}`
  const featureTypeIconURL = getTypeIconURL("maiseman-muisti", has3dModels)
  const featureTypeName = `${t(`data.featureType.Kiinteä muinaisjäännös`)}, ${t(
    `data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`
  )}`

  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      featureUniqueId={featureUniqueId}
      permanentLink={permanentLink}
      featureName={featureName}
      featureTypeIconURL={featureTypeIconURL}
      featureTypeName={featureTypeName}
    >
      {children}
    </FeatureCollapsePanel>
  )
}
