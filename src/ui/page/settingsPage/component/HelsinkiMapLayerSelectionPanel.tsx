import React, { useCallback, useMemo } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { HelsinkiLayer, LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { ToggleAllCheckbox } from "../../../component/ToggleAllCheckbox"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"
import { MaalinnoitusFeatureIcon } from "../../../component/feature/component/Icon"
import {
  MaalinnoitusKohdetyyppi,
  MaalinnoitusRajaustyyppi
} from "../../../../common/maalinnoitusHelsinki.types"

const FeatureLabelsForLayer: React.FC<{ layer: HelsinkiLayer }> = ({
  layer
}) => {
  const { t } = useTranslation()
  switch (layer) {
    case HelsinkiLayer.Maalinnoitus_kohteet:
      return (
        <>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Asema}
            />
            <span>{t(`data.helsinki.feature.asema`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Luola}
            />
            <span>{t(`data.helsinki.feature.luola`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Tykkitie}
            />
            <span>{t(`data.helsinki.feature.tykkitie`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_kohteet}
              type={MaalinnoitusKohdetyyppi.Tykkipatteri}
            />
            <span>{t(`data.helsinki.feature.tykkipatteri`)}</span>
          </div>
        </>
      )
    case HelsinkiLayer.Maalinnoitus_rajaukset:
      return (
        <>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_rajaukset}
              type={MaalinnoitusRajaustyyppi.Tukikohta}
            />
            <span>{t(`data.helsinki.feature.puolustusasemanRaja`)}</span>
          </div>
          <div className="ms-3">
            <MaalinnoitusFeatureIcon
              layer={HelsinkiLayer.Maalinnoitus_rajaukset}
              type={MaalinnoitusRajaustyyppi.Puolustusasema}
            />
            <span>{t(`data.helsinki.feature.tukikohdanRaja`)}</span>
          </div>
        </>
      )
    default:
      return null
  }
}

export const HelsinkiMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedLayers, enabled, opacity } = useSelector(
    (settings: Settings) => settings.helsinki
  )
  const onSelectLayer = useCallback(
    (layer: HelsinkiLayer) => {
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Helsinki,
        layers: toggleSelection(layer, selectedLayers)
      })
    },
    [dispatch, selectedLayers]
  )
  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.Helsinki,
        enabled
      }),
    [dispatch]
  )
  const onToggleAllLayers = useCallback(
    (layers: HelsinkiLayer[]) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Helsinki,
        layers
      }),
    [dispatch]
  )
  const checkboxes = useMemo(
    () =>
      Object.values(HelsinkiLayer)
        .sort((a, b) =>
          t(`data.helsinki.layer.${a}`).localeCompare(
            t(`data.helsinki.layer.${b}`)
          )
        )
        .map((layer) => (
          <LayerCheckbox
            key={layer}
            label={t(`data.helsinki.layer.${layer}`)}
            layer={layer}
            selectedLayers={selectedLayers}
            onSelectLayer={onSelectLayer}
            showIcon={false}
            disabled={!enabled}
          >
            <FeatureLabelsForLayer layer={layer} />
          </LayerCheckbox>
        )),
    [selectedLayers, onSelectLayer, enabled]
  )

  const title = t(`settings.helsinki.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.Helsinki}>
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
            <ToggleAllCheckbox
              allValues={Object.values(HelsinkiLayer)}
              selectedValues={selectedLayers}
              onSelectValues={onToggleAllLayers}
              disabled={!enabled}
            >
              <Trans
                i18nKey={`data.register.nameWithLink.maalinnoitus`}
                components={{ a: <a /> }}
              />
            </ToggleAllCheckbox>
          </h6>
          <Form.Group className="mb-3">{checkboxes}</Form.Group>

          <LayerTransparencyInput
            opacity={opacity}
            layerGroup={LayerGroup.Helsinki}
            disabled={!enabled}
          />

          <Form.Text>
            <Trans
              i18nKey="settings.helsinki.licence"
              components={{ a: <a /> }}
            />
          </Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
