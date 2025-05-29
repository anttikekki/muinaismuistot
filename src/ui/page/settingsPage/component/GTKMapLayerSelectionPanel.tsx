import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { GtkLayer, LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
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

  const title = t(`settings.gtk.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.GTK}>
      <Accordion.Header as="div">
        <Form.Check
          type="switch"
          id={title}
          checked={enabled}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onSwitchChange(!enabled)}
        />
        {title}
      </Accordion.Header>
      <Accordion.Body>
        <Form>
          <h6>
            <Trans
              i18nKey={`data.gtk.layer.${GtkLayer.muinaisrannat}`}
              components={{ a: <a /> }}
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
      </Accordion.Body>
    </Accordion.Item>
  )
}
