import * as React from "react";
import {
  AhvenanmaaForminnenArgisFeature,
  ModelFeatureProperties,
} from "../../../../common/types";
import { FeatureCollapsePanel } from "./FeatureCollapsePanel";
import { Field } from "./Field";
import { AhvenanmaaRegeringenLink } from "./AhvenanmaaRegeringenLink";
import { EmbeddedModels } from "./EmbeddedModels";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: AhvenanmaaForminnenArgisFeature;
  models?: Array<ModelFeatureProperties>;
}

export const AhvenanmaaForminnenPanel: React.FC<Props> = ({
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
        <Field label="Nimi" value={feature.attributes.Namn} />
        <Field label="Kunta" value={feature.attributes.Kommun} />
        <Field label="Kylä" value={feature.attributes.By} />
        <Field label="Kuvaus" value={feature.attributes.Beskrivning} />
        <Field label="Sijainti" value={feature.attributes.Topografi} />
        <Field label="Tunniste" value={feature.attributes["Fornlämnings ID"]} />

        <AhvenanmaaRegeringenLink feature={feature} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </FeatureCollapsePanel>
  );
};
