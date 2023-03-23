import React, { useCallback, useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  defaultMaankohoaminenLayer,
  geMaankohoaminenLayerName,
  maankohoaminenLayers
} from "../../../../common/maankohoaminen"
import { LayerGroup } from "../../../../common/types"
import { selectMaankohoaminenLayer } from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { LayerTransparencyInput } from "./LayerTransparencyInput"

export const MaankohoaminenLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayer = useSelector(
    (settings: Settings) => settings.maankohoaminen.selectedLayer
  )
  const opacity = useSelector(
    (settings: Settings) => settings.maankohoaminen.opacity
  )
  const onToggleLayerVisibility = useCallback(
    (layer: string) => {
      dispatch(
        selectMaankohoaminenLayer(selectedLayer === layer ? undefined : layer)
      )
    },
    [dispatch, selectedLayer]
  )
  const onSelectLayer = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(selectMaankohoaminenLayer(event.target.value))
    },
    [dispatch]
  )
  const layerOptions = useMemo(
    () =>
      maankohoaminenLayers.map(({ layer }) => (
        <option key={layer} value={layer}>
          {geMaankohoaminenLayerName(layer)}
        </option>
      )),
    []
  )

  if (!selectedLayer) {
    return <></>
  }

  return (
    <Panel title={t(`settings.maankohoaminen.title`)}>
      <form>
        <h5>
          <label>
            <input
              type="checkbox"
              onChange={() =>
                onToggleLayerVisibility(defaultMaankohoaminenLayer)
              }
              checked={!!selectedLayer}
            />{" "}
            <Trans
              i18nKey={`data.maankohoaminen.layer.maankohoaminen`}
              components={{ a: <a /> }}
            />
          </label>
        </h5>

        <div className="form-group">
          <select
            className="form-control"
            style={{ width: "auto" }}
            onChange={onSelectLayer}
            value={selectedLayer}
          >
            {layerOptions}
          </select>
        </div>

        <LayerTransparencyInput
          opacity={opacity}
          layerGroup={LayerGroup.Maankohoaminen}
        />

        <small className="pull-right">
          {t(`settings.maankohoaminen.licence`)}
        </small>
      </form>
    </Panel>
  )
}
