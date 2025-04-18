import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { MaalinnoitusYksikkoFeature } from "../../../../common/maalinnoitusHelsinki.types"
import {
  getNovisionLinkForMaalinnoitusYksikko,
  getNovisionLinkForMaalinnoitusYksikkoLaji
} from "../../../../common/util/maalinnoitusLinkHelper"
import { Link } from "../../Link"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { Field } from "../component/Field"

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: MaalinnoitusYksikkoFeature
}

export const MaalinnoitusYksikkoPanel: React.FC<Props> = ({
  feature,
  ...commonProps
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
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        <Field
          label={t(`details.field.maalinnoitus.tukikohta`)}
          value={tukikohtanumero}
        />
        <Field
          label={t(`details.field.maalinnoitus.puolustusasema`)}
          value={lajinumero}
        />
        <Field label={t(`details.field.maalinnoitus.yksikönTyyppi`)}>
          <Link
            text={t(`data.helsinki.yksikkoLaji.${laji}`, {
              defaultValue: laji
            })}
            url={getNovisionLinkForMaalinnoitusYksikkoLaji(laji)}
          />
        </Field>
        <Field label={t(`details.field.maalinnoitus.yksikkö`)}>
          <Link
            text={t(`data.helsinki.yksikko.${yksikko}`, {
              defaultValue: yksikko
            })}
            url={getNovisionLinkForMaalinnoitusYksikko(yksikko)}
          />
        </Field>
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
      </Form>
    </MapFeatureCollapsePanel>
  )
}
