import React, { useCallback, useMemo } from "react"
import { Button, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { LayerGroup, MaannousuInfoLayer } from "../../../common/layers.types"
import { ActionTypeEnum } from "../../../store/actionTypes"
import { AppDispatch, Settings } from "../../../store/storeTypes"

const years = Object.values(MaannousuInfoLayer)

export const MaannnousuInfoYearConrols: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedLayer, enabled } = useSelector(
    (settings: Settings) => settings.maannousuInfo
  )

  const yearOptions = useMemo(
    () =>
      years.map((yearLayer) => {
        const year = parseInt(yearLayer)

        const yearName =
          year >= 0
            ? `${year} ${t(`common.Jälkeen ajanlaskun alun`)}`
            : `${-year} ${t(`common.Ennen ajanlaskun alkua`)}`

        return (
          <option key={yearLayer} value={yearLayer}>
            {yearName}
          </option>
        )
      }),
    [i18n.language]
  )

  const hasPrevYear = useCallback(() => {
    const prevYearIndex = years.indexOf(selectedLayer) - 1
    return prevYearIndex >= 0
  }, [selectedLayer])

  const hasNextYear = useCallback(() => {
    const nextYearIndex = years.indexOf(selectedLayer) + 1
    return nextYearIndex < years.length
  }, [selectedLayer])

  const onPrevYearClick = useCallback(() => {
    if (hasPrevYear()) {
      const prevYearIndex = years.indexOf(selectedLayer) - 1
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.MaannousuInfo,
        layer: years[prevYearIndex]
      })
    }
  }, [dispatch, selectedLayer])

  const onSelectYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSelection = event.target.value

      if (years.includes(newSelection as MaannousuInfoLayer)) {
        dispatch({
          type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
          layerGroup: LayerGroup.MaannousuInfo,
          layer: newSelection as MaannousuInfoLayer
        })
      }
    },
    [dispatch, selectedLayer]
  )

  const onNextYearClick = useCallback(() => {
    if (hasNextYear()) {
      const nextYearIndex = years.indexOf(selectedLayer) + 1
      dispatch({
        type: ActionTypeEnum.SELECT_VISIBLE_LAYERS,
        layerGroup: LayerGroup.MaannousuInfo,
        layer: years[nextYearIndex]
      })
    }
  }, [dispatch, selectedLayer])

  if (!enabled) {
    return <></>
  }

  return (
    <div id="maannnousu-info-year-buttons" className="map-button">
      <Button
        variant="primary"
        size="sm"
        title={t(`common.button.maannousuInfo.Edellinen vuosi`)}
        onClick={onPrevYearClick}
        disabled={!hasPrevYear()}
      >
        <i className="bi bi-caret-left-fill" aria-hidden="true" />
      </Button>
      <Form.Select
        size="sm"
        value={selectedLayer}
        onChange={onSelectYearChange}
      >
        {yearOptions}
      </Form.Select>
      <Button
        variant="primary"
        size="sm"
        title={t(`common.button.maannousuInfo.Seuraava vuosi`)}
        onClick={onNextYearClick}
        disabled={!hasNextYear()}
      >
        <i className="bi bi-caret-right-fill" aria-hidden="true" />
      </Button>
    </div>
  )
}
