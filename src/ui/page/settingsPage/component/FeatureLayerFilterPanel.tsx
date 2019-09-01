import * as React from "react";
import { MuinaisjaannosTyyppi, MuinaisjaannosAjoitus } from "../../../../data";
import { Panel } from "../../../component/Panel";

interface TypeCheckboxProps {
  type: MuinaisjaannosTyyppi;
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>;
  onSelectType: (layer: MuinaisjaannosTyyppi) => void;
}

const TypeCheckbox: React.FC<TypeCheckboxProps> = ({
  type,
  selectedMuinaisjaannosTypes,
  onSelectType
}) => {
  const isSelected = selectedMuinaisjaannosTypes.includes(type);

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectType(type)}
          checked={isSelected}
        />
        {type}
      </label>
    </div>
  );
};

interface DatingCheckboxProps {
  dating: MuinaisjaannosAjoitus;
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>;
  onSelectDating: (layer: MuinaisjaannosAjoitus) => void;
}

const DatingCheckbox: React.FC<DatingCheckboxProps> = ({
  dating,
  selectedMuinaisjaannosDatings,
  onSelectDating
}) => {
  const isSelected = selectedMuinaisjaannosDatings.includes(dating);

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectDating(dating)}
          checked={isSelected}
        />
        {dating}
      </label>
    </div>
  );
};

interface Props {
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>;
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>;
  onSelectMuinaisjaannosType: (layer: MuinaisjaannosTyyppi) => void;
  onSelectMuinaisjaannosDating: (layer: MuinaisjaannosAjoitus) => void;
}

export const FeatureLayerFilterPanel: React.FC<Props> = ({
  selectedMuinaisjaannosTypes,
  selectedMuinaisjaannosDatings,
  onSelectMuinaisjaannosType,
  onSelectMuinaisjaannosDating
}) => {
  return (
    <Panel title={"Kartalla näkyvät muinaisjäännökset"}>
      <form>
        <div className="well well-sm">
          Rajoitus toimii vain Museoviraston muijaisjäännöksien pisteille (
          <img src="images/muinaisjaannos_kohde.png" /> ja
          <img src="images/muu_kulttuuriperintokohde_kohde.png" />) mutta ei
          alueille (<img src="images/muinaisjaannos_alue.png" /> ja
          <img src="images/muu-kulttuuriperintokohde-alue.png" />
          ). Rajaus ei valitettavasti toimi Ahvenanmaan muinaisjäännöksiin.
        </div>

        <h5>Tyyppi</h5>
        {Object.values(MuinaisjaannosTyyppi).map(type => (
          <TypeCheckbox
            key={type}
            type={type}
            selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
            onSelectType={onSelectMuinaisjaannosType}
          />
        ))}

        <h5>Ajoitus</h5>
        {Object.values(MuinaisjaannosAjoitus).map(dating => (
          <DatingCheckbox
            key={dating}
            dating={dating}
            selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
            onSelectDating={onSelectMuinaisjaannosDating}
          />
        ))}
      </form>
    </Panel>
  );
};
