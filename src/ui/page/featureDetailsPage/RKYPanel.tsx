import * as React from "react";
import {
  RKYPisteArgisFeature,
  RKYAlueArgisFeature,
  RKYViivaArgisFeature,
  MuseovirastoLayer
} from "../../../data";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { MuseovirastoLink } from "./MuseovirastoLink";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: RKYPisteArgisFeature | RKYAlueArgisFeature | RKYViivaArgisFeature;
}

export const RKYPanel: React.FC<Props> = ({
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
        {feature.layerName === MuseovirastoLayer.RKY_alue && (
          <Field label="Nimi" value={feature.attributes.nimi} />
        )}
        <MuseovirastoLink feature={feature} />
      </form>
    </FeatureCollapsePanel>
  );
};
