import * as React from "react"
import {
  RKYPisteArgisFeature,
  RKYAlueArgisFeature,
  RKYViivaArgisFeature,
  MuseovirastoLayer,
  ModelFeatureProperties
} from "../../../../common/types"
import { ArgisFeatureCollapsePanel } from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { useTranslation } from "react-i18next"

interface Props {
  isOpen: boolean
  featureUniqueId: string
  feature: RKYPisteArgisFeature | RKYAlueArgisFeature | RKYViivaArgisFeature
  models?: Array<ModelFeatureProperties>
}

export const RKYPanel: React.FC<Props> = ({
  isOpen,
  featureUniqueId,
  feature,
  models = []
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      isOpen={isOpen}
      featureUniqueId={featureUniqueId}
      feature={feature}
      has3dModels={models.length > 0}
    >
      <form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.attributes.kohdenimi}
        />
        {feature.layerName === MuseovirastoLayer.RKY_alue && (
          <Field
            label={t(`details.field.name`)}
            value={feature.attributes.nimi}
          />
        )}
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
