import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { MaalinnoitusRajausFeature } from "../../../../common/maalinnoitusHelsinki.types"
import { getNovisionLinkForMaalinnoitusRajaustyyppi } from "../../../../common/util/maalinnoitusLinkHelper"
import { Link } from "../../Link"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MaalinnoitusRajausFeature
}

export const MaalinnoitusRajausPanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const { tukikohtanumero, lajinumero, rajaustyyppi } = feature.properties

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.maalinnoitus.tukikohta`)}
          value={tukikohtanumero}
          suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
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
      </Form>
    </MapFeatureCollapsePanel>
  )
}
