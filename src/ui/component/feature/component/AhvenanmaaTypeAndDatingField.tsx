import React from "react"
import { useTranslation } from "react-i18next"
import { Language } from "../../../../common/layers.types"
import {
  getAhvenanmaaForminneDatingText,
  getAhvenanmaaForminnenTypeText
} from "../../../../common/util/featureParser"
import {
  getArkeologisenKulttuuriperinnonOpasLinkForAhvenanmaaType,
  getArkeologisenKulttuuriperinnonOpasLinkForAhvenanmaaSubType
} from "../../../../common/util/wikiLinkHelper"
import { Field } from "./Field"
import { AhvenanmaaForminnenArgisFeature } from "../../../../common/ahvenanmaa.types"

interface Props {
  feature: AhvenanmaaForminnenArgisFeature
}

export const AhvenanmaaTypeAndDatingField: React.FC<Props> = ({ feature }) => {
  const { t, i18n } = useTranslation()

  const subFeatureTypesAndDatings =
    feature.attributes.typeAndDating?.map(
      ({
        Typ: typeId,
        Und_typ: subType,
        Typ_1: datingId,
        Undertyp: subDating,
        Antal: count
      }) => {
        const type = getAhvenanmaaForminnenTypeText(t, typeId)
        const typeLink =
          getArkeologisenKulttuuriperinnonOpasLinkForAhvenanmaaType(type)
        const subTypeName = t(
          `data.ahvenanmaa.subType.${subType}`,
          subType ?? ""
        )
        const subTypeLink =
          getArkeologisenKulttuuriperinnonOpasLinkForAhvenanmaaSubType(subType)
        const dating = getAhvenanmaaForminneDatingText(t, datingId)

        return [
          [
            t(`details.field.mainCategory`),
            typeLink && i18n.language === Language.FI ? (
              <a href={typeLink} target="_blank">
                {type}
              </a>
            ) : (
              type
            )
          ],
          [
            t(`details.field.subCategory`),
            subTypeLink && i18n.language === Language.FI ? (
              <a href={subTypeLink} target="_blank">
                {subTypeName}
              </a>
            ) : (
              subTypeName
            )
          ],
          [t(`details.field.mainEra`), dating],
          [
            t(`details.field.period`),
            t(`data.ahvenanmaa.subDating.${subDating}`, subDating ?? "")
          ],
          [t(`details.field.featureCount`), count]
        ]
          .filter((v) => !!v[1])
          .map((v, i) => (
            <li key={i}>
              <b style={{ fontWeight: 500 }}>{v[0]}:</b> {v[1]}
            </li>
          ))
      }
    ) || []

  return (
    <Field label={t(`details.field.typeAndDating`)}>
      {subFeatureTypesAndDatings.map((row, i, items) => {
        const list = <ul key={i}>{row}</ul>
        if (items.length > 1) {
          return (
            <React.Fragment key={i}>
              <label
                style={{
                  marginLeft: "15px",
                  display: "block",
                  fontWeight: 500
                }}
              >
                {`${t(`details.field.feature`)} ${i + 1}`}
              </label>
              {list}
            </React.Fragment>
          )
        }
        return list
      })}
    </Field>
  )
}
