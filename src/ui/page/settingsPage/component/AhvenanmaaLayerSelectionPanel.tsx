import React, { useCallback } from "react"
import { Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { AhvenanmaaLayer, LayerGroup } from "../../../../common/layers.types"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { selectVisibleAhvenanmaaLayerThunk } from "../../../../store/thunks/ahvenanmaaLayer"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const AhvenanmaaLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const selectedAhvenanmaaLayers = useSelector(
    (settings: Settings) => settings.ahvenanmaa.selectedLayers
  )
  const opacity = useSelector(
    (settings: Settings) => settings.ahvenanmaa.opacity
  )
  const onSelectAhvenanmaaLayer = useCallback(
    (layer: AhvenanmaaLayer) =>
      dispatch(
        selectVisibleAhvenanmaaLayerThunk(
          toggleSelection(layer, selectedAhvenanmaaLayers)
        )
      ),
    [dispatch, selectedAhvenanmaaLayers]
  )

  return (
    <Panel title={t(`settings.ahvenanmaa.title`)}>
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
            selectedLayers={selectedAhvenanmaaLayers}
            onSelectLayer={onSelectAhvenanmaaLayer}
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
            selectedLayers={selectedAhvenanmaaLayers}
            onSelectLayer={onSelectAhvenanmaaLayer}
          />
        </Form.Group>

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.Ahvenanmaa}
        />

        <Form.Text>{t(`settings.ahvenanmaa.licence`)}</Form.Text>
      </Form>
    </Panel>
  )
}
