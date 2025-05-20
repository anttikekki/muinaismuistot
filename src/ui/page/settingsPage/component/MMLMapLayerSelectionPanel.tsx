import React, { useCallback } from "react"
import { Accordion, Button, ButtonGroup, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  LayerGroup,
  MaanmittauslaitosLayer
} from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"

interface MLLLayerButtonProps {
  layer: MaanmittauslaitosLayer
  selectedLayer: MaanmittauslaitosLayer
  onSelectLayer: (layer: MaanmittauslaitosLayer) => void
}

const MMLLayerButton: React.FC<MLLLayerButtonProps> = ({
  layer,
  selectedLayer,
  onSelectLayer
}) => {
  const { t } = useTranslation()
  const isSelected = layer === selectedLayer
  return (
    <Button
      variant="outline-dark"
      size="sm"
      active={isSelected}
      onClick={() => onSelectLayer(layer)}
    >
      {t(`settings.mml.${layer}`)}
    </Button>
  )
}

export const MMLMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const selectedLayer = useSelector(
    (settings: Settings) => settings.maanmittauslaitos.selectedLayer
  )
  const onSelectLayer = useCallback(
    (layer: MaanmittauslaitosLayer) => {
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Maanmittauslaitos,
        layer
      })
    },
    [dispatch]
  )

  return (
    <Accordion.Item eventKey={LayerGroup.Maanmittauslaitos}>
      <Accordion.Header as="div">{t(`settings.mml.title`)}</Accordion.Header>
      <Accordion.Body>
        <Form>
          <div>
            <ButtonGroup aria-label={t(`settings.mml.title`)}>
              {Object.values(MaanmittauslaitosLayer).map((l) => (
                <MMLLayerButton
                  key={l}
                  layer={l}
                  selectedLayer={selectedLayer}
                  onSelectLayer={onSelectLayer}
                />
              ))}
            </ButtonGroup>
          </div>
          <Form.Text>
            <Trans i18nKey="settings.mml.licence" components={{ a: <a /> }} />
          </Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
