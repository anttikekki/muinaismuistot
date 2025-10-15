import React, { useState } from "react"
import { Button, OverlayTrigger, Popover, Stack } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  getLayerIconURLs,
  getLayerRegisterName
} from "../../../common/util/featureParser"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../store/storeTypes"

export const LinkedFeatureButton: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const linkedFeature = useSelector(
    (settings: Settings) => settings.linkedFeature
  )
  const [showPopover, setShowPopover] = useState(false)

  if (!linkedFeature) {
    return
  }
  const { layer, name, coordinates } = linkedFeature

  const popover = (
    <Popover id="linked-feature-popover">
      <Popover.Header as="h3">{t("linkedFeature.header")}</Popover.Header>
      <Popover.Body>
        {layer && name && (
          <Stack gap={1} className="mb-2">
            <div>{name}</div>
            <div>
              <img className="feature-icon" src={getLayerIconURLs(layer)[0]} />
              <span>{getLayerRegisterName(t, layer)}</span>
            </div>
          </Stack>
        )}
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              dispatch({
                type: ActionTypeEnum.CENTER_MAP_TO_LINKED_FEATURE
              })
            }
          >
            {t("linkedFeature.showOnMap")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              dispatch({
                type: ActionTypeEnum.IDENTIFY_MAP_FEATURES_ON_COORDINATE,
                requestTimestamp: Date.now(),
                coordinates
              })
              setShowPopover(false)
            }}
          >
            {t("linkedFeature.showFeatureDetails")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              dispatch({
                type: ActionTypeEnum.SET_LINKED_FEATURE,
                linkedFeature: undefined
              })
            }
          >
            {t("linkedFeature.remove")}
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  )

  return (
    <div id="map-button-linked-feature" className="map-button">
      <OverlayTrigger
        trigger="click"
        placement="right"
        overlay={popover}
        show={showPopover}
        onToggle={(nextShow) => setShowPopover(nextShow)}
      >
        <Button
          variant="warning"
          size="sm"
          title={t(`linkedFeature.header`) ?? undefined}
        >
          <i className="bi bi-geo-alt-fill" aria-hidden="true" />
        </Button>
      </OverlayTrigger>
    </div>
  )
}
