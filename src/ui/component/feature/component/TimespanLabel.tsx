import React from "react"
import { Badge } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { MuinaisjaannosAjoitus } from "../../../../common/museovirasto.types"
import { getTimespanInYearsForTimingName } from "../../../../common/util/featureParser"

interface Props {
  dating: MuinaisjaannosAjoitus
}

export const TimespanLabel: React.FC<Props> = ({ dating }) => {
  const { t } = useTranslation()
  const timespan = getTimespanInYearsForTimingName(t, dating)
  if (!timespan) {
    return null
  }
  return <Badge bg="secondary ms-1">{timespan}</Badge>
}
