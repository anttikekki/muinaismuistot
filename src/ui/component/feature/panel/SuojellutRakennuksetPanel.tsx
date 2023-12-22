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
  SuojellutRakennuksetAlueWmsFeature,
  SuojellutRakennuksetPisteWmsFeature,
  isSuojellutRakennuksetPisteWmsFeature
} from "../../../../common/museovirasto.types"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature:
    | SuojellutRakennuksetPisteWmsFeature
    | SuojellutRakennuksetAlueWmsFeature
}

export const SuojellutRakennuksetPanel: React.FC<Props> = ({
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
        {isSuojellutRakennuksetPisteWmsFeature(feature) && (
          <Field
            label={t(`details.field.buildingName`)}
            value={feature.properties.rakennusnimi}
          />
        )}
        <Field
          label={t(`details.field.municipality`)}
          value={feature.properties.kunta}
        />
        <Field
          label={t(`details.field.protectionGroup`)}
          value={feature.properties.suojeluryhmä}
        />
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
