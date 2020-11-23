import * as React from "react"
import {
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus
} from "../../../../common/types"
import { Panel } from "../../../component/Panel"

interface TypeToggleAllCheckboxProps {
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
  onSelectTypes: (types: Array<MuinaisjaannosTyyppi>) => void
}

const TypeToggleAllCheckbox: React.FC<TypeToggleAllCheckboxProps> = ({
  selectedMuinaisjaannosTypes,
  onSelectTypes
}) => {
  const allTypes = React.useMemo(() => Object.values(MuinaisjaannosTyyppi), [])
  const isAllSelected = Object.values(allTypes).every((v) =>
    selectedMuinaisjaannosTypes.includes(v)
  )

  return (
    <h5>
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectTypes(isAllSelected ? [] : allTypes)}
          checked={isAllSelected}
        />{" "}
        Tyyppi
      </label>
    </h5>
  )
}

interface TypeCheckboxProps {
  type: MuinaisjaannosTyyppi
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
  onSelectType: (type: MuinaisjaannosTyyppi) => void
}

const TypeCheckbox: React.FC<TypeCheckboxProps> = ({
  type,
  selectedMuinaisjaannosTypes,
  onSelectType
}) => {
  const isSelected = selectedMuinaisjaannosTypes.includes(type)

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
  )
}

interface DatingToggleAllCheckboxProps {
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
  onSelectDatings: (dating: Array<MuinaisjaannosAjoitus>) => void
}

const DatingToggleAllCheckbox: React.FC<DatingToggleAllCheckboxProps> = ({
  selectedMuinaisjaannosDatings,
  onSelectDatings
}) => {
  const allDatings = React.useMemo(
    () => Object.values(MuinaisjaannosAjoitus),
    []
  )
  const isAllSelected = Object.values(allDatings).every((v) =>
    selectedMuinaisjaannosDatings.includes(v)
  )

  return (
    <h5>
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectDatings(isAllSelected ? [] : allDatings)}
          checked={isAllSelected}
        />{" "}
        Ajoitus
      </label>
    </h5>
  )
}

interface DatingCheckboxProps {
  dating: MuinaisjaannosAjoitus
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
  onSelectDating: (dating: MuinaisjaannosAjoitus) => void
}

const DatingCheckbox: React.FC<DatingCheckboxProps> = ({
  dating,
  selectedMuinaisjaannosDatings,
  onSelectDating
}) => {
  const isSelected = selectedMuinaisjaannosDatings.includes(dating)

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectDating(dating)}
          checked={isSelected}
        />{" "}
        {dating}
      </label>
    </div>
  )
}

interface Props {
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
  onSelectMuinaisjaannosType: (
    layer: MuinaisjaannosTyyppi | Array<MuinaisjaannosTyyppi>
  ) => void
  onSelectMuinaisjaannosDating: (
    layer: MuinaisjaannosAjoitus | Array<MuinaisjaannosAjoitus>
  ) => void
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

        <TypeToggleAllCheckbox
          selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
          onSelectTypes={onSelectMuinaisjaannosType}
        />
        {Object.values(MuinaisjaannosTyyppi).map((type) => (
          <TypeCheckbox
            key={type}
            type={type}
            selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
            onSelectType={onSelectMuinaisjaannosType}
          />
        ))}

        <br />

        <DatingToggleAllCheckbox
          selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
          onSelectDatings={onSelectMuinaisjaannosDating}
        />
        {Object.values(MuinaisjaannosAjoitus).map((dating) => (
          <DatingCheckbox
            key={dating}
            dating={dating}
            selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
            onSelectDating={onSelectMuinaisjaannosDating}
          />
        ))}
      </form>
    </Panel>
  )
}
