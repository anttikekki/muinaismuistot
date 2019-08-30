import * as React from "react";
import {
  SuojellutRakennuksetPisteArgisFeature,
  SuojellutRakennuksetAlueArgisFeature,
  MuseovirastoLayer
} from "../../../data";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { MuseovirastoLink } from "./MuseovirastoLink";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature:
    | SuojellutRakennuksetPisteArgisFeature
    | SuojellutRakennuksetAlueArgisFeature;
}

export const SuojellutRakennuksetPanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature
}) => {
  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field label="Kohdenimi" value={feature.attributes.kohdenimi} />
        {feature.layerName == MuseovirastoLayer.Suojellut_rakennukset_piste && (
          <Field label="Rakennusnimi" value={feature.attributes.rakennusnimi} />
        )}
        <Field label="Kunta" value={feature.attributes.kunta} />
        <Field label="Suojeluryhmä" value={feature.attributes.suojeluryhmä} />
        <MuseovirastoLink feature={feature} />
      </form>
    </FeatureCollapsePanel>
  );
};
