import React from "react"
import { MaalinnoitusRajausFeature } from "../../../../common/maalinnoitusHelsinki.types"
import {
  FeatureTitleClickAction,
  MaalinnoitusFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { useTranslation } from "react-i18next"
import { Link } from "../../Link"
import { getNovisionLinkForMaalinnoitusRajaustyyppi } from "../../../../common/util/maalinnoitusLinkHelper"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MaalinnoitusRajausFeature
}

export const MaalinnoitusRajausPanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  const { tukikohtanumero, lajinumero, rajaustyyppi } = feature.properties

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
        <Field label={t(`details.field.maalinnoitus.rajauksenTyyppi`)}>
          <Link
            text={t(`data.helsinki.rajaustyyppi.${rajaustyyppi}`, {
              defaultValue: rajaustyyppi
            })}
            url={getNovisionLinkForMaalinnoitusRajaustyyppi(rajaustyyppi)}
          />
        </Field>
      </form>
    </MaalinnoitusFeatureCollapsePanel>
  )
}
