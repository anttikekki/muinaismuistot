import React, { useCallback, useMemo } from "react"
import { Accordion, Alert, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup, MuseovirastoLayer } from "../../../../common/layers.types"
import {
  MuinaisjaannosAjoitus,
  MuinaisjaannosTyyppi
} from "../../../../common/museovirasto.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { ToggleAllCheckbox } from "../../../component/ToggleAllCheckbox"
import { toggleSelection } from "../../../util"
import { LayerCheckbox } from "./LayerCheckbox"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

const rkyLayers = [
  MuseovirastoLayer.RKY_alue,
  MuseovirastoLayer.RKY_viiva,
  MuseovirastoLayer.RKY_piste
]
const maailmanperintöLayers = [
  MuseovirastoLayer.Maailmanperinto_alue,
  MuseovirastoLayer.Maailmanperinto_piste
]

const suojellutRakennuksetLayers = [
  MuseovirastoLayer.Suojellut_rakennukset_alue,
  MuseovirastoLayer.Suojellut_rakennukset_piste
]

const varkLayers = [
  MuseovirastoLayer.VARK_pisteet,
  MuseovirastoLayer.VARK_alueet
]

const muinaisjäännöksetLayers = [
  MuseovirastoLayer.Muinaisjaannokset_alue,
  MuseovirastoLayer.Muu_kulttuuriperintokohde_alue,
  MuseovirastoLayer.Muinaisjaannokset_piste,
  MuseovirastoLayer.Muu_kulttuuriperintokohde_piste,
  MuseovirastoLayer.Löytöpaikka_piste,
  MuseovirastoLayer.Löytöpaikka_alue,
  MuseovirastoLayer.Havaintokohde_piste,
  MuseovirastoLayer.Havaintokohde_alue,
  MuseovirastoLayer.Luonnonmuodostuma_piste,
  MuseovirastoLayer.Luonnonmuodostuma_alue,
  MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste,
  MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue,
  MuseovirastoLayer.Muu_kohde_piste,
  MuseovirastoLayer.Muu_kohde_alue,
  MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste,
  MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue,
  MuseovirastoLayer.Alakohde_piste
]

