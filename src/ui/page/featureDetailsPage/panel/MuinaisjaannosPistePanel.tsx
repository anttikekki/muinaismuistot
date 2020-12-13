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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
      has3dModels={models.length > 0}
      hasMaisemanMuistiFeatures={maisemanMuistiFeatures.length > 0}
    >
      <form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.attributes.kohdenimi}
        />
        <Field
          label={t(`details.field.municipality`)}
          value={feature.attributes.kunta}
        />
        <Field label={t(`details.field.dating`)}>
          <p>
            <span>{trim(feature.attributes.ajoitus)}</span>{" "}
            <TimespanLabel dating={feature.attributes.ajoitus} />
          </p>
        </Field>
        <Field
          label={t(`details.field.type`)}
          value={feature.attributes.tyyppi}
        />
        <Field
          label={t(`details.field.subType`)}
          value={feature.attributes.alatyyppi}
        />
        <Field
          label={t(`details.field.featureType`)}
          value={feature.attributes.laji}
        />

        {maisemanMuistiFeatures.length > 0 && (
          <MaisemanMuistiField feature={maisemanMuistiFeatures[0]} />
        )}

        <MuseovirastoLink feature={feature} />

        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
