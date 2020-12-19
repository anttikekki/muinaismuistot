import * as React from "react"
import { Accordion, Card } from "react-bootstrap"
import { Link, CaretDownFill, CaretUpFill } from "react-bootstrap-icons"
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
import { LinkButton } from "./LinkButton"

interface FeatureCollapsePanelProps {
  isOpen: boolean
  featureUniqueId: string
  permanentLink: string | undefined
  featureName: string
  featureTypeIconURL: string | undefined
  featureTypeName: string | undefined
}

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
        <a
          className="float-right"
          href={permanentLink}
          style={{ color: "black" }}
        >
          <Link aria-hidden="true" size={28} />
        </a>
        <LinkButton>
          <b>{featureName}</b>
        </LinkButton>
        <div>
          <LinkButton>
            <img className="feature-icon" src={featureTypeIconURL} />
            <span>{featureTypeName}</span>
          </LinkButton>
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
