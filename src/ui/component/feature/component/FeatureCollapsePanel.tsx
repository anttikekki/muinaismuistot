import React, { ReactNode, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import {
  getFeatureTypeIconURL,
  getFeatureTypeName,
  getFeatureName,
  getGeoJSONFeatureLocation,
  getTypeIconURL,
  getFeatureMunicipality,
  getFeatureLocation
} from "../../../../common/util/featureParser"
import { createLocationHash } from "../../../../common/util/URLHashHelper"
import { showPage } from "../../../../store/actionCreators"
import { MapFeature } from "../../../../common/mapFeature.types"
import { MaisemanMuistiFeatureProperties } from "../../../../common/maisemanMuisti.types"
import { GeoJSONFeature } from "../../../../common/geojson.types"

export enum FeatureTitleClickAction {
  OpenDetails = "openDetails",
  ClosePageAndPinOnMap = "closePageAndPinOnMap"
}

interface FeatureCollapsePanelProps {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  permanentLink: string | undefined
  featureName: string
  featureTypeIconURL: string | undefined
  featureTypeName: string | undefined
  children: ReactNode
}

const FeatureCollapsePanel: React.FC<FeatureCollapsePanelProps> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  permanentLink,
  featureName,
  featureTypeIconURL,
  featureTypeName,
  children
}) => {
  const dispatch = useDispatch()
  const hidePage = useCallback(() => {
    dispatch(showPage(undefined))
  }, [dispatch])

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

interface MapFeatureCollapsePanelProps {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MapFeature
  children: ReactNode
}

export const MapFeatureCollapsePanel: React.FC<
  MapFeatureCollapsePanelProps
> = ({ titleClickAction, isOpen, onToggleOpen, feature, children }) => {
  const { t, i18n } = useTranslation()
  const permanentLink = useMemo(() => {
    const coordinates = getFeatureLocation(feature)
    return coordinates && createLocationHash(coordinates)
  }, [i18n.language, feature])
  const featureName = useMemo(
    () => getFeatureName(t, feature),
    [i18n.language, feature]
  )
  const featureTypeIconURL = useMemo(
    () => getFeatureTypeIconURL(feature),
    [feature]
  )
  const featureTypeName = useMemo(() => {
    const municipality = getFeatureMunicipality(feature)
    const name = getFeatureTypeName(t, feature)
    const suffix =
      titleClickAction === FeatureTitleClickAction.ClosePageAndPinOnMap &&
      municipality
        ? `, ${municipality}`
        : ""

    return name + suffix
  }, [i18n.language, titleClickAction, feature])

  return (
    <FeatureCollapsePanel
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
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  has3dModels?: boolean
  children: ReactNode
}

export const MaisemanMuistiFeatureCollapsePanel: React.FC<
  MaisemanMuistiFeatureCollapsePanelProps
> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature,
  has3dModels,
  children
}) => {
  const { t } = useTranslation()
  const permanentLink = useMemo(() => {
    const coordinates = getGeoJSONFeatureLocation(feature)
    return coordinates && createLocationHash(coordinates)
  }, [feature])
  const featureName = `${feature.properties.name}, ${feature.properties.registerName}`
  const featureTypeIconURL = useMemo(
    () => getTypeIconURL("maiseman-muisti", has3dModels),
    [has3dModels]
  )
  const featureTypeName = `${t(`data.featureType.Kiinteä muinaisjäännös`)}, ${t(
    `data.featureType.Valtakunnallisesti merkittävä muinaisjäännös`
  )}`

  return (
    <FeatureCollapsePanel
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
