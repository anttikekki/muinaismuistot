import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  geMaankohoaminenLayerName,
  hasNextMaankohoaminenLayer
} from "../../../common/maankohoaminen"
import { maankohoaminenChangeYear } from "../../../store/actionCreators"
import { Settings } from "../../../store/storeTypes"

export const MaankohoaminenButtons: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayer = useSelector(
    (settings: Settings) => settings.maankohoaminen.selectedLayer
  )

  const onClickNextPastLayer = useCallback(() => {
    dispatch(maankohoaminenChangeYear(-100))
  }, [dispatch])

  const onClickNextFutureLayer = useCallback(() => {
    dispatch(maankohoaminenChangeYear(100))
  }, [dispatch])

  const hasFutureLayer = useMemo(
    () =>
      selectedLayer ? hasNextMaankohoaminenLayer(100, selectedLayer) : false,
    [selectedLayer]
  )
  const hasPastLayer = useMemo(
    () =>
      selectedLayer ? hasNextMaankohoaminenLayer(-100, selectedLayer) : false,
    [selectedLayer]
  )
  const layerName = useMemo(
    () => (selectedLayer ? geMaankohoaminenLayerName(selectedLayer) : ""),
    [selectedLayer]
  )

  if (!selectedLayer) {
    return <></>
  }

  return (
    <div
      className="btn-group-vertical map-button"
      role="group"
      id="map-button-maankohoaminen"
    >
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.info`) ?? undefined}
        onClick={onClickNextFutureLayer}
        disabled={!hasFutureLayer}
      >
        <span className="glyphicon glyphicon-chevron-up" aria-hidden="true" />
      </button>
      <button type="button" className="btn btn-default" disabled={true}>
        {layerName}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.info`) ?? undefined}
        onClick={onClickNextPastLayer}
        disabled={!hasPastLayer}
      >
        <span className="glyphicon glyphicon-chevron-down" aria-hidden="true" />
      </button>
    </div>
  )
}
