import * as React from "react"
import {
  SuojellutRakennuksetPisteArgisFeature,
  SuojellutRakennuksetAlueArgisFeature,
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
  feature:
    | SuojellutRakennuksetPisteArgisFeature
    | SuojellutRakennuksetAlueArgisFeature
}

export const SuojellutRakennuksetPanel: React.FC<Props> = ({
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
        {feature.layerName == MuseovirastoLayer.Suojellut_rakennukset_piste && (
          <Field
            label={t(`details.field.buildingName`)}
            value={feature.attributes.rakennusnimi}
          />
        )}
        <Field
          label={t(`details.field.municipality`)}
          value={feature.attributes.kunta}
        />
        <Field
          label={t(`details.field.protectionGroup`)}
          value={feature.attributes.suojeluryhmä}
        />
        <MuseovirastoLink feature={feature} />
        {isOpen && <EmbeddedModels models={feature.models} />}
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
