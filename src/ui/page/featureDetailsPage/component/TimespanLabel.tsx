import * as React from "react";
import { MuinaisjaannosPisteArgisFeature } from "../../../../common/types";
import { getTimespanInYearsForTimingName } from "../../../../common/util/featureParser";

interface Props {
  feature: MuinaisjaannosPisteArgisFeature;
}

export const TimespanLabel: React.FC<Props> = ({ feature }) => {
  const timespan = getTimespanInYearsForTimingName(feature.attributes.ajoitus);
  if (!timespan) {
    return null;
  }
  return <span className="label label-default">{timespan}</span>;
};
