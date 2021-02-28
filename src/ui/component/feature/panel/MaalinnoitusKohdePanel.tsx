import React from "react"
import { MaalinnoitusKohdeFeature } from "../../../../common/types"
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
  feature: MaalinnoitusKohdeFeature
}

export const MaalinnoitusKohdePanel: React.FC<Props> = ({
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
          label={t(`details.field.tyyppi`)}
          value={feature.properties.kohdetyyppi}
        />
        <Field
          label={t(`details.field.olotila`)}
          value={feature.properties.olotila}
        />
        <Field
          label={t(`details.field.mittaustieto`)}
          value={feature.properties.mittaustieto}
        />
      </form>
    </MaalinnoitusFeatureCollapsePanel>
  )
}
