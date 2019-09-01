import * as React from "react";
import { MuinaisjaannosAlueArgisFeature } from "../../../../data";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { MuseovirastoLink } from "./MuseovirastoLink";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: MuinaisjaannosAlueArgisFeature;
}

export const MuinaisjaannosAluePanel: React.FC<Props> = ({
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
        <Field label="Kunta" value={feature.attributes.kunta} />
        <Field label="Laji" value={feature.attributes.laji} />
        <MuseovirastoLink feature={feature} />
      </form>
    </FeatureCollapsePanel>
  );
};
