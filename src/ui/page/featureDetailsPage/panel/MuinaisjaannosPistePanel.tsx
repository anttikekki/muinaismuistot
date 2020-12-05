import * as React from "react"
import {
  MuinaisjaannosPisteArgisFeature,
  ModelFeatureProperties,
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { TimespanLabel } from "../component/TimespanLabel"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { trim } from "../../../../common/util/featureParser"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { MaisemanMuistiField } from "../component/MaisemanMuistiField"

interface Props {
  isOpen: boolean
  onToggleOpen: () => void
  feature: MuinaisjaannosPisteArgisFeature
  models?: Array<ModelFeatureProperties>
  maisemanMuistiFeatures?: Array<
    GeoJSONFeature<MaisemanMuistiFeatureProperties>
  >
}

export const MuinaisjaannosPistePanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  models = [],
  maisemanMuistiFeatures = []
}) => {
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
      hasMaisemanMuistiFeatures={maisemanMuistiFeatures.length > 0}
    >
      <form>
        <Field label="Kohdenimi" value={feature.attributes.kohdenimi} />
        <Field label="Kunta" value={feature.attributes.kunta} />
        <Field label="Ajoitus">
          <p>
            <span>{trim(feature.attributes.ajoitus)}</span>{" "}
            <TimespanLabel dating={feature.attributes.ajoitus} />
          </p>
        </Field>
        <Field label="Tyyppi" value={feature.attributes.tyyppi} />
        <Field label="Alatyyppi" value={feature.attributes.alatyyppi} />
        <Field label="Laji" value={feature.attributes.laji} />

        {maisemanMuistiFeatures.length > 0 && (
          <MaisemanMuistiField feature={maisemanMuistiFeatures[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
