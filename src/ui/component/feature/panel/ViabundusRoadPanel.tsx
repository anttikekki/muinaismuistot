import React from "react"
import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Language } from "../../../../common/layers.types"
import { ViabundusRoadFeature } from "../../../../common/viabundus.types"
import {
  FeatureCollapsePanelCommonExternalProps,
  MapFeatureCollapsePanel
} from "../component/FeatureCollapsePanel"
import { FeatureGeometryDownloadLink } from "../component/FeatureGeometryDownloadLink"
import { Field } from "../component/Field"

const newLineToBr = (
  text: string | undefined
): React.JSX.Element[] | undefined =>
  text?.split(/\r\n/).map((desc, i) => (
    <React.Fragment key={i}>
      {desc}
      <br />
    </React.Fragment>
  ))

interface Props extends FeatureCollapsePanelCommonExternalProps {
  feature: ViabundusRoadFeature
}

export const ViabundusRoadPanel: React.FC<Props> = ({
  feature,
  ...commonProps
}) => {
  const { t, i18n } = useTranslation()
  const {
    fromyear,
    toyear,
    descriptionFI,
    descriptionEN,
    certainty,
    literature
  } = feature.properties

  return (
    <MapFeatureCollapsePanel feature={feature} {...commonProps}>
      <Form>
        {(fromyear || toyear) && (
          <Field
            label={t(`details.field.dating`)}
            value={`${fromyear ?? ""} - ${toyear ?? ""}`}
            suffixColum={<FeatureGeometryDownloadLink feature={feature} />}
          />
        )}

        <Field
          label={t(`details.field.rekonstruktiotarkkuus`)}
          value={t(`data.viabundus.roadCertainty.${certainty}`)}
        />

        <Field label={t(`details.field.description`)}>
          {newLineToBr(
            i18n.language === Language.EN
              ? (descriptionEN ?? descriptionFI)
              : (descriptionFI ?? descriptionEN)
          )}
        </Field>

        {literature && literature.length > 0 && (
          <Field label={t(`details.field.lähteet`)}>
            <ul>
              {literature.map((literature, i) => (
                <li key={i}>
                  <cite>{literature}</cite>
                </li>
              ))}
            </ul>
          </Field>
        )}
      </Form>
    </MapFeatureCollapsePanel>
  )
}
