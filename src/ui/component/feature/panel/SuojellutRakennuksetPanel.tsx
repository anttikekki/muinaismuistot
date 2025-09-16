import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import {
  SuojellutRakennuksetAlueWmsFeature,
  SuojellutRakennuksetPisteWmsFeature,
  isSuojellutRakennuksetPisteWmsFeature
} from "../../../../common/museovirasto.types"
import { EmbeddedModels } from "../component/EmbeddedModels"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature:
    | SuojellutRakennuksetPisteWmsFeature
    | SuojellutRakennuksetAlueWmsFeature
}

export const SuojellutRakennuksetPanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
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
        <Field
          label={t(`details.field.id`)}
          value={String(feature.properties.KOHDEID)}
        />
        <MuseovirastoLink feature={feature} />
        {commonProps.isOpen && <EmbeddedModels models={feature.models} />}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
