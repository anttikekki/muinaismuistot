import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { geMaankohoaminenLayerName } from "../../../common/maankohoaminen"
import { maankohoaminenChangeYear } from "../../../store/actionCreators"
import { Settings } from "../../../store/storeTypes"

export const MaankohoaminenButtons: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedLayer = useSelector(
    (settings: Settings) => settings.maankohoaminen.selectedLayer
  )

  const onClickAddYearsFrom1950 = useCallback(() => {
    dispatch(maankohoaminenChangeYear(100))
  }, [dispatch])

  const onClickDecreaseYearsFrom1950 = useCallback(() => {
    dispatch(maankohoaminenChangeYear(-100))
  }, [dispatch])

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
        onClick={onClickDecreaseYearsFrom1950}
      >
        <span className="glyphicon glyphicon-chevron-up" aria-hidden="true" />
      </button>
      <button type="button" className="btn btn-default" disabled={true}>
        {selectedLayer ? geMaankohoaminenLayerName(selectedLayer) : ""}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        title={t(`common.button.info`) ?? undefined}
        onClick={onClickAddYearsFrom1950}
      >
        <span className="glyphicon glyphicon-chevron-down" aria-hidden="true" />
      </button>
    </div>
  )
}