export const MuseovirastoLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedLayers, enabled, opacity } = useSelector(
    (settings: Settings) => settings.museovirasto
  )
  const onSelectLayer = useCallback(
    (layer: MuseovirastoLayer) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Museovirasto,
        layers: toggleSelection(layer, selectedLayers)
      }),
    [dispatch, selectedLayers]
  )
  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.Museovirasto,
        enabled
      }),
    [dispatch]
  )
  const onToggleAllLayers = useCallback(
    (layers: MuseovirastoLayer[]) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.Museovirasto,
        layers
      }),
    [dispatch]
  )

  const title = t(`settings.museovirasto.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.Museovirasto}>
      <Accordion.Header as="div">
        <Form.Check
          type="switch"
          id={title}
          checked={enabled}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onSwitchChange(!enabled)}
        />
        {title}
      </Accordion.Header>
      <Accordion.Body>
        <Form>
          <h6>
            <ToggleAllCheckbox
              allValues={rkyLayers}
              selectedValues={selectedLayers}
              onSelectValues={onToggleAllLayers}
              disabled={!enabled}
            >
              <Trans
                i18nKey={`data.register.nameWithLink.Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt`}
                components={{ a: <a /> }}
              />
            </ToggleAllCheckbox>
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(`common.features.Alue`)}
              layer={MuseovirastoLayer.RKY_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`common.features.Viiva`)}
              layer={MuseovirastoLayer.RKY_viiva}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`common.features.Rakennus`)}
              layer={MuseovirastoLayer.RKY_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
          </Form.Group>

          <h6>
            <ToggleAllCheckbox
              allValues={maailmanperintöLayers}
              selectedValues={selectedLayers}
              onSelectValues={onToggleAllLayers}
              disabled={!enabled}
            >
              <Trans
                i18nKey={`data.register.nameWithLink.Maailmanperintökohteet`}
                components={{ a: <a /> }}
              />
            </ToggleAllCheckbox>
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(`common.features.Alue`)}
              layer={MuseovirastoLayer.Maailmanperinto_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`common.features.Kohde`)}
              layer={MuseovirastoLayer.Maailmanperinto_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
          </Form.Group>

          <h6>
            <ToggleAllCheckbox
              allValues={suojellutRakennuksetLayers}
              selectedValues={selectedLayers}
              onSelectValues={onToggleAllLayers}
              disabled={!enabled}
            >
              <Trans
                i18nKey={`data.register.nameWithLink.Rakennusperintörekisteri`}
                components={{ a: <a /> }}
              />
            </ToggleAllCheckbox>
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(`common.features.Rakennettu alue`)}
              layer={MuseovirastoLayer.Suojellut_rakennukset_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`common.features.Rakennus`)}
              layer={MuseovirastoLayer.Suojellut_rakennukset_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
          </Form.Group>

          <h6>
            <ToggleAllCheckbox
              allValues={muinaisjäännöksetLayers}
              selectedValues={selectedLayers}
              onSelectValues={onToggleAllLayers}
              disabled={!enabled}
            >
              <Trans
                i18nKey={`data.register.nameWithLink.Muinaisjäännösrekisteri`}
                components={{ a: <a /> }}
              />
            </ToggleAllCheckbox>
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(`data.featureType.Kiinteä muinaisjäännös (alue)`)}
              layer={MuseovirastoLayer.Muinaisjaannokset_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.Muu kulttuuriperintökohde (alue)`)}
              layer={MuseovirastoLayer.Muu_kulttuuriperintokohde_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.Kiinteä muinaisjäännös`)}
              layer={MuseovirastoLayer.Muinaisjaannokset_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.Muu kulttuuriperintökohde`)}
              layer={MuseovirastoLayer.Muu_kulttuuriperintokohde_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.löytöpaikkaPiste`)}
              layer={MuseovirastoLayer.Löytöpaikka_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.löytöpaikkaAlue`)}
              layer={MuseovirastoLayer.Löytöpaikka_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.havaintokohdePiste`)}
              layer={MuseovirastoLayer.Havaintokohde_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.havaintokohdeAlue`)}
              layer={MuseovirastoLayer.Havaintokohde_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.luonnonmuodostumaPiste`)}
              layer={MuseovirastoLayer.Luonnonmuodostuma_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.luonnonmuodostumaAlue`)}
              layer={MuseovirastoLayer.Luonnonmuodostuma_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.muuKohdePiste`)}
              layer={MuseovirastoLayer.Muu_kohde_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.muuKohdeAlue`)}
              layer={MuseovirastoLayer.Muu_kohde_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.mahdollinenMuinaisjäännösPiste`)}
              layer={MuseovirastoLayer.Mahdollinen_muinaisjäännös_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.mahdollinenMuinaisjäännösAlue`)}
              layer={MuseovirastoLayer.Mahdollinen_muinaisjäännös_alue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.poistettuKiinteäMuijaisjäännösPiste`)}
              layer={MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösPiste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.poistettuKiinteäMuijaisjäännösAlue`)}
              layer={MuseovirastoLayer.PoistettuKiinteäMuijaisjäännösAlue}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`data.featureType.alakohdePiste`)}
              layer={MuseovirastoLayer.Alakohde_piste}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
          </Form.Group>

          <h6>
            <ToggleAllCheckbox
              allValues={varkLayers}
              selectedValues={selectedLayers}
              onSelectValues={onToggleAllLayers}
              disabled={!enabled}
            >
              <Trans
                i18nKey={`data.register.nameWithLink.vark`}
                components={{ a: <a /> }}
              />
            </ToggleAllCheckbox>
          </h6>
          <Form.Group className="mb-3">
            <LayerCheckbox
              label={t(`common.features.aluerajaukset`)}
              layer={MuseovirastoLayer.VARK_alueet}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
            <LayerCheckbox
              label={t(`common.features.keskipisteet`)}
              layer={MuseovirastoLayer.VARK_pisteet}
              selectedLayers={selectedLayers}
              onSelectLayer={onSelectLayer}
              disabled={!enabled}
            />
          </Form.Group>

          <LayerTransparencyInput
            opacity={opacity}
            layerGroup={LayerGroup.Museovirasto}
            disabled={!enabled}
          />

          <Form.Text>
            <Trans
              i18nKey="settings.museovirasto.licence"
              components={{ a: <a /> }}
            />
          </Form.Text>
        </Form>

        <FeatureLayerFilterPanel />
      </Accordion.Body>
    </Accordion.Item>
  )
}

