import * as React from "react"
import { MuinaisjaannosAjoitus } from "../../../../common/types"
import { getTimespanInYearsForTimingName } from "../../../../common/util/featureParser"

interface Props {
  dating: MuinaisjaannosAjoitus
}

export const TimespanLabel: React.FC<Props> = ({ dating }) => {
  const timespan = getTimespanInYearsForTimingName(dating)
  if (!timespan) {
    return null
  }
  return <span className="label label-default">{timespan}</span>
}
