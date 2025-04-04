import React, { useCallback } from "react"
import { Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  LayerGroup,
  MaanmittauslaitosVanhatKartatLayer
} from "../../../../common/layers.types"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { enableLayerGroupThunk } from "../../../../store/thunks/layerGroupEnabler"
import { selectVisibleMaanmittauslaitosVanhatKartatLayerThunk } from "../../../../store/thunks/maanmittauslaitosVanhatKartatLayer"
import { Panel } from "../../../component/Panel"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

const topografisetKartat = [
  MaanmittauslaitosVanhatKartatLayer.Venäläinen_topografinen_kartta_1870_1944,
  MaanmittauslaitosVanhatKartatLayer.Venäläinen_topografinen_kartta_1871_1919,
  MaanmittauslaitosVanhatKartatLayer.Venäläinen_topografinen_kartta_1916_1917,
  MaanmittauslaitosVanhatKartatLayer.Venäläinen_topografinen_kartta_192x
]

const yleiskartat = [
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1863_1879,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1880_1899,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1900_1919,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1920_1939,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1940_1972,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1954_1975,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1983_1992,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_1996,
  MaanmittauslaitosVanhatKartatLayer.Yleiskartta_2000
]

const pitäjäkartat = [MaanmittauslaitosVanhatKartatLayer.Pitäjäkartta_1912_1968]
const taloudellinenKartta = [
  MaanmittauslaitosVanhatKartatLayer.Taloudellinen_kartta_1911_1970
]

const maastokartat = [
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_100k_1928_1947,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_100k_1948_1989,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1924_1948,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1947_1959,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1960_1969,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1970_1979,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_20k_1980_1997,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_50k_1922_1946,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_50k_1964_2006,
  MaanmittauslaitosVanhatKartatLayer.Maasto_perus_topografinen_kartta_50k_2005_2020
]

export const MMLVanhatKartatLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedLayers, enabled, opacity } = useSelector(
    (settings: Settings) => settings.maanmittauslaitosVanhatKartat
  )
  const onSelectLayer = useCallback(
    (layer: MaanmittauslaitosVanhatKartatLayer) =>
      dispatch(selectVisibleMaanmittauslaitosVanhatKartatLayerThunk([layer])),
    [dispatch]
  )
  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch(
        enableLayerGroupThunk(enabled, LayerGroup.MaanmittauslaitosVanhatKartat)
      ),
    [dispatch]
  )
  const radiobuttonGroupName = "MaanmittauslaitosVanhatKartatLayer"

  return (
    <Panel
      title={t(`settings.mmlVanhatKartat.title`)}
      showEnablerSwitch={true}
      enabled={enabled}
      onSwitchChange={() => onSwitchChange(!enabled)}
    >
      <Form>
        <Form.Group className="mb-3">
          <h6>
            <Trans
              i18nKey="settings.mmlVanhatKartat.section.topografisetKartat"
              components={{ a: <a /> }}
            />
          </h6>
          {topografisetKartat.map((layer) => (
            <Form.Check
              type="radio"
              className="ms-3"
              name={radiobuttonGroupName}
              id={layer}
              key={layer}
              onChange={() => onSelectLayer(layer)}
              checked={selectedLayers.includes(layer)}
              label={t(`settings.mmlVanhatKartat.layer.${layer}`)}
              disabled={!enabled}
            ></Form.Check>
          ))}

          <h6>
            <Trans
              i18nKey="settings.mmlVanhatKartat.section.yleiskartta"
              components={{ a: <a /> }}
            />
          </h6>
          {yleiskartat.map((layer) => (
            <Form.Check
              type="radio"
              className="ms-3"
              name={radiobuttonGroupName}
              id={layer}
              key={layer}
              onChange={() => onSelectLayer(layer)}
              checked={selectedLayers.includes(layer)}
              label={t(`settings.mmlVanhatKartat.layer.${layer}`)}
              disabled={!enabled}
            ></Form.Check>
          ))}

          <h6>
            <Trans
              i18nKey="settings.mmlVanhatKartat.section.pitäjänkartasto"
              components={{ a: <a /> }}
            />
          </h6>
          {pitäjäkartat.map((layer) => (
            <Form.Check
              type="radio"
              className="ms-3"
              name={radiobuttonGroupName}
              id={layer}
              key={layer}
              onChange={() => onSelectLayer(layer)}
              checked={selectedLayers.includes(layer)}
              label={t(`settings.mmlVanhatKartat.layer.${layer}`)}
              disabled={!enabled}
            ></Form.Check>
          ))}

          <h6>
            <Trans
              i18nKey="settings.mmlVanhatKartat.section.taloudellinenKartta"
              components={{ a: <a /> }}
            />
          </h6>
          {taloudellinenKartta.map((layer) => (
            <Form.Check
              type="radio"
              className="ms-3"
              name={radiobuttonGroupName}
              id={layer}
              key={layer}
              onChange={() => onSelectLayer(layer)}
              checked={selectedLayers.includes(layer)}
              label={t(`settings.mmlVanhatKartat.layer.${layer}`)}
              disabled={!enabled}
            ></Form.Check>
          ))}

          <h6>
            <Trans
              i18nKey="settings.mmlVanhatKartat.section.maastokartat"
              components={{ a: <a /> }}
            />
          </h6>
          {maastokartat.map((layer) => (
            <Form.Check
              type="radio"
              className="ms-3"
              name={radiobuttonGroupName}
              id={layer}
              key={layer}
              onChange={() => onSelectLayer(layer)}
              checked={selectedLayers.includes(layer)}
              label={t(`settings.mmlVanhatKartat.layer.${layer}`)}
              disabled={!enabled}
            ></Form.Check>
          ))}
        </Form.Group>

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.MaanmittauslaitosVanhatKartat}
          disabled={!enabled}
        />

        <Form.Text>
          <Trans
            i18nKey="settings.mmlVanhatKartat.licence"
            components={{ a: <a /> }}
          />
        </Form.Text>
      </Form>
    </Panel>
  )
}
