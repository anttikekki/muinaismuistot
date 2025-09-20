import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  LayerGroup,
  MMLPohjakarttaLayer,
  MMLVanhatKartatLayer
} from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

const topografisetKartat = [
  MMLVanhatKartatLayer.Venäläinen_topografinen_kartta_1870_1944,
  MMLVanhatKartatLayer.Venäläinen_topografinen_kartta_1871_1919,
  MMLVanhatKartatLayer.Venäläinen_topografinen_kartta_1916_1917,
  MMLVanhatKartatLayer.Venäläinen_topografinen_kartta_192x
]

const yleiskartat = [
  MMLVanhatKartatLayer.Yleiskartta_1863_1879,
  MMLVanhatKartatLayer.Yleiskartta_1880_1899,
  MMLVanhatKartatLayer.Yleiskartta_1900_1919,
  MMLVanhatKartatLayer.Yleiskartta_1920_1939,
  MMLVanhatKartatLayer.Yleiskartta_1940_1972,
  MMLVanhatKartatLayer.Yleiskartta_1954_1975,
  MMLVanhatKartatLayer.Yleiskartta_1983_1992,
  MMLVanhatKartatLayer.Yleiskartta_1996,
  MMLVanhatKartatLayer.Yleiskartta_2000
]

const pitäjäkartat = [MMLVanhatKartatLayer.Pitäjäkartta_1912_1968]
const taloudellinenKartta = [
  MMLVanhatKartatLayer.Taloudellinen_kartta_1911_1970
]

const maastokartat = [
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_100k_1928_1947,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_100k_1948_1989,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1924_1948,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1947_1959,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1960_1969,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1970_1979,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1980_1997,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_50k_1922_1946,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_50k_1964_2006,
  MMLVanhatKartatLayer.Maasto_perus_topografinen_kartta_50k_2005_2020
]

