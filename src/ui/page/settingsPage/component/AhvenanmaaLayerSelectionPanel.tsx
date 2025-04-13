import React, { useCallback } from "react"
import { Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { AhvenanmaaLayer, LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const AhvenanmaaLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedLayers, enabled, opacity } = useSelector(
    (settings: Settings) => settings.ahvenanmaa
  )
  const onSelectAhvenanmaaLayer = useCallback(
    (layer: AhvenanmaaLayer) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Ahvenanmaa,
        layers: toggleSelection(layer, selectedLayers)
      }),
    [dispatch, selectedLayers]
  )
  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.Ahvenanmaa,
        enabled
      }),
    [dispatch]
  )

  return (
    <Panel
      title={t(`settings.ahvenanmaa.title`)}
      showEnablerSwitch={true}
      enabled={enabled}
      onSwitchChange={() => onSwitchChange(!enabled)}
    >
      <Form>
        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan muinaisjäännösrekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <Form.Group className="mb-3">
          <LayerCheckbox
            label={t(`common.features.Kohde`)}
            layer={AhvenanmaaLayer.Fornminnen}
            selectedLayers={selectedLayers}
            onSelectLayer={onSelectAhvenanmaaLayer}
            disabled={!enabled}
          />
        </Form.Group>

        <h6>
          <Trans
            i18nKey={`data.register.nameWithLink.Ahvenanmaan merellinen kulttuuriperintörekisteri`}
            components={{ a: <a /> }}
          />
        </h6>
        <Form.Group className="mb-3">
          <LayerCheckbox
            label={t(`common.features.Kohde`)}
            layer={AhvenanmaaLayer.MaritimaFornminnen}
            selectedLayers={selectedLayers}
            onSelectLayer={onSelectAhvenanmaaLayer}
            disabled={!enabled}
          />
        </Form.Group>

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.Ahvenanmaa}
          disabled={!enabled}
        />

        <Form.Text>
          <Trans
            i18nKey="settings.ahvenanmaa.licence"
            components={{ a: <a /> }}
          />
        </Form.Text>
      </Form>
    </Panel>
  )
}