interface TypeCheckboxProps {
  type: MuinaisjaannosTyyppi
  selectedMuinaisjaannosTypes: MuinaisjaannosTyyppi[]
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

interface DatingCheckboxProps {
  dating: MuinaisjaannosAjoitus
  selectedMuinaisjaannosDatings: MuinaisjaannosAjoitus[]
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
      id={t(`data.museovirasto.muinaisjäännösAjoitus.${dating}`)}
      onChange={() => onSelectDating(dating)}
      checked={isSelected}
      disabled={disabled}
      label={t(`data.museovirasto.muinaisjäännösAjoitus.${dating}`)}
    />
  )
}

const FeatureLayerFilterPanel: React.FC = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const {
    selectedMuinaisjaannosTypes,
    selectedMuinaisjaannosDatings,
    enabled
  } = useSelector((settings: Settings) => settings.museovirasto)
  const onSelectMuinaisjaannosType = useCallback(
    (type: MuinaisjaannosTyyppi) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
        types: toggleSelection(type, selectedMuinaisjaannosTypes)
      }),
    [dispatch, selectedMuinaisjaannosTypes]
  )
  const onToggleAllMuinaisjaannosTypes = useCallback(
    (types: MuinaisjaannosTyyppi[]) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_TYPE,
        types
      }),
    [dispatch]
  )
  const onSelectMuinaisjaannosDating = useCallback(
    (dating: MuinaisjaannosAjoitus) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
        datings: toggleSelection(dating, selectedMuinaisjaannosDatings)
      }),
    [dispatch, selectedMuinaisjaannosDatings]
  )
  const onToggleAllMuinaisjaannosDatings = useCallback(
    (datings: MuinaisjaannosAjoitus[]) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_MUINAISJÄÄNNÖS_DATING,
        datings
      }),
    [dispatch]
  )

  const typeCheckboxes = useMemo(
    () =>
      Object.values(MuinaisjaannosTyyppi).map((type) => (
        <TypeCheckbox
          key={type}
          type={type}
          selectedMuinaisjaannosTypes={selectedMuinaisjaannosTypes}
          onSelectType={onSelectMuinaisjaannosType}
          disabled={!enabled}
        />
      )),
    [selectedMuinaisjaannosTypes, i18n.language, enabled]
  )

  const datingCheckboxes = useMemo(
    () =>
      Object.values(MuinaisjaannosAjoitus).map((dating) => (
        <DatingCheckbox
          key={dating}
          dating={dating}
          selectedMuinaisjaannosDatings={selectedMuinaisjaannosDatings}
          onSelectDating={onSelectMuinaisjaannosDating}
          disabled={!enabled}
        />
      )),
    [selectedMuinaisjaannosDatings, i18n.language, enabled]
  )

  return (
    <>
      <h5 className="mt-4">{t(`settings.museovirasto.filters.title`)}</h5>

      <Form>
        <Alert variant="light">
          <Trans
            i18nKey="settings.museovirasto.filters.info"
            components={{ img: <img /> }}
          />
        </Alert>

        <h6>
          <ToggleAllCheckbox
            allValues={Object.values(MuinaisjaannosTyyppi)}
            selectedValues={selectedMuinaisjaannosTypes}
            onSelectValues={onToggleAllMuinaisjaannosTypes}
            disabled={!enabled}
          >
            {t(`settings.museovirasto.filters.type`)}
          </ToggleAllCheckbox>
        </h6>
        <Form.Group className="mb-3">{typeCheckboxes}</Form.Group>

        <h6>
          <ToggleAllCheckbox
            allValues={Object.values(MuinaisjaannosAjoitus)}
            selectedValues={selectedMuinaisjaannosDatings}
            onSelectValues={onToggleAllMuinaisjaannosDatings}
            disabled={!enabled}
          >
            {t(`settings.museovirasto.filters.dating`)}
          </ToggleAllCheckbox>
        </h6>
        <Form.Group className="mb-3">{datingCheckboxes}</Form.Group>
      </Form>
    </>
  )
}
