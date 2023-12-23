import React from "react"
import { useTranslation } from "react-i18next"
import { MuinaisjaannosAlueWmsFeature } from "../../../../common/museovirasto.types"
import {
  MapFeatureCollapsePanel,
  FeatureTitleClickAction
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props {
  titleClickAction: FeatureTitleClickAction
  isOpen: boolean
  onToggleOpen: () => void
  feature: MuinaisjaannosAlueWmsFeature
}

export const MuinaisjaannosAluePanel: React.FC<Props> = ({
  titleClickAction,
  isOpen,
  onToggleOpen,
  feature
}) => {
  const { t } = useTranslation()
  const { kohdenimi, kunta, Laji } = feature.properties
  return (
    <MapFeatureCollapsePanel
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
          value={t(`data.museovirasto.featureType.${Laji}`, Laji)}
        />
        <MuseovirastoLink feature={feature} />
      </form>
    </MapFeatureCollapsePanel>
  )
}
