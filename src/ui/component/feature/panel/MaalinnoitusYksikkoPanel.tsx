import React from "react"
import { MaalinnoitusYksikkoFeature } from "../../../../common/types"
import {
  FeatureTitleClickAction,
  MaalinnoitusFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { useTranslation } from "react-i18next"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MaalinnoitusYksikkoFeature
}

export const MaalinnoitusYksikkoPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  return (
    <MaalinnoitusFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.tukikohta`)}
          value={feature.properties.tukikohtanumero}
        />
        <Field
          label={t(`details.field.puolustusasema`)}
          value={feature.properties.lajinumero}
        />
        <Field
          label={t(`details.field.tyyppi`)}
          value={feature.properties.laji}
        />
        <Field
          label={t(`details.field.yksikkö`)}
          value={feature.properties.yksikko}
        />
        <Field
          label={t(`details.field.yksikkönumero`)}
          value={feature.properties.yksikkonumero}
        />
        <Field
          label={t(`details.field.ajoitus`)}
          value={[feature.properties.ajoitus, feature.properties.ajoitushuom]
            .filter((x) => !!x)
            .join(", ")}
        />
        <Field
          label={t(`details.field.rakennustapa`)}
          value={feature.properties.rakennustapa}
        />
        <Field
          label={t(`details.field.rakennushistoria`)}
          value={feature.properties.rakennushistoria}
        />
      </form>
    </MaalinnoitusFeatureCollapsePanel>
  )
}
