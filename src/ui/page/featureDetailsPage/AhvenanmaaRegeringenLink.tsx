import * as React from "react";
import { AhvenanmaaForminnenArgisFeature } from "../../../data";
import { getFeatureRegisterURL } from "../../../util/FeatureParser";

interface Props {
  feature: AhvenanmaaForminnenArgisFeature;
}

export const AhvenanmaaRegeringenLink: React.FC<Props> = ({ feature }) => {
  let url = getFeatureRegisterURL(feature);
  if (!url) {
    return null;
  }

  return (
    <p>
      Lisää tietoa kohteesta löytyy{" "}
      <a href={url} target="_blank">
        kuntakohtaisesta Pdf-tiedostosta
      </a>
      , josta voit etsiä kohteen tunnisteella{" "}
      <span className="label label-default">
        {feature.attributes["Fornlämnings ID"]}
      </span>
      .
    </p>
  );
};
