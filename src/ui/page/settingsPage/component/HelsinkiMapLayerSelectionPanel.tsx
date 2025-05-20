import React, { useCallback, useMemo } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { HelsinkiLayer, LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { ToggleAllCheckbox } from "../../../component/ToggleAllCheckbox"
import { toggleSelection } from "../../../util"
import { FeatureImageAndLabel } from "./FeatureImageAndLabel"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

const FeatureLabelsForLayer: React.FC<{ layer: HelsinkiLayer }> = ({
  layer
}) => {
  const { t } = useTranslation()
  switch (layer) {
    case HelsinkiLayer.Maalinnoitus_kohteet:
      return (
        <>
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-asema.png"
            label={t(`data.helsinki.feature.asema`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-luola.png"
            label={t(`data.helsinki.feature.luola`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-tykkitie.png"
            label={t(`data.helsinki.feature.tykkitie`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-tykkipatteri.png"
            label={t(`data.helsinki.feature.tykkipatteri`)}
          />
        </>
      )
    case HelsinkiLayer.Maalinnoitus_rajaukset:
      return (
        <>
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-puolustusaseman-raja.png"
            label={t(`data.helsinki.feature.puolustusasemanRaja`)}
          />
          <FeatureImageAndLabel
            iconPath="images/maalinnoitus-tukikohdan-raja.png"
            label={t(`data.helsinki.feature.tukikohdanRaja`)}
          />
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
