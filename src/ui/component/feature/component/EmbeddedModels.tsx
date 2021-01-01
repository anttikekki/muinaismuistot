import * as React from "react"
import { Trans, useTranslation } from "react-i18next"
import {
  GeoJSONFeature,
  ModelFeatureProperties
} from "../../../../common/types"

interface Props {
  models: Array<GeoJSONFeature<ModelFeatureProperties>>
}

export const Info: React.FC = () => {
  const { t } = useTranslation()
  const [infoOpen, setInfoOpen] = React.useState(false)

  const onInfoHeadingClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()
    setInfoOpen(!infoOpen)
  }

  return (
    <div className="panel panel-default">
      <div className="panel-heading feature-collapse-panel-heading" role="tab">
        <a role="button" href="" onClick={onInfoHeadingClick}>
          <span
            className="glyphicon glyphicon-info-sign"
            aria-hidden="true"
          ></span>{" "}
          {t(`details.3d.infoHeading`)}
        </a>
      </div>
      <div
        className={`panel-collapse collapse ${infoOpen ? "in" : ""}`}
        role="tabpanel"
      >
        <div className="panel-body">
          <p>
            <Trans i18nKey="details.3d.infoText1" components={{ a: <a /> }} />
          </p>
          <p>
            <Trans
              i18nKey="details.3d.infoText2"
              components={{ kbd: <kbd /> }}
            />{" "}
            <img src="images/sketchfab-fullscreen.png" />
          </p>
          <p>{t(`details.3d.controls.title`)}:</p>
          <ul>
            <li>
              <b>{t(`details.3d.controls.rotateTitle`)}:</b>{" "}
              {t(`details.3d.controls.rotate`)}
            </li>
            <li>
              <b>{t(`details.3d.controls.zoomTitle`)}:</b>{" "}
              {t(`details.3d.controls.zoom`)}
            </li>
            <li>
              <b>{t(`details.3d.controls.zoomTitle`)}:</b>{" "}
              {t(`details.3d.controls.zoom`)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const EmbeddedModels: React.FC<Props> = ({ models = [] }) => {
  const { t } = useTranslation()

  if (models.length === 0) {
    return null
  }

  return (
    <>
      <br />
      <h4>{t(`details.3d.title`)}</h4>

      <Info />

      {models.map((feature) => {
        const { name, url } = feature.properties.model
        return (
          <div className="form-group" key={url}>
            <label>{name}</label>
            <iframe
              title={name}
              width="100%"
              height="400"
              src={`${url}/embed`}
              allow="fullscreen"
              allowFullScreen={true}
            />
          </div>
        )
      })}
    </>
  )
}
