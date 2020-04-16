import * as React from "react";
import { MaanmittauslaitosLayer } from "../../../../common/types";
import { Panel } from "../../../component/Panel";

interface LayerButtonProps {
  layer: MaanmittauslaitosLayer;
  selectedLayer: MaanmittauslaitosLayer;
  onSelectLayer: (layer: MaanmittauslaitosLayer) => void;
}

const LayerButton: React.FC<LayerButtonProps> = ({
  layer,
  selectedLayer,
  onSelectLayer
}) => {
  const isSelected = layer === selectedLayer;
  return (
    <label className={`btn btn-default ${isSelected ? "active" : ""}`}>
      <input
        type="radio"
        name="selectedMapLayer"
        checked={isSelected}
        onChange={() => onSelectLayer(layer)}
      />
      {layer}
    </label>
  );
};

interface Props {
  selectedLayer: MaanmittauslaitosLayer;
  onSelectLayer: (layer: MaanmittauslaitosLayer) => void;
}

export const MMLMapLayerSelectionPanel: React.FC<Props> = ({
  selectedLayer,
  onSelectLayer
}) => {
  return (
    <Panel title={"Karttapohja"}>
      <div className="btn-group" data-toggle="buttons">
        {Object.values(MaanmittauslaitosLayer).map(l => (
          <LayerButton
            key={l}
            layer={l}
            selectedLayer={selectedLayer}
            onSelectLayer={onSelectLayer}
          />
        ))}
      </div>
    </Panel>
  );
};
