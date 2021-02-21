import * as React from "react"
import { useTranslation } from "react-i18next"
import { MaanmittauslaitosLayer } from "../../../../common/types"
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

interface Props {
  selectedLayer: MaanmittauslaitosLayer
  onSelectLayer: (layer: MaanmittauslaitosLayer) => void
}

export const MMLMapLayerSelectionPanel: React.FC<Props> = ({
  selectedLayer,
  onSelectLayer
}) => {
  const { t } = useTranslation()
  return (
    <Panel title={t(`settings.mml.title`)}>
      <form>
        <div className="form-group">
          <div className="btn-group" data-toggle="buttons">
            {Object.values(MaanmittauslaitosLayer).map((l) => (
              <LayerButton
                key={l}
                layer={l}
                selectedLayer={selectedLayer}
                onSelectLayer={onSelectLayer}
              />
            ))}
          </div>
        </div>
        <small className="pull-right">{t(`settings.mml.licence`)}</small>
      </form>
    </Panel>
  )
}
