import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { maankohoaminenChangeYear } from "../../../store/actionCreators"

export const MaankohoaminenButtons: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onClickAddYears = useCallback(() => {
    dispatch(maankohoaminenChangeYear(100))
  }, [dispatch])

  const onClickDecreaseYears = useCallback(() => {
    dispatch(maankohoaminenChangeYear(-100))
  }, [dispatch])

  return (
    <>
      <div id="map-button-maankohoaminen-add-years" className="map-button">
        <button
          type="button"
          className="btn btn-primary"
          title={t(`common.button.info`) ?? undefined}
          onClick={onClickAddYears}
        >
          <span className="glyphicon glyphicon-chevron-up" aria-hidden="true" />
        </button>
      </div>
      <div id="map-button-maankohoaminen-decrease-years" className="map-button">
        <button
          type="button"
          className="btn btn-primary"
          title={t(`common.button.info`) ?? undefined}
          onClick={onClickDecreaseYears}
        >
          <span
            className="glyphicon glyphicon-chevron-down"
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  )
}
