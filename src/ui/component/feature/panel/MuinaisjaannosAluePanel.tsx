import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { MuinaisjäännörekisteriAlueFeature } from "../../../../common/museovirasto.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"
import { MuseovirastoLink } from "../component/MuseovirastoLink"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MuinaisjäännörekisteriAlueFeature
}

export const MuinaisjaannosAluePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const { kohdenimi, kunta, mjtunnus } = feature.properties
  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.name`)}
          value={kohdenimi}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
        />
        <Field label={t(`details.field.municipality`)} value={kunta} />
        <Field label={t(`details.field.id`)} value={String(mjtunnus)} />
        <MuseovirastoLink feature={feature} />
      </Form>
    </MapFeatureCollapsePanel>
  )
}
