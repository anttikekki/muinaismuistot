import * as React from "react";
import { MuinaisjaannosPisteArgisFeature } from "../../../../data";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { TimespanLabel } from "./TimespanLabel";
import { MuseovirastoLink } from "./MuseovirastoLink";
import { trim } from "../../../../util/featureParser";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: MuinaisjaannosPisteArgisFeature;
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({
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
        <Field label="Ajoitus">
          <p>
            <span>{trim(feature.attributes.ajoitus)}</span>
            <TimespanLabel feature={feature} />
          </p>
        </Field>
        <Field label="Tyyppi" value={feature.attributes.tyyppi} />
        <Field label="Alatyyppi" value={feature.attributes.alatyyppi} />
        <Field label="Laji" value={feature.attributes.laji} />
        <MuseovirastoLink feature={feature} />
      </form>
    </FeatureCollapsePanel>
  );
};
