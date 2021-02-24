import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { MaanmittauslaitosLayer } from "../../../../common/types"
import { selectMaanmittauslaitosLayer } from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"

interface LayerButtonProps {
  layer: MaanmittauslaitosLayer
  selectedLayer: MaanmittauslaitosLayer
  onSelectLayer: (layer: MaanmittauslaitosLayer) => void
}

const LayerButton: React.FC<LayerButtonProps> = ({
  layer,
  selectedLayer,
  onSelectLayer
}) => {
  const { t } = useTranslation()
  const isSelected = layer === selectedLayer
  return (
    <label className={`btn btn-default ${isSelected ? "active" : ""}`}>
      <input
        type="radio"
        name="selectedMapLayer"
        checked={isSelected}
        onChange={() => onSelectLayer(layer)}
      />
      {t(`settings.mml.${layer}`)}
    </label>
  )
}

export const MMLMapLayerSelectionPanel: React.FC = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayer = useSelector(
    (settings: Settings) => settings.maanmittauslaitos.selectedLayer
  )
  const onSelectLayer = useCallback(
    (layer: MaanmittauslaitosLayer) => {
      dispatch(selectMaanmittauslaitosLayer(layer))
    },
    [dispatch]
  )
  const buttons = useMemo(() => {
    return Object.values(MaanmittauslaitosLayer).map((l) => (
      <LayerButton
        key={l}
        layer={l}
        selectedLayer={selectedLayer}
        onSelectLayer={onSelectLayer}
      />
    ))
  }, [selectedLayer, onSelectLayer, i18n.language])

  return (
    <Panel title={t(`settings.mml.title`)}>
      <form>
        <div className="form-group">
          <div className="btn-group" data-toggle="buttons">
            {buttons}
          </div>
        </div>
        <small className="pull-right">{t(`settings.mml.licence`)}</small>
      </form>
    </Panel>
  )
}
