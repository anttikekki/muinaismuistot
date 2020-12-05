import * as React from "react"
import { AhvenanmaaForminnenArgisFeature } from "../../../../common/types"
import {
  getAhvenanmaaForminneDatingText,
  getAhvenanmaaForminnenTypeText
} from "../../../../common/util/featureParser"
import { Field } from "./Field"

interface Props {
  feature: AhvenanmaaForminnenArgisFeature
}

export const AhvenanmaaTypeAndDatingField: React.FC<Props> = ({ feature }) => {
  const subFeatureTypesAndDatings =
    feature.attributes.typeAndDating?.map(
      ({
        Typ: typeId,
        Und_typ: subType,
        Typ_1: datingId,
        Undertyp: subDating,
        Antal: count
      }) => {
        const type = getAhvenanmaaForminnenTypeText(typeId)
        const dating = getAhvenanmaaForminneDatingText(datingId)

        return [
          ["Pääkategoria", type],
          ["Alatyyppi", subType],
          ["Pääaikakausi", dating],
          ["Periodi", subDating],
          ["Lukumäärä", count]
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
    <Field label="Tyyppi ja ajoitus">
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
                Kohde {i + 1}
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
