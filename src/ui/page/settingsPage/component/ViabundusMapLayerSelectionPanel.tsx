import React, { useCallback } from "react"
import { Accordion, Form } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup } from "../../../../common/layers.types"
import { ActionTypeEnum } from "../../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../../store/storeTypes"
import { LayerTransparencyInput } from "./LayerTransparencyInput"
import { ViabundusFeatureIcon } from "../../../component/feature/component/Icon"
import {
  ViabundusFeatureType,
  ViabundusRoadCertainty,
  ViabundusRoadType
} from "../../../../common/viabundus.types"

export const ViabundusMapLayerSelectionPanel: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { enabled, opacity, selectedYear } = useSelector(
    (settings: Settings) => settings.viabundus
  )

  const onSwitchChange = useCallback(
    (enabled: boolean) =>
      dispatch({
        type: ActionTypeEnum.ENABLE_LAYER_GROUP,
        layerGroup: LayerGroup.Viabundus,
        enabled
      }),
    [dispatch]
  )
  const onYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const year = Number(e.target.value)
      dispatch({
        type: ActionTypeEnum.SELECT_VIABUNDUS_YEAR,
        year
      })
    },
    [dispatch]
  )

  const title = t(`settings.viabundus.title`)

  return (
    <Accordion.Item eventKey={LayerGroup.Viabundus}>
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
            <Trans
              i18nKey={`data.register.nameWithLink.viabundus`}
              components={{ a: <a /> }}
            />
          </h6>

          <Form.Group className="mb-4">
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.place}
                Is_Town={true}
              />
              <span>{t(`data.viabundus.place.town`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.place}
                Is_Settlement={true}
              />
              <span>{t(`data.viabundus.place.settlement`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.place}
                Is_Bridge={true}
              />
              <span>{t(`data.viabundus.place.bridge`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.place}
                Is_Harbour={true}
              />
              <span>{t(`data.viabundus.place.harbour`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.place}
                Is_Ferry={true}
              />
              <span>{t(`data.viabundus.place.ferry`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.place}
                Is_Toll={true}
              />
              <span>{t(`data.viabundus.place.toll`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.road}
                roadType={ViabundusRoadType.land}
              />
              <span>{t(`data.viabundus.road.land`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.road}
                roadType={ViabundusRoadType.land}
                certainty={ViabundusRoadCertainty.Uncertain}
              />
              <span>{t(`data.viabundus.road.landUncertain`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.road}
                roadType={ViabundusRoadType.winter}
              />
              <span>{t(`data.viabundus.road.winter`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.road}
                roadType={ViabundusRoadType.coast}
              />
              <span>{t(`data.viabundus.road.coast`)}</span>
            </div>
            <div className="ms-3">
              <ViabundusFeatureIcon
                type={ViabundusFeatureType.road}
                roadType={ViabundusRoadType.coast}
                certainty={ViabundusRoadCertainty.Uncertain}
              />
              <span>{t(`data.viabundus.road.coastUncertain`)}</span>
            </div>

            <div className="ms-3">
              <ViabundusFeatureIcon type={ViabundusFeatureType.townOutline} />
              <span>{t(`data.viabundus.road.townOutline`)}</span>
            </div>
          </Form.Group>

          <h6>
            <Trans
              i18nKey={`settings.viabundus.year`}
              values={{ selectedYear }}
            />
          </h6>
          <Form.Range
            min="1350"
            max="1650"
            disabled={!enabled}
            onChange={onYearChange}
            value={selectedYear}
          />

          <LayerTransparencyInput
            opacity={opacity}
            layerGroup={LayerGroup.Viabundus}
            disabled={!enabled}
          />

          <Form.Text>
            <Trans
              i18nKey="settings.viabundus.licence"
              components={{ a: <a /> }}
            />
          </Form.Text>
        </Form>
      </Accordion.Body>
    </Accordion.Item>
  )
}
