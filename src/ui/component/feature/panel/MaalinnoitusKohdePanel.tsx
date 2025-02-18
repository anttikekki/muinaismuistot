import React from "react"
import { useTranslation } from "react-i18next"
import { MaalinnoitusKohdeFeature } from "../../../../common/maalinnoitusHelsinki.types"
import { getNovisionLinkForMaalinnoitusKohdetyyppi } from "../../../../common/util/maalinnoitusLinkHelper"
import { Link } from "../../Link"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MaalinnoitusKohdeFeature
}

export const MaalinnoitusKohdePanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t } = useTranslation()
  const { tukikohtanumero, kohdetyyppi, olotila, mittaustieto } =
    feature.properties

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <form>
        <Field
          label={t(`details.field.maalinnoitus.tukikohta`)}
          value={tukikohtanumero}
        />
        <Field label={t(`details.field.maalinnoitus.kohteenTyyppi`)}>
          <Link
            text={t(`data.helsinki.kohdetyyppi.${kohdetyyppi}`, {
              defaultValue: kohdetyyppi
            })}
            url={getNovisionLinkForMaalinnoitusKohdetyyppi(kohdetyyppi)}
          />
        </Field>
        <Field
          label={t(`details.field.maalinnoitus.olotila`)}
          value={olotila}
        />
        <Field
          label={t(`details.field.maalinnoitus.mittaustieto`)}
          value={mittaustieto}
        />
      </form>
    </MapFeatureCollapsePanel>
  )
}
