import React from "react"
import { useTranslation } from "react-i18next"
import { getTimespanInYearsForTimingName } from "../../../../common/util/featureParser"
import { MuinaisjaannosAjoitus } from "../../../../common/museovirasto.types"

interface Props {
  dating: MuinaisjaannosAjoitus
}

export const TimespanLabel: React.FC<Props> = ({ dating }) => {
  const { t } = useTranslation()
  const timespan = getTimespanInYearsForTimingName(t, dating)
  if (!timespan) {
    return null
  }
  return <span className="label label-default">{timespan}</span>
}
