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
  const {
    tukikohtanumero,
    kohdetyyppi,
    olotila,
    mittaustieto
  } = feature.properties

  return (
    <MaalinnoitusFeatureCollapsePanel
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field
          label={t(`details.field.maalinnoitus.tukikohta`)}
          value={tukikohtanumero}
        />
        <Field
          label={t(`details.field.maalinnoitus.kohteenTyyppi`)}
          value={t(`data.helsinki.kohdetyyppi.${kohdetyyppi}`, {
            defaultValue: kohdetyyppi
          })}
        />
        <Field
          label={t(`details.field.maalinnoitus.olotila`)}
          value={olotila}
        />
        <Field
          label={t(`details.field.maalinnoitus.mittaustieto`)}
          value={mittaustieto}
        />
      </form>
    </MaalinnoitusFeatureCollapsePanel>
  )
}
