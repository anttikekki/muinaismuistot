import React, { useCallback } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { GtkLayer } from "../../../../common/types"
import {
  changeGtkLayerOpacity,
  selectGTKLayer
} from "../../../../store/actionCreators"
import { Settings } from "../../../../store/storeTypes"
import { Panel } from "../../../component/Panel"
import { toggleSelection } from "../../../util"

export const GTKMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayers = useSelector(
    (settings: Settings) => settings.gtk.selectedLayers
  )
  const opacity = useSelector((settings: Settings) => settings.gtk.opacity)
  const onSelectLayer = useCallback(
    (layer: GtkLayer) => {
      dispatch(selectGTKLayer(toggleSelection(layer, selectedLayers)))
    },
    [dispatch, selectedLayers]
  )

  const transparency = Number((1 - opacity) * 100).toFixed(0)
  const onTransparencyInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let transparency = Number(e.target.value)
      if (transparency > 100) {
        transparency = 100
      }
      const opacity = Number((1 - transparency / 100).toFixed(2))
      dispatch(changeGtkLayerOpacity(opacity))
    },
    [dispatch, transparency]
  )

  return (
    <Panel title={t(`settings.gtk.title`)}>
      <form>
        <h5>
          <label>
            <input
              type="checkbox"
              onChange={() => onSelectLayer(GtkLayer.muinaisrannat)}
              checked={selectedLayers.includes(GtkLayer.muinaisrannat)}
            />{" "}
            <Trans
              i18nKey={`data.gtk.layer.${GtkLayer.muinaisrannat}`}
              components={{ a: <a /> }}
            />
          </label>
        </h5>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img
            className="feature-icon"
            src="images/muinaisrannat_supra_akvaattinen.png"
          />
          <span>{t(`data.gtk.feature.supra-akvaattinen`)}</span>
        </div>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img className="feature-icon" src="images/muinaisrannat_yoldia.png" />
          <span>{t(`data.gtk.feature.yoldia`)}</span>
        </div>

        <div className="checkbox sub-layer-select-checkbox-container">
          <img
            className="feature-icon"
            src="images/muinaisrannat_litorina.png"
          />
          <span>{t(`data.gtk.feature.litorina`)}</span>
        </div>

        <div className="form-group">
          <label htmlFor="gtkTransparency" style={{ fontWeight: 500 }}>
            {t(`settings.gtk.transparency`)}
          </label>
          <input
            id="gtkTransparency"
            className="form-control"
            style={{ width: "auto" }}
            type="number"
            min="0"
            max="100"
            step="5"
            onChange={onTransparencyInputChange}
            value={transparency}
          />
        </div>

        <small className="pull-right">{t(`settings.gtk.licence`)}</small>
      </form>
    </Panel>
  )
}
