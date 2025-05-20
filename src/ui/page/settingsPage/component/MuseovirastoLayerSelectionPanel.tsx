import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup, MuseovirastoLayer } from "../../../../common/layers.types"
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

const muinaisjäännöksetLayers = [
  MuseovirastoLayer.Muinaisjaannokset_alue,
  MuseovirastoLayer.Muu_kulttuuriperintokohde_alue,
  MuseovirastoLayer.Muinaisjaannokset_piste,
  MuseovirastoLayer.Muu_kulttuuriperintokohde_piste
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
      </Accordion.Body>
    </Accordion.Item>
  )
}
