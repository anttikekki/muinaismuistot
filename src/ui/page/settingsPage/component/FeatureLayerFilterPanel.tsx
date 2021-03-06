import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import regexifyString from "regexify-string"
import {
  MuinaisjaannosTyyppi,
  MuinaisjaannosAjoitus
} from "../../../../common/types"
import {
  selectMuinaisjaannosDating,
  selectMuinaisjaannosType
} from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"

interface TypeToggleAllCheckboxProps {
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
  onSelectTypes: (types: Array<MuinaisjaannosTyyppi>) => void
}

const TypeToggleAllCheckbox: React.FC<TypeToggleAllCheckboxProps> = ({
  selectedMuinaisjaannosTypes,
  onSelectTypes
}) => {
  const { t } = useTranslation()
  const allTypes = useMemo(() => Object.values(MuinaisjaannosTyyppi), [])
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
        {t(`settings.filters.type`)}
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
  const { t } = useTranslation()
  const isSelected = selectedMuinaisjaannosTypes.includes(type)

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectType(type)}
          checked={isSelected}
        />
        {t(`data.museovirasto.type.${type}`)}
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
  const { t } = useTranslation()
  const allDatings = useMemo(() => Object.values(MuinaisjaannosAjoitus), [])
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
        {t(`settings.filters.dating`)}
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
  const { t } = useTranslation()
  const isSelected = selectedMuinaisjaannosDatings.includes(dating)

  return (
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          onChange={() => onSelectDating(dating)}
          checked={isSelected}
        />{" "}
        {t(`data.museovirasto.dating.${dating}`)}
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

export const FeatureLayerFilterPanel: React.FC = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()

  const selectedMuinaisjaannosTypes = useSelector(
    (settings: Settings) => settings.museovirasto.selectedMuinaisjaannosTypes
  )
  const selectedMuinaisjaannosDatings = useSelector(
    (settings: Settings) => settings.museovirasto.selectedMuinaisjaannosDatings
  )
  const onSelectMuinaisjaannosType = useCallback(
    (type: MuinaisjaannosTyyppi) =>
      dispatch(
        selectMuinaisjaannosType(
          toggleSelection(type, selectedMuinaisjaannosTypes)
        )
      ),
    [dispatch, selectedMuinaisjaannosTypes]
  )
  const onToggleAllMuinaisjaannosTypes = useCallback(
    (types: Array<MuinaisjaannosTyyppi>) =>
      dispatch(selectMuinaisjaannosType(types)),
    [dispatch]
  )
  const onSelectMuinaisjaannosDating = useCallback(
    (dating: MuinaisjaannosAjoitus) =>
      dispatch(
        selectMuinaisjaannosDating(
          toggleSelection(dating, selectedMuinaisjaannosDatings)
        )
      ),
    [dispatch, selectedMuinaisjaannosDatings]
  )
  const onToggleAllMuinaisjaannosDatings = useCallback(
    (types: Array<MuinaisjaannosAjoitus>) =>
      dispatch(selectMuinaisjaannosDating(types)),
    [dispatch]
  )

  const infoText = useMemo(
    () =>
      regexifyString({
        pattern: /PISTE_ICONS|ALUE_ICONS/gm,
        decorator: (match) => {
          if (match === "PISTE_ICONS") {
            return (
              <React.Fragment key={match}>
                <img src="images/muinaisjaannos_kohde.png" />
                <img src="images/muu_kulttuuriperintokohde_kohde.png" />
              </React.Fragment>
            )
          }
          if (match === "ALUE_ICONS") {
            return (
              <React.Fragment key={match}>
                <img src="images/muinaisjaannos_alue.png" />
                <img src="images/muu-kulttuuriperintokohde-alue.png" />
              </React.Fragment>
            )
          }
          return ""
        },
        input: t(`settings.filters.info`)
      }),
    [i18n.language]
  )

  const typeCheckboxes = useMemo(
    () =>
      Object.values(MuinaisjaannosTyyppi).map((type) => (
        <TypeCheckbox
          key={type}
          type={type}
          selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
          onSelectType={onSelectMuinaisjaannosType}
        />
      )),
    [selectedMuinaisjaannosTypes, i18n.language]
  )

  const datingCheckboxes = useMemo(
    () =>
      Object.values(MuinaisjaannosAjoitus).map((dating) => (
        <DatingCheckbox
          key={dating}
          dating={dating}
          selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
          onSelectDating={onSelectMuinaisjaannosDating}
        />
      )),
    [selectedMuinaisjaannosDatings, i18n.language]
  )

  return (
    <Panel title={t(`settings.filters.title`)}>
      <form>
        <div className="well well-sm">{infoText}</div>

        <TypeToggleAllCheckbox
          selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
          onSelectTypes={onToggleAllMuinaisjaannosTypes}
        />
        {typeCheckboxes}

        <br />

        <DatingToggleAllCheckbox
          selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
          onSelectDatings={onToggleAllMuinaisjaannosDatings}
        />
        {datingCheckboxes}
      </form>
    </Panel>
  )
}
