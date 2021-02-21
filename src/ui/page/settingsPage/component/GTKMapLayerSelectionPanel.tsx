import * as React from "react"
import { Trans, useTranslation } from "react-i18next"
import { GtkLayer } from "../../../../common/types"
import { Panel } from "../../../component/Panel"

interface Props {
  selectedLayers: Array<GtkLayer>
  opacity: number
  onSelectLayer: (layer: GtkLayer) => void
  onOpacityChange: (opacity: number) => void
}

export const GTKMapLayerSelectionPanel: React.FC<Props> = ({
  selectedLayers,
  opacity,
  onSelectLayer,
  onOpacityChange
}) => {
  const { t } = useTranslation()
  const transparency = Number((1 - opacity) * 100).toFixed(0)
  const onTransparencyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let transparency = Number(e.target.value)
    if (transparency > 100) {
      transparency = 100
    }
    const opacity = Number((1 - transparency / 100).toFixed(2))
    onOpacityChange(opacity)
  }
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
