import * as React from "react";
import {
  RKYPisteArgisFeature,
  RKYAlueArgisFeature,
  RKYViivaArgisFeature,
  MuseovirastoLayer,
  MaailmanperintoPisteArgisFeature,
  MaailmanperintoAlueArgisFeature
} from "../../../data";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { MuseovirastoLink } from "./MuseovirastoLink";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature;
}

export const MaailmanperintokohdePanel: React.FC<Props> = ({
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
        <Field label="Kohdenimi" value={feature.attributes.Nimi} />
        <MuseovirastoLink feature={feature} />
      </form>
    </FeatureCollapsePanel>
  );
};
