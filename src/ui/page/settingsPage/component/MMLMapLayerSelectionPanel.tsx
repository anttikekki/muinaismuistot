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
      {t(`settings.backgroundMap.${layer}`)}
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
    <Panel title={t(`settings.backgroundMap.title`)}>
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
    </Panel>
  )
}
