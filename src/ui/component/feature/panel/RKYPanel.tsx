import React from "react"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"
import { EmbeddedModels } from "../component/EmbeddedModels"
import { useTranslation } from "react-i18next"
import {
  RKYAlueWmsFeature,
  RKYPisteWmsFeature,
  RKYViivaWmsFeature,
  isRKYAlueWmsFeature
} from "../../../../common/museovirasto.types"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: RKYPisteWmsFeature | RKYAlueWmsFeature | RKYViivaWmsFeature
}

export const RKYPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <ArgisFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.featureName`)}
          value={feature.properties.kohdenimi}
        />
        {isRKYAlueWmsFeature(feature) && (
          <Field
            label={t(`details.field.name`)}
            value={feature.properties.nimi}
          />
        )}
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
