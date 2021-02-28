import React, { useEffect, useState } from "react"
import {
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties
} from "../../common/types"
import { getGeoJSONFeatureLocation } from "../../common/util/featureParser"
import { createLocationHash } from "../../common/util/URLHashHelper"

interface Props {
  features: Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
}

export const FeatureTable: React.FC<Props> = ({ features }) => {
  const [sortedFeatures, setSortedFeatures] = useState<
    Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
  >([])
  const [sortColumn, setSortColumn] = useState<string>("Lisätty")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => setSortedFeatures(features), [features])

  const onSortClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newSortColumn: string,
    compareFn: (
      a: GeoJSONFeature<MaisemanMuistiFeatureProperties>,
      b: GeoJSONFeature<MaisemanMuistiFeatureProperties>
    ) => number
  ) => {
    event.preventDefault()

    let newSortDirection = sortDirection
    if (newSortColumn === sortColumn) {
      newSortDirection = sortDirection === "asc" ? "desc" : "asc"
    } else {
      setSortColumn(newSortColumn)
      newSortDirection = "asc"
    }
    setSortDirection(newSortDirection)

    let sortResult = [...sortedFeatures].sort(compareFn)
    sortResult = newSortDirection === "desc" ? sortResult.reverse() : sortResult
    setSortedFeatures(sortResult)
  }

  const StringColumnHeader: React.FC<{
    name: string
    valueFn: (v: GeoJSONFeature<MaisemanMuistiFeatureProperties>) => string
  }> = ({ name, valueFn }) => {
    return (
      <th>
        <a
          href={`#${name}`}
          onClick={(e) =>
            onSortClick(e, name, (a, b) => valueFn(a).localeCompare(valueFn(b)))
          }
          style={{ whiteSpace: "nowrap" }}
        >
          <span>{name} </span>
          {name === sortColumn && (
            <img src={`../images/${sortDirection}.png`} />
          )}
        </a>
      </th>
    )
  }

  const NumberColumnHeader: React.FC<{
    name: string
    valueFn: (v: GeoJSONFeature<MaisemanMuistiFeatureProperties>) => number
  }> = ({ name, valueFn }) => {
    return (
      <th>
        <a
          href={`#${name}`}
          onClick={(e) =>
            onSortClick(e, name, (a, b) => valueFn(a) - valueFn(b))
          }
          style={{ whiteSpace: "nowrap" }}
        >
          <span>{name} </span>
          {name === sortColumn && (
            <img src={`../images/${sortDirection}.png`} />
          )}
        </a>
      </th>
    )
  }

  return (
    <>
      <h2 id="listaus">Aineston listaus</h2>
      <p>
        Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot
        löytyvät suoraan{" "}
        <a href="https://en.wikipedia.org/wiki/GeoJSON" target="_blank">
          GeoJSON
        </a>
        -tietokannasta. Rivejä voi järjestää klikkaamalla sarakkeen otsikkoa.
      </p>
      <ul>
        <li>
          Kohteen nimi on linkki suoraan Museoviraston{" "}
          <a
            href="https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_default.aspx"
            target="_blank"
          >
            Muinaisjäännösrekisteriin
          </a>
          .
        </li>
        <li>
          Kohteen nimen perässä on linkki kohteeseen{" "}
          <a href="https://muinaismuistot.info" target="_blank">
            muinaismuistot.info
          </a>{" "}
          -sivuston kartalla.
        </li>
      </ul>
      <p>
        Tämän aineston näkee kokonaisuudessaan kartalla{" "}
        <a href="https://muinaismuistot.info" target="_blank">
          muinaismuistot.info
        </a>{" "}
        -sivustolta. Kohteet on merkitty punaisella tähdellä.
      </p>

      <table className="table table-striped">
        <thead>
          <tr>
            <NumberColumnHeader
              name="Numero kirjassa"
              valueFn={(v) => v.properties.number}
            />
            <StringColumnHeader
              name="Nimi"
              valueFn={(v) => v.properties.name}
            />
            <StringColumnHeader
              name="Nimi rekisterissä"
              valueFn={(v) => v.properties.registerName}
            />
            <th></th>
            <StringColumnHeader
              name="Tyyppi"
              valueFn={(v) => v.properties.type}
            />
            <StringColumnHeader
              name="Kunta"
              valueFn={(v) => v.properties.municipality}
            />
            <StringColumnHeader
              name="Maakunta"
              valueFn={(v) => v.properties.region}
            />
          </tr>
        </thead>
        <tbody>
          {sortedFeatures.map((feature, i) => {
            const {
              id,
              name,
              registerName,
              number,
              type,
              municipality,
              region
            } = feature.properties
            return (
              <tr key={id}>
                <td>{number}</td>
                <td>{name}</td>
                <td>
                  <a
                    href={`https://www.kyppi.fi/to.aspx?id=112.${id}`}
                    target="_blank"
                  >
                    {registerName}
                  </a>
                </td>
                <td>
                  [
                  <a
                    href={`../${createLocationHash(
                      getGeoJSONFeatureLocation(feature)
                    )}`}
                    target="_blank"
                  >
                    kartta
                  </a>
                  ]
                </td>
                <td>{type}</td>
                <td>{municipality}</td>
                <td>{region}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
