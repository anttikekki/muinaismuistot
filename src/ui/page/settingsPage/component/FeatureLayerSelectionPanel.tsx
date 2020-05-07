import * as React from "react";
import {
  MuseovirastoLayer,
  FeatureLayer,
  AhvenanmaaLayer,
  ModelLayer,
} from "../../../../common/types";
import { Panel } from "../../../component/Panel";
import { getLayerIconURLs } from "../../../../common/util/featureParser";

interface LayerCheckboxProps<T extends FeatureLayer> {
  label: string;
  layer: T;
  selectedLayers: Array<T>;
  onSelectLayer: (layer: T) => void;
}

const LayerCheckbox = <T extends FeatureLayer>(
  props: LayerCheckboxProps<T>
) => {
  const { label, layer, selectedLayers, onSelectLayer } = props;
  const isSelected = selectedLayers.includes(layer);

  return (
    <div className="checkbox sub-layer-select-checkbox-container">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectLayer(layer)}
          checked={isSelected}
        />
        {getLayerIconURLs(layer).map((url, index) => (
          <img className="feature-icon" key={index} src={url} />
        ))}

        <span>{label}</span>
      </label>
    </div>
  );
};

interface Props {
  selectedMuseovirastoLayers: Array<MuseovirastoLayer>;
  selectedAhvenanmaaLayers: Array<AhvenanmaaLayer>;
  selectedModelLayers: Array<ModelLayer>;
  onSelectMuseovirastoLayer: (layer: MuseovirastoLayer) => void;
  onSelectAhvenanmaaLayer: (layer: AhvenanmaaLayer) => void;
  onSelectModelLayer: (layer: ModelLayer) => void;
}

export const FeatureLayerSelectionPanel: React.FC<Props> = ({
  selectedMuseovirastoLayers,
  selectedAhvenanmaaLayers,
  selectedModelLayers,
  onSelectMuseovirastoLayer,
  onSelectAhvenanmaaLayer,
  onSelectModelLayer,
}) => {
  return (
    <Panel title={"Kartalla näkyvät kohteet"}>
      <form>
        <h5>Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt</h5>
        <LayerCheckbox
          label="Alueet"
          layer={MuseovirastoLayer.RKY_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label="Viivat (esim. tie)"
          layer={MuseovirastoLayer.RKY_viiva}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label="Pisteet"
          layer={MuseovirastoLayer.RKY_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>Maailmanperintökohteet</h5>
        <LayerCheckbox
          label="Alueet"
          layer={MuseovirastoLayer.Maailmanperinto_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label="Pisteet"
          layer={MuseovirastoLayer.Maailmanperinto_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>Rakennusperintörekisteri</h5>
        <LayerCheckbox
          label="Rakennetut alueet"
          layer={MuseovirastoLayer.Suojellut_rakennukset_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label="Rakennukset"
          layer={MuseovirastoLayer.Suojellut_rakennukset_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>Museoviraston muinaisjäännösrekisteri</h5>
        <LayerCheckbox
          label="Alueet"
          layer={MuseovirastoLayer.Muinaisjaannokset_alue}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />
        <LayerCheckbox
          label="Pisteet"
          layer={MuseovirastoLayer.Muinaisjaannokset_piste}
          selectedLayers={selectedMuseovirastoLayers}
          onSelectLayer={onSelectMuseovirastoLayer}
        />

        <h5>Ahvenamaan muinaisjäännösrekisteri</h5>
        <LayerCheckbox
          label="Kohde"
          layer={AhvenanmaaLayer.Fornminnen}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />

        <h5>Ahvenamaan merellisen kulttuuriperinnön rekisteri</h5>
        <LayerCheckbox
          label="Kohde"
          layer={AhvenanmaaLayer.MaritimtKulturarv}
          selectedLayers={selectedAhvenanmaaLayers}
          onSelectLayer={onSelectAhvenanmaaLayer}
        />

        <h5>
          3D-mallit (
          <a href="./3d/" target="_blank">
            lisätietoa
          </a>
          )
        </h5>
        <LayerCheckbox
          label="3D-mallit"
          layer={ModelLayer.ModelLayer}
          selectedLayers={selectedModelLayers}
          onSelectLayer={onSelectModelLayer}
        />
      </form>
    </Panel>
  );
};
