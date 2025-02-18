import React from "react"
import { useTranslation } from "react-i18next"
import {
  MuinaisjaannosAlueWmsFeature,
  MuuKulttuuriperintokohdeAlueWmsFeature
} from "../../../../common/museovirasto.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MuinaisjaannosAlueWmsFeature | MuuKulttuuriperintokohdeAlueWmsFeature
}

export const MuinaisjaannosAluePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const { kohdenimi, kunta, Laji } = feature.properties
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <form>
        <Field label={t(`details.field.name`)} value={kohdenimi} />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <MuseovirastoLink feature={feature} />
      </form>
    </MapFeatureCollapsePanel>
  )
}
