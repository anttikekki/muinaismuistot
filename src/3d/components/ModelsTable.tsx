import React, { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { ModelFeature } from "../../common/3dModels.types"
import {
  getGeoJSONFeatureLocation,
  getLayerRegisterName
} from "../../common/util/featureParser"
import { createLocationHash } from "../../common/util/URLHashHelper"

type SortDirection = "asc" | "desc"

interface Props {
  models: ModelFeature[]
}

export const ModelsTable: React.FC<Props> = ({ models }) => {
  const { t } = useTranslation()
  const [sortedModels, setSortedModels] = useState<ModelFeature[]>([])
  const [sortColumn, setSortColumn] = useState<string>("Lisätty")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  useEffect(() => setSortedModels(models), [models])

  const onSortClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newSortColumn: string,
    compareFn: (a: ModelFeature, b: ModelFeature) => number
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

    let sortResult = [...sortedModels].sort(compareFn)
    sortResult = newSortDirection === "desc" ? sortResult.reverse() : sortResult
    setSortedModels(sortResult)
  }

  const ColumnHeader: React.FC<{
    name: string
    valueFn: (v: ModelFeature) => string
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
          {name === sortColumn &&
            (sortDirection === "desc" ? (
              <i className="bi bi-caret-down-fill"></i>
            ) : (
              <i className="bi bi-caret-up-fill"></i>
            ))}
        </a>
      </th>
    )
  }

  return (
    <>
      <h2 id="listaus">Aineston listaus</h2>
      <p>
        Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot
        löytyvät suoraan tietokannasta. Rivejä voi järjestää klikkaamalla
        sarakkeen otsikkoa.
      </p>
      <ul>
        <li>
          Kohteen nimi on linkki suoraan Museoviraston tai Ahvenanmaan
          paikallishallinnon <a href="#rekisterit">rekisteriin</a>.
        </li>
        <li>
          Kohteen nimen perässä on linkki kohteeseen{" "}
          <a href="https://muinaismuistot.info" target="_blank">
            muinaismuistot.info
          </a>{" "}
          -sivuston kartalla.
        </li>
        <li>
          Mallin nimi on linkki 3D-malliin{" "}
          <a href="https://sketchfab.com" target="_blank">
            Sketchfab
          </a>
          -sivustolla.
        </li>
      </ul>
      <p>
        Tämän aineston näkee kokonaisuudessaan kartalla{" "}
        <a href="https://muinaismuistot.info" target="_blank">
          muinaismuistot.info
        </a>{" "}
        -sivustolta. Kohteet joissa on 3D-malleja on merkitty tummalla
        kehyksellä.
      </p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <ColumnHeader
              name="Kohde"
              valueFn={(v) => v.properties.registryItem.name}
            />
            <th></th>
            <ColumnHeader
              name="Kunta"
              valueFn={(v) => v.properties.registryItem.municipality}
            />
            <ColumnHeader
              name="Rekisteri"
              valueFn={(v) => v.properties.registryItem.type}
            />
            <ColumnHeader
              name="Mallin nimi"
              valueFn={(v) => v.properties.model.name}
            />
            <ColumnHeader
              name="Lisätty"
              valueFn={(v) => v.properties.createdDate}
            />
            <ColumnHeader
              name="Tekijä/Jukaisija"
              valueFn={(v) => v.properties.author}
            />
            <ColumnHeader
              name="Lisenssi"
              valueFn={(v) => v.properties.licence}
            />
          </tr>
        </thead>
        <tbody>
          {sortedModels.map((feature, i) => {
            const { properties } = feature
            return (
              <tr key={properties.model.url}>
                <td>{i + 1}</td>
                <td>
                  <a href={properties.registryItem.url} target="_blank">
                    {properties.registryItem.name}
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
                <td>{properties.registryItem.municipality}</td>
                <td>{getLayerRegisterName(t, properties.registryItem.type)}</td>
                <td>
                  <a href={properties.model.url} target="_blank">
                    {properties.model.name}
                  </a>
                </td>
                <td>
                  {new Date(properties.createdDate).toLocaleDateString("fi")}
                </td>
                <td>
                  <a href={properties.authorUrl} target="_blank">
                    {properties.author}
                  </a>
                </td>
                <td>
                  {properties.licenceUrl ? (
                    <a href={properties.licenceUrl} target="_blank">
                      {properties.licence}
                    </a>
                  ) : (
                    properties.licence
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
