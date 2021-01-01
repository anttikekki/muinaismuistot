import * as React from "react"
import {
  RKYPisteArgisFeature,
  RKYAlueArgisFeature,
  RKYViivaArgisFeature,
  MuseovirastoLayer,
  ModelFeatureProperties
} from "../../../../common/types"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { useTranslation } from "react-i18next"

interface Props {
  hidePage: () => void
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: RKYPisteArgisFeature | RKYAlueArgisFeature | RKYViivaArgisFeature
}

export const RKYPanel: React.FC<Props> = ({
  hidePage,
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      hidePage={hidePage}
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
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
        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
