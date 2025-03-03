import React, { useCallback, useMemo } from "react"
import { Alert, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import regexifyString from "regexify-string"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../../../../common/museovirasto.types"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import {
  selectVisibleMuinaisjäännösDatingThunk,
  selectVisibleMuinaisjäännösTypeThunk
} from "../../../../store/thunks/museovirastoLayer"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"

interface TypeToggleAllCheckboxProps {
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
  onSelectTypes: (types: Array<MuinaisjaannosTyyppi>) => void
  disabled?: boolean
}

const TypeToggleAllCheckbox: React.FC<TypeToggleAllCheckboxProps> = ({
  selectedMuinaisjaannosTypes,
  onSelectTypes,
  disabled
}) => {
  const { t } = useTranslation()
  const allTypes = useMemo(() => Object.values(MuinaisjaannosTyyppi), [])
  const isAllSelected = Object.values(allTypes).every((v) =>
    selectedMuinaisjaannosTypes.includes(v)
  )
  return (
    <h6>
      <Form.Check
        type="checkbox"
        id={t(`settings.filters.type`)}
        onChange={() => onSelectTypes(isAllSelected ? [] : allTypes)}
        checked={isAllSelected}
        disabled={disabled}
        label={t(`settings.filters.type`)}
      />
    </h6>
  )
}

interface TypeCheckboxProps {
  type: MuinaisjaannosTyyppi
  selectedMuinaisjaannosTypes: Array<MuinaisjaannosTyyppi>
  onSelectType: (type: MuinaisjaannosTyyppi) => void
  disabled?: boolean
}

const TypeCheckbox: React.FC<TypeCheckboxProps> = ({
  type,
  selectedMuinaisjaannosTypes,
  onSelectType,
  disabled
}) => {
  const { t } = useTranslation()
  const isSelected = selectedMuinaisjaannosTypes.includes(type)

  return (
    <Form.Check
      type="checkbox"
      className="ms-3"
      id={t(`data.museovirasto.type.${type}`)}
      onChange={() => onSelectType(type)}
      checked={isSelected}
      disabled={disabled}
      label={t(`data.museovirasto.type.${type}`)}
    />
  )
}

interface DatingToggleAllCheckboxProps {
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
  onSelectDatings: (dating: Array<MuinaisjaannosAjoitus>) => void
  disabled?: boolean
}

const DatingToggleAllCheckbox: React.FC<DatingToggleAllCheckboxProps> = ({
  selectedMuinaisjaannosDatings,
  onSelectDatings,
  disabled
}) => {
  const { t } = useTranslation()
  const allDatings = useMemo(() => Object.values(MuinaisjaannosAjoitus), [])
  const isAllSelected = Object.values(allDatings).every((v) =>
    selectedMuinaisjaannosDatings.includes(v)
  )

  return (
    <h6>
      <Form.Check
        type="checkbox"
        id={t(`settings.filters.dating`)}
        onChange={() => onSelectDatings(isAllSelected ? [] : allDatings)}
        checked={isAllSelected}
        disabled={disabled}
        label={t(`settings.filters.dating`)}
      />
    </h6>
  )
}

interface DatingCheckboxProps {
  dating: MuinaisjaannosAjoitus
  selectedMuinaisjaannosDatings: Array<MuinaisjaannosAjoitus>
  onSelectDating: (dating: MuinaisjaannosAjoitus) => void
  disabled?: boolean
}

const DatingCheckbox: React.FC<DatingCheckboxProps> = ({
  dating,
  selectedMuinaisjaannosDatings,
  onSelectDating,
  disabled
}) => {
  const { t } = useTranslation()
  const isSelected = selectedMuinaisjaannosDatings.includes(dating)

  return (
    <Form.Check
      type="checkbox"
      className="ms-3"
      id={t(`data.museovirasto.dating.${dating}`)}
      onChange={() => onSelectDating(dating)}
      checked={isSelected}
      disabled={disabled}
      label={t(`data.museovirasto.dating.${dating}`)}
    />
  )
}

export const FeatureLayerFilterPanel: React.FC = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const selectedMuinaisjaannosTypes = useSelector(
    (settings: Settings) => settings.museovirasto.selectedMuinaisjaannosTypes
  )
  const selectedMuinaisjaannosDatings = useSelector(
    (settings: Settings) => settings.museovirasto.selectedMuinaisjaannosDatings
  )
  const onSelectMuinaisjaannosType = useCallback(
    (type: MuinaisjaannosTyyppi) =>
      dispatch(
        selectVisibleMuinaisjäännösTypeThunk(
          toggleSelection(type, selectedMuinaisjaannosTypes)
        )
      ),
    [dispatch, selectedMuinaisjaannosTypes]
  )
  const onToggleAllMuinaisjaannosTypes = useCallback(
    (types: Array<MuinaisjaannosTyyppi>) =>
      dispatch(selectVisibleMuinaisjäännösTypeThunk(types)),
    [dispatch]
  )
  const onSelectMuinaisjaannosDating = useCallback(
    (dating: MuinaisjaannosAjoitus) =>
      dispatch(
        selectVisibleMuinaisjäännösDatingThunk(
          toggleSelection(dating, selectedMuinaisjaannosDatings)
        )
      ),
    [dispatch, selectedMuinaisjaannosDatings]
  )
  const onToggleAllMuinaisjaannosDatings = useCallback(
    (types: Array<MuinaisjaannosAjoitus>) =>
      dispatch(selectVisibleMuinaisjäännösDatingThunk(types)),
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
      <Form>
        <Alert variant="light">{infoText}</Alert>

        <TypeToggleAllCheckbox
          selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
          onSelectTypes={onToggleAllMuinaisjaannosTypes}
        />
        <Form.Group className="mb-3">{typeCheckboxes}</Form.Group>

        <DatingToggleAllCheckbox
          selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
          onSelectDatings={onToggleAllMuinaisjaannosDatings}
        />
        <Form.Group className="mb-3">{datingCheckboxes}</Form.Group>
      </Form>
    </Panel>
  )
}
