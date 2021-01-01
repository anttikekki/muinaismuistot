import * as React from "react"
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
  getTypeIconURL,
  getFeatureMunicipality
} from "../../../../common/util/featureParser"
import { createLocationHash } from "../../../../common/util/URLHashHelper"

export enum FeatureTitleClickAction {
  OpenDetails = "openDetails",
  ClosePageAndPinOnMap = "closePageAndPinOnMap"
}

interface FeatureCollapsePanelProps {
  hidePage: () => void
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  permanentLink: string | undefined
  featureName: string
  featureTypeIconURL: string | undefined
  featureTypeName: string | undefined
}

const FeatureCollapsePanel: React.FC<FeatureCollapsePanelProps> = ({
  hidePage,
  titleClickAction,
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
    if (titleClickAction === FeatureTitleClickAction.OpenDetails) {
      event.preventDefault()
      onToggleOpen()
    }
    if (titleClickAction === FeatureTitleClickAction.ClosePageAndPinOnMap) {
      hidePage()
    }
  }

  const onChevronClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    onToggleOpen()
  }

  const onPermanentLinkClick = () => {
    hidePage()
  }

  return (
    <div className="panel panel-default">
      <div className="panel-heading feature-collapse-panel-heading" role="tab">
        <h4 className="panel-title">
          <a role="button" href={permanentLink} onClick={onTitleClick}>
            {featureName}
          </a>
          <a
            role="button"
            href=""
            className="pull-right"
            style={{ marginLeft: "10px" }}
            onClick={onChevronClick}
          >
            <span
              className={`glyphicon glyphicon-chevron-${
                isOpen ? "up" : "down"
              }`}
              aria-hidden="true"
            />
          </a>
          <a
            className="pull-right"
            href={permanentLink}
            onClick={onPermanentLinkClick}
          >
            <span className="glyphicon glyphicon-link" aria-hidden="true" />
          </a>
        </h4>
        <h6 className="panel-title">
          <a role="button" href={permanentLink} onClick={onTitleClick}>
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
  hidePage: () => void
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: ArgisFeature
}

export const ArgisFeatureCollapsePanel: React.FC<ArgisFeatureCollapsePanelProps> = ({
  hidePage,
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature,
  children
}) => {
  const { t } = useTranslation()
  const permanentLink = React.useMemo(() => {
    const coordinates = getFeatureLocation(feature)
    return coordinates && createLocationHash(coordinates)
  }, [feature])
  const featureName = React.useMemo(() => getFeatureName(t, feature), [feature])
  const featureTypeIconURL = React.useMemo(
    () => getFeatureTypeIconURL(feature),
    [feature]
  )
  const featureTypeName = React.useMemo(() => {
    const municipality = getFeatureMunicipality(feature)
    const name = getFeatureTypeName(t, feature)
    const suffix =
      titleClickAction === FeatureTitleClickAction.ClosePageAndPinOnMap &&
      municipality
        ? `, ${municipality}`
        : ""

    return name + suffix
  }, [t, titleClickAction, feature])

  return (
    <FeatureCollapsePanel
      hidePage={hidePage}
      titleClickAction={titleClickAction}
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
  hidePage: () => void
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  has3dModels?: boolean
}

export const MaisemanMuistiFeatureCollapsePanel: React.FC<MaisemanMuistiFeatureCollapsePanelProps> = ({
  hidePage,
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature,
  has3dModels,
  children
}) => {
  const { t } = useTranslation()
  const permanentLink = React.useMemo(() => {
    const coordinates = getGeoJSONFeatureLocation(feature)
    return coordinates && createLocationHash(coordinates)
  }, [feature])
  const featureName = `${feature.properties.name}, ${feature.properties.registerName}`
  const featureTypeIconURL = React.useMemo(
    () => getTypeIconURL("maiseman-muisti", has3dModels),
    [has3dModels]
  )
  const featureTypeName = `${t(`data.featureType.Kiinteä muinaisjäännös`)}, ${t(
    `data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`
  )}`

  return (
    <FeatureCollapsePanel
      hidePage={hidePage}
      titleClickAction={titleClickAction}
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
