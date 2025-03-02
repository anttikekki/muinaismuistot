import React, { useCallback } from "react"
import { Button, ButtonGroup, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { MaanmittauslaitosLayer } from "../../../../common/layers.types"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { selectVisibleMaanmittauslaitosLayerThunk } from "../../../../store/thunks/maanmittauslaitosLayer"
import { Panel } from "../../../component/Panel"

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
      dispatch(selectVisibleMaanmittauslaitosLayerThunk(layer))
    },
    [dispatch]
  )

  return (
    <Panel title={t(`settings.mml.title`)}>
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
        <Form.Text>{t(`settings.mml.licence`)}</Form.Text>
      </Form>
    </Panel>
  )
}
