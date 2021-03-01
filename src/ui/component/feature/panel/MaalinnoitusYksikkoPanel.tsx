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
  const {
    tukikohtanumero,
    lajinumero,
    laji,
    yksikko,
    yksikkonumero,
    ajoitus,
    ajoitushuom,
    rakennustapa,
    rakennushistoria
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
          label={t(`details.field.maalinnoitus.puolustusasema`)}
          value={lajinumero}
        />
        <Field
          label={t(`details.field.maalinnoitus.yksikönTyyppi`)}
          value={t(`data.helsinki.yksikkoLaji.${laji}`, {
            defaultValue: laji
          })}
        />
        <Field
          label={t(`details.field.maalinnoitus.yksikkö`)}
          value={t(`data.helsinki.yksikko.${yksikko}`, {
            defaultValue: yksikko
          })}
        />
        <Field
          label={t(`details.field.maalinnoitus.yksikkönumero`)}
          value={yksikkonumero}
        />
        <Field
          label={t(`details.field.dating`)}
          value={[ajoitus, ajoitushuom].filter((x) => !!x).join(", ")}
        />
        <Field
          label={t(`details.field.maalinnoitus.rakennustapa`)}
          value={rakennustapa}
        />
        <Field
          label={t(`details.field.maalinnoitus.rakennushistoria`)}
          value={rakennushistoria}
        />
      </form>
    </MaalinnoitusFeatureCollapsePanel>
  )
}
