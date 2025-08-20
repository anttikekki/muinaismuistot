import React, { useCallback } from "react"
import { Accordion, Alert, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  LayerGroup,
  MaannousuInfoLayerIndex
} from "../../../../common/layers.types"
import { isWebGLSupported } from "../../../../common/util/webGLUtils"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const MaannousuInfoLayerSettingsPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { enabled, opacity, placement } = useSelector(
    (settings: Settings) => settings.maannousuInfo
  )

  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.MaannousuInfo,
        enabled
      }),
    [dispatch]
  )

  const onPlacementSwitchChange = useCallback(
    (placement: MaannousuInfoLayerIndex) =>
      dispatch({
        type: ActionTypeEnum.MOVE_MAANNOUSU_LAYER,
        placement
      }),
    [dispatch]
  )

  const title = t(`settings.maannousuInfo.title`)
  const webGLSupported = isWebGLSupported()

  return (
    <Accordion.Item eventKey={LayerGroup.MaannousuInfo}>
      <Accordion.Header as="div">
        <Form.Check
          type="switch"
          id={title}
          checked={enabled}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onSwitchChange(!enabled)}
          disabled={!webGLSupported}
        />
        {title}
      </Accordion.Header>
      <Accordion.Body>
        {!webGLSupported && (
          <Alert variant="danger">
            <Trans i18nKey={`settings.maannousuInfo.webGLError`} />
          </Alert>
        )}
        <Form>
          <h6>
            <Trans
              i18nKey={`data.register.nameWithLink.MaannousuInfo`}
              components={{ a: <a /> }}
            />
          </h6>

          <p>
            <Trans
              i18nKey={`settings.maannousuInfo.info`}
              components={{ a: <a /> }}
            />
          </p>

          <p>
            <Trans i18nKey={`settings.maannousuInfo.info2`} />
          </p>

          <Form.Group className="mb-3">
            <Form.Switch
              checked={placement === MaannousuInfoLayerIndex.Top}
              onChange={() =>
                onPlacementSwitchChange(
                  placement === MaannousuInfoLayerIndex.Bottom
                    ? MaannousuInfoLayerIndex.Top
                    : MaannousuInfoLayerIndex.Bottom
                )
              }
              disabled={!enabled || !webGLSupported}
              label={t("settings.maannousuInfo.placementSwitch")}
            />
          </Form.Group>

          <LayerTransparencyInput
            opacity={opacity}
            layerGroup={LayerGroup.MaannousuInfo}
            disabled={!enabled || !webGLSupported}
          />

          <Form.Text>
            <Trans
              i18nKey="settings.maannousuInfo.licence"
              components={{ a: <a /> }}
            />
          </Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
