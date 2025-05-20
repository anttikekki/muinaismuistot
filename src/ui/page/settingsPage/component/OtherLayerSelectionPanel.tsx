import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  LayerGroup,
  MaisemanMuistiLayer,
  ModelLayer
} from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"

export const OtherLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const selectedModelLayers = useSelector(
    (settings: Settings) => settings.models.selectedLayers
  )
  const selectedMaisemanMuistiLayers = useSelector(
    (settings: Settings) => settings.maisemanMuisti.selectedLayers
  )
  const onSelectModelLayer = useCallback(
    (layer: ModelLayer) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Models,
        layers: toggleSelection(layer, selectedModelLayers)
      }),
    [dispatch, selectedModelLayers]
  )
  const onSelectMaisemanMuistiLayer = useCallback(
    (layer: MaisemanMuistiLayer) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.MaisemanMuisti,
        layers: toggleSelection(layer, selectedMaisemanMuistiLayers)
      }),
    [dispatch, selectedMaisemanMuistiLayers]
  )

  return (
    <Accordion.Item eventKey={LayerGroup.Models}>
      <Accordion.Header as="div">{t(`settings.other.title`)}</Accordion.Header>
      <Accordion.Body>
        <Form>
          <h6>
            <Trans
              i18nKey="data.register.nameWithLink.3Dmodels"
              components={{ a: <a /> }}
            />
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(`common.features.3D-malli`)}
              layer={ModelLayer.ModelLayer}
              selectedLayers={selectedModelLayers}
              onSelectLayer={onSelectModelLayer}
            />
          </Form.Group>

          <h6>
            <Trans
              i18nKey="data.register.nameWithLink.maisemanMuisti"
              components={{ a: <a /> }}
            />
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(
                `common.features.Valtakunnallisesti merkittävä muinaisjäännös`
              )}
              layer={MaisemanMuistiLayer.MaisemanMuisti}
              selectedLayers={selectedMaisemanMuistiLayers}
              onSelectLayer={onSelectMaisemanMuistiLayer}
            />
          </Form.Group>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
