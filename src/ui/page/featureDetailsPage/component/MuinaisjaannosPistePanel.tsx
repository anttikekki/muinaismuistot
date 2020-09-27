import * as React from "react";
import {
  MuinaisjaannosPisteArgisFeature,
  ModelFeatureProperties,
} from "../../../../common/types";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { TimespanLabel } from "./TimespanLabel";
import { MuseovirastoLink } from "./MuseovirastoLink";
import { trim } from "../../../../common/util/featureParser";
import { EmbeddedModels } from "./EmbeddedModels";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: MuinaisjaannosPisteArgisFeature;
  models?: Array<ModelFeatureProperties>;
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = [],
}) => {
  return (
    <FeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
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
        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </FeatureCollapsePanel>
  );
};
