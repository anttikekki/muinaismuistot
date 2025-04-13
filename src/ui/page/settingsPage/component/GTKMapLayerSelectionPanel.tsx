import React, { useCallback } from "react"
import { Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { GtkLayer, LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"
import { FeatureImageAndLabel } from "./FeatureImageAndLabel"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const GTKMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedLayers, enabled, opacity } = useSelector(
    (settings: Settings) => settings.gtk
  )
  const onSelectLayer = useCallback(
    (layer: GtkLayer) => {
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.GTK,
        layers: toggleSelection(layer, selectedLayers)
      })
    },
    [dispatch, selectedLayers]
  )
  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.GTK,
        enabled
      }),
    [dispatch]
  )

  return (
    <Panel
      title={t(`settings.gtk.title`)}
      showEnablerSwitch={true}
      enabled={enabled}
      onSwitchChange={() => onSwitchChange(!enabled)}
    >
      <Form>
        <h6>
          <Form.Check
            type="checkbox"
            id="muinaisrannat"
            onChange={() => onSelectLayer(GtkLayer.muinaisrannat)}
            checked={selectedLayers.includes(GtkLayer.muinaisrannat)}
            disabled={!enabled}
            label={
              <Trans
                i18nKey={`data.gtk.layer.${GtkLayer.muinaisrannat}`}
                components={{ a: <a /> }}
              />
            }
          />
        </h6>

        <Form.Group className="mb-3">
          <FeatureImageAndLabel
            iconPath="images/muinaisrannat_supra_akvaattinen.png"
            label={t(`data.gtk.feature.supra-akvaattinen`)}
          />
          <FeatureImageAndLabel
            iconPath="images/muinaisrannat_yoldia.png"
            label={t(`data.gtk.feature.yoldia`)}
          />
          <FeatureImageAndLabel
            iconPath="images/muinaisrannat_litorina.png"
            label={t(`data.gtk.feature.litorina`)}
          />
        </Form.Group>

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.GTK}
          disabled={!enabled}
        />

        <Form.Text>{t(`settings.gtk.licence`)}</Form.Text>
      </Form>
    </Panel>
  )
}
