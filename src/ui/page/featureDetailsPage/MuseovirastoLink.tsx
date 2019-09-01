import * as React from "react";
import { ArgisFeature } from "../../../data";
import {
  getFeatureRegisterURL,
  getFeatureRegisterName
} from "../../../util/featureParser";

interface Props {
  feature: ArgisFeature;
}

export const MuseovirastoLink: React.FC<Props> = ({ feature }) => {
  let url = getFeatureRegisterURL(feature);
  let registerName = getFeatureRegisterName(feature);
  if (!url) {
    return null;
  }

  return (
    <p>
      Lisää tietoa kohteesta Museoviraston{" "}
      <a href={url} target="_blank">
        {registerName}
      </a>
      .
    </p>
  );
};
