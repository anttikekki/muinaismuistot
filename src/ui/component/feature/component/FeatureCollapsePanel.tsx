import React, { MouseEvent, ReactNode, useCallback, useMemo } from "react"
import { Accordion, Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { FeatureLayer } from "../../../../common/layers.types"
import { MapFeature } from "../../../../common/mapFeature.types"
import {
  getFeatureLocation,
  getFeatureMunicipality,
  getFeatureName,
  getFeatureTypeIconURL,
  getFeatureTypeName
} from "../../../../common/util/featureParser"
import { createLinkedFeatureUrl } from "../../../../common/util/URLHashHelper"
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
  openPanelId?: string
  featureLayer: FeatureLayer
  featureRegisterId: string
  featureUniqueLayerId: string
  isLinkedFeature: boolean
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
  panelId,
  onToggleOpen,
  feature,
  featureLayer,
  featureRegisterId,
  isLinkedFeature,
  children
}) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

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

  const permalinkLinkedFeature = useMemo(
    () => ({
      coordinates: getFeatureLocation(feature) as [number, number],
      layer: featureLayer,
      id: featureRegisterId,
      name: featureName
    }),
    [feature, featureLayer, featureRegisterId, featureName]
  )
  const linkedFeaturePermanentLink = useMemo(
    () => createLinkedFeatureUrl(permalinkLinkedFeature),
    [i18n.language, permalinkLinkedFeature]
  )

  const onPermanentLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      dispatch({
        type: ActionTypeEnum.SET_LINKED_FEATURE,
        linkedFeature: permalinkLinkedFeature
      })

      // Hide open page when user click feature location link
      dispatch({
        type: ActionTypeEnum.SHOW_PAGE,
        pageId: undefined
      })
    },
    [dispatch, permalinkLinkedFeature]
  )

  return (
    <Accordion.Item eventKey={panelId}>
      <Accordion.Header
        onClick={onToggleOpen}
        as="div"
        className={
          isLinkedFeature ? "current-linked-feature-accordian-header" : ""
        }
      >
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
              <a
                href={linkedFeaturePermanentLink}
                onClick={onPermanentLinkClick}
                title={t("common.button.featureLocationLink")}
              >
                <i
                  className="bi bi-geo-alt-fill"
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
