import React, { ReactNode, useCallback, useMemo } from "react"
import { Accordion, Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { GeoJSONFeature } from "../../../../common/geojson.types"
import { MaisemanMuistiFeatureProperties } from "../../../../common/maisemanMuisti.types"
import { MapFeature } from "../../../../common/mapFeature.types"
import {
  getFeatureLocation,
  getFeatureMunicipality,
  getFeatureName,
  getFeatureTypeIconURL,
  getFeatureTypeName,
  getGeoJSONFeatureLocation,
  getTypeIconURL
} from "../../../../common/util/featureParser"
import { createLocationHash } from "../../../../common/util/URLHashHelper"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch } from "../../../../store/storeTypes"

export enum FeatureTitleClickAction {
  OpenDetails = "openDetails",
  ClosePageAndPinOnMap = "closePageAndPinOnMap"
}

export interface FeatureCollapsePanelCommonExternalProps {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  panelId: string
  onToggleOpen: () => void
}

interface FeatureCollapsePanelProps
  extends FeatureCollapsePanelCommonExternalProps {
  permanentLink: string | undefined
  featureName: string
  featureTypeIconURL: string | undefined
  featureTypeName: string | undefined
  children: ReactNode
}

const FeatureCollapsePanel: React.FC<FeatureCollapsePanelProps> = ({
  titleClickAction,
  panelId,
  onToggleOpen,
  permanentLink,
  featureName,
  featureTypeIconURL,
  featureTypeName,
  children
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const hidePage = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.SHOW_PAGE,
      pageId: undefined
    })
  }, [dispatch])

  const onPermanentLinkClick = () => {
    hidePage()
  }

  return (
    <Accordion.Item eventKey={panelId}>
      <Accordion.Header onClick={onToggleOpen} as="div">
        <Container className="ps-0">
          <Row>
            <Col xs={10}>
              <h6 className="mb-0">{featureName}</h6>
              <div>
                <img className="feature-icon" src={featureTypeIconURL} />
                <span>{featureTypeName}</span>
              </div>
            </Col>
            <Col xs={2} className="text-end align-self-center">
              <a href={permanentLink} onClick={onPermanentLinkClick}>
                <i
                  className="bi bi-link-45deg"
                  aria-hidden="true"
                  style={{ fontSize: "2rem" }}
                />
              </a>
            </Col>
          </Row>
        </Container>
      </Accordion.Header>
      <Accordion.Body>
        <div className="panel-body">{children}</div>
      </Accordion.Body>
    </Accordion.Item>
  )
}

interface MapFeatureCollapsePanelProps
  extends FeatureCollapsePanelCommonExternalProps {
  feature: MapFeature
  children: ReactNode
}

export const MapFeatureCollapsePanel: React.FC<
  MapFeatureCollapsePanelProps
> = ({
  titleClickAction,
  isOpen,
  panelId,
  onToggleOpen,
  feature,
  children
}) => {
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
      panelId={panelId}
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

interface MaisemanMuistiFeatureCollapsePanelProps
  extends FeatureCollapsePanelCommonExternalProps {
  feature: GeoJSONFeature<MaisemanMuistiFeatureProperties>
  has3dModels?: boolean
  children: ReactNode
}

export const MaisemanMuistiFeatureCollapsePanel: React.FC<
  MaisemanMuistiFeatureCollapsePanelProps
> = ({
  titleClickAction,
  isOpen,
  panelId,
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
      panelId={panelId}
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
