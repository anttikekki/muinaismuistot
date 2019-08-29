import * as React from "react";
import { ArgisFeature, MuseovirastoLayer } from "../../../data";

interface Props {
  feature: ArgisFeature;
}

export const MuseovirastoLink: React.FC<Props> = ({ feature }) => {
  let url: string;
  let registerName: string;
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
      url = "https://" + feature.attributes.url;
      registerName = "Muinaisjäännösrekisteristä";
      break;
  }
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
