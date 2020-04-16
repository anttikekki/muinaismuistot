import * as React from "react";
import {
  MaanmittauslaitosLayer,
  MuseovirastoLayer,
} from "../../../../common/types";
import { Panel } from "../../../component/Panel";
import { getLayerIconURLs } from "../../../../common/util/featureParser";

interface LayerCheckboxProps {
  label: string;
  layer: MuseovirastoLayer;
  selectedLayers: Array<MuseovirastoLayer>;
  onSelectLayer: (layer: MuseovirastoLayer) => void;
}

const LayerCheckbox: React.FC<LayerCheckboxProps> = ({
  label,
  layer,
  selectedLayers,
  onSelectLayer,
}) => {
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
  selectedLayers: Array<MuseovirastoLayer>;
  onSelectLayer: (layer: MuseovirastoLayer) => void;
}

export const FeatureLayerSelectionPanel: React.FC<Props> = ({
  selectedLayers,
  onSelectLayer,
}) => {
  const commonProps = { selectedLayers, onSelectLayer };

  return (
    <Panel title={"Kartalla näkyvät kohteet"}>
      <form>
        <h5>Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt</h5>
        <LayerCheckbox
          label="Alueet"
          layer={MuseovirastoLayer.RKY_alue}
          {...commonProps}
        />
        <LayerCheckbox
          label="Viivat (esim. tie)"
          layer={MuseovirastoLayer.RKY_viiva}
          {...commonProps}
        />
        <LayerCheckbox
          label="Pisteet"
          layer={MuseovirastoLayer.RKY_piste}
          {...commonProps}
        />

        <h5>Maailmanperintökohteet</h5>
        <LayerCheckbox
          label="Alueet"
          layer={MuseovirastoLayer.Maailmanperintö_alue}
          {...commonProps}
        />
        <LayerCheckbox
          label="Pisteet"
          layer={MuseovirastoLayer.Maailmanperintö_piste}
          {...commonProps}
        />

        <h5>Rakennusperintörekisteri</h5>
        <LayerCheckbox
          label="Rakennetut alueet"
          layer={MuseovirastoLayer.Suojellut_rakennukset_alue}
          {...commonProps}
        />
        <LayerCheckbox
          label="Rakennukset"
          layer={MuseovirastoLayer.Suojellut_rakennukset_piste}
          {...commonProps}
        />

        <h5>Museoviraston muinaisjäännösrekisteri</h5>
        <LayerCheckbox
          label="Alueet"
          layer={MuseovirastoLayer.Muinaisjäännökset_alue}
          {...commonProps}
        />
        <LayerCheckbox
          label="Pisteet"
          layer={MuseovirastoLayer.Muinaisjäännökset_piste}
          {...commonProps}
        />

        <h5>Ahvenamaan muinaisjäännösrekisteri</h5>
        <div className="checkbox sub-layer-select-checkbox-container">
          <label>
            <input type="checkbox" value="" checked disabled />
            <img src="images/ahvenanmaa_muinaisjaannos.png" /> Kohde
          </label>
        </div>

        <h5>
          3D-mallit (
          <a href="./3d/" target="_blank">
            lisätietoa
          </a>
          )
        </h5>
        <div className="checkbox sub-layer-select-checkbox-container">
          <label>
            <input type="checkbox" value="" checked disabled />
            <img src="images/3d_malli.png" /> 3D-mallit
          </label>
        </div>
      </form>
    </Panel>
  );
};
