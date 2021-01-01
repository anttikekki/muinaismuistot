import * as React from "react"
import { useTranslation } from "react-i18next"
import { MuinaisjaannosAlueArgisFeature } from "../../../../common/types"
import {
  ArgisFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props {
  hidePage: () => void
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MuinaisjaannosAlueArgisFeature
}

export const MuinaisjaannosAluePanel: React.FC<Props> = ({
  hidePage,
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  const { kohdenimi, kunta, laji } = feature.attributes
  return (
    <ArgisFeatureCollapsePanel
      hidePage={hidePage}
      titleClickAction={titleClickAction}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      feature={feature}
    >
      <form>
        <Field label={t(`details.field.name`)} value={kohdenimi} />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <Field
          label={t(`details.field.featureType`)}
          value={t(`data.museovirasto.featureType.${laji}`, laji)}
        />
        <MuseovirastoLink feature={feature} />
      </form>
    </ArgisFeatureCollapsePanel>
  )
}
