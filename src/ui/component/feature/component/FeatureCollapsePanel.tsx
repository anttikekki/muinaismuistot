import React, { MouseEvent, ReactNode, useCallback, useMemo } from "react"
import { Accordion, Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { MapFeature } from "../../../../common/mapFeature.types"
import {
  getFeatureLocation,
  getFeatureMunicipality,
  getFeatureName,
  getFeatureTypeIconURL,
  getFeatureTypeName
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

interface MapFeatureCollapsePanelProps
  extends FeatureCollapsePanelCommonExternalProps {
  feature: MapFeature
  children: ReactNode
}

export const MapFeatureCollapsePanel: React.FC<
  MapFeatureCollapsePanelProps
> = ({ titleClickAction, panelId, onToggleOpen, feature, children }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const coordinates = useMemo(() => getFeatureLocation(feature), [feature])
  const permanentLink = useMemo(
    () => coordinates && createLocationHash(coordinates),
    [i18n.language, coordinates]
  )

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

  const onPermanentLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      coordinates &&
        dispatch({
          type: ActionTypeEnum.SET_LINKED_FEATURE,
          coordinates: [coordinates[0], coordinates[1]] // [x, y]
        })
      dispatch({
        type: ActionTypeEnum.SHOW_PAGE,
        pageId: undefined
      })
    },
    [dispatch, coordinates]
  )

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
              <a
                href={permanentLink}
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