export const MMLMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { basemap, vanhatKartat } = useSelector(
    (settings: Settings) => settings.maanmittauslaitos
  )
  const onSelectBasemapLayer = useCallback(
    (layer: MMLPohjakarttaLayer) => {
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.MMLPohjakartta,
        layer
      })
    },
    [dispatch]
  )
  const onSelectVanhatKartatLayer = useCallback(
    (layer: MMLVanhatKartatLayer) =>
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.MMLVanhatKartat,
        layers: [layer]
      }),
    [dispatch]
  )
  const onMainSwitchChange = useCallback(
    (enabled: boolean) => {
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.MMLPohjakartta,
        enabled
      })
      if (!enabled) {
        dispatch({
          type: ActionTypeEnum.ENABLE_LAYER_GROUP,
          layerGroup: LayerGroup.MMLVanhatKartat,
          enabled
        })
      }
    },
    [dispatch]
  )
  const onBasemapSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.MMLPohjakartta,
        enabled
      }),
    [dispatch]
  )
  const onVanhatKartatSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.MMLVanhatKartat,
        enabled
      }),
    [dispatch]
  )

  const title = t(`settings.mml.title`)
  const mainEnabled = basemap.enabled || vanhatKartat.enabled

  return (
    <Accordion.Item eventKey={LayerGroup.MMLPohjakartta}>
      <Accordion.Header as="div">
        <Form.Check
          type="switch"
          id={title}
          checked={mainEnabled}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onMainSwitchChange(!mainEnabled)}
        />
        {title}
      </Accordion.Header>
      <Accordion.Body>
        <Form>
          <Form.Group className="mb-3">
            <div className="h5">
              <Form.Check
                type="checkbox"
                id="settings.mml.basemap.title"
                checked={basemap.enabled}
                onChange={() => onBasemapSwitchChange(!basemap.enabled)}
                label={t("settings.mml.basemap.title")}
              />
            </div>
            <div className="ms-3">
              {Object.values(MMLPohjakarttaLayer).map((layer) => (
                <Form.Check
                  type="radio"
                  className="ms-3"
                  name="MMLPohjakarttaLayer"
                  id={layer}
                  key={layer}
                  onChange={() => onSelectBasemapLayer(layer)}
                  checked={layer === basemap.selectedLayer}
                  label={t(`settings.mml.basemap.layer.${layer}`)}
                  disabled={!basemap.enabled}
                ></Form.Check>
              ))}
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <div className="h5">
              <Form.Check
                type="checkbox"
                id="settings.mml.vanhatKartat.title"
                checked={vanhatKartat.enabled}
                onChange={() =>
                  onVanhatKartatSwitchChange(!vanhatKartat.enabled)
                }
                label={t("settings.mml.vanhatKartat.title")}
              />
            </div>
            <div className="ms-3">
              <h6>
                <Trans
                  i18nKey="settings.mml.vanhatKartat.section.topografisetKartat"
                  components={{ a: <a /> }}
                />
              </h6>
              {topografisetKartat.map((layer) => (
                <Form.Check
                  type="radio"
                  className="ms-3"
                  name="MMLVanhatKartatLayer"
                  id={layer}
                  key={layer}
                  onChange={() => onSelectVanhatKartatLayer(layer)}
                  checked={vanhatKartat.selectedLayers.includes(layer)}
                  label={t(`settings.mml.vanhatKartat.layer.${layer}`)}
                  disabled={!vanhatKartat.enabled}
                ></Form.Check>
              ))}

              <h6>
                <Trans
                  i18nKey="settings.mml.vanhatKartat.section.yleiskartta"
                  components={{ a: <a /> }}
                />
              </h6>
              {yleiskartat.map((layer) => (
                <Form.Check
                  type="radio"
                  className="ms-3"
                  name="MMLVanhatKartatLayer"
                  id={layer}
                  key={layer}
                  onChange={() => onSelectVanhatKartatLayer(layer)}
                  checked={vanhatKartat.selectedLayers.includes(layer)}
                  label={t(`settings.mml.vanhatKartat.layer.${layer}`)}
                  disabled={!vanhatKartat.enabled}
                ></Form.Check>
              ))}

              <h6>
                <Trans
                  i18nKey="settings.mml.vanhatKartat.section.pitäjänkartasto"
                  components={{ a: <a /> }}
                />
              </h6>
              {pitäjäkartat.map((layer) => (
                <Form.Check
                  type="radio"
                  className="ms-3"
                  name="MMLVanhatKartatLayer"
                  id={layer}
                  key={layer}
                  onChange={() => onSelectVanhatKartatLayer(layer)}
                  checked={vanhatKartat.selectedLayers.includes(layer)}
                  label={t(`settings.mml.vanhatKartat.layer.${layer}`)}
                  disabled={!vanhatKartat.enabled}
                ></Form.Check>
              ))}

              <h6>
                <Trans
                  i18nKey="settings.mml.vanhatKartat.section.taloudellinenKartta"
                  components={{ a: <a /> }}
                />
              </h6>
              {taloudellinenKartta.map((layer) => (
                <Form.Check
                  type="radio"
                  className="ms-3"
                  name="MMLVanhatKartatLayer"
                  id={layer}
                  key={layer}
                  onChange={() => onSelectVanhatKartatLayer(layer)}
                  checked={vanhatKartat.selectedLayers.includes(layer)}
                  label={t(`settings.mml.vanhatKartat.layer.${layer}`)}
                  disabled={!vanhatKartat.enabled}
                ></Form.Check>
              ))}

              <h6>
                <Trans
                  i18nKey="settings.mml.vanhatKartat.section.maastokartat"
                  components={{ a: <a /> }}
                />
              </h6>
              {maastokartat.map((layer) => (
                <Form.Check
                  type="radio"
                  className="ms-3"
                  name="MMLVanhatKartatLayer"
                  id={layer}
                  key={layer}
                  onChange={() => onSelectVanhatKartatLayer(layer)}
                  checked={vanhatKartat.selectedLayers.includes(layer)}
                  label={t(`settings.mml.vanhatKartat.layer.${layer}`)}
                  disabled={!vanhatKartat.enabled}
                ></Form.Check>
              ))}

              <LayerTransparencyInput
                opacity={vanhatKartat.opacity}
                layerGroup={LayerGroup.MMLVanhatKartat}
                disabled={!vanhatKartat.enabled}
              />
            </div>
          </Form.Group>
          <Form.Text>
            <Trans i18nKey="settings.mml.licence" components={{ a: <a /> }} />
          </Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
