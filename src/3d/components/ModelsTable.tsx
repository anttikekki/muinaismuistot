import * as React from "react";
import { GeoJSONResponse, GeoJSONFeature } from "../../common/types";
import { getLayerRegisterName } from "../../common/util/featureParser";

interface Props {
  models: Array<GeoJSONFeature>;
}

export const ModelsTable: React.FC<Props> = ({ models }) => {
  const [sortedModels, setSortedModels] = React.useState<Array<GeoJSONFeature>>(
    []
  );
  const [sortColumn, setSortColumn] = React.useState<string>("Lisätty");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );

  React.useEffect(() => setSortedModels(models), [models]);

  const onSortClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newSortColumn: string,
    compareFn: (a: GeoJSONFeature, b: GeoJSONFeature) => number
  ) => {
    event.preventDefault();

    let newSortDirection = sortDirection;
    if (newSortColumn === sortColumn) {
      newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      setSortColumn(newSortColumn);
      newSortDirection = "asc";
    }
    setSortDirection(newSortDirection);

    let sortResult = [...sortedModels].sort(compareFn);
    sortResult =
      newSortDirection === "desc" ? sortResult.reverse() : sortResult;
    setSortedModels(sortResult);
  };

  const ColumnHeader: React.FC<{
    name: string;
    valueFn: (v: GeoJSONFeature) => string;
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
    );
  };

  return (
    <>
      <h2 id="listaus">Aineston listaus</h2>
      <p>
        Tässä listattu koko tietokannan sisältö. Kaikki tämän taulukon tiedot
        löytyvät suoraan tietokannasta. Kohteen nimi on linkki suoraan
        Museoviraston ja Ahvenanmaan paikallishallinnon rekisteriin. Mallin nimi
        on linkki 3D-malliin{" "}
        <a href="https://sketchfab.com" target="_blank">
          Sketchfab
        </a>
        -sivustolla.
      </p>
      <p>
        Tämän aineston näkee kartalla{" "}
        <a href="https://muinaismuistot.info" target="_blank">
          muinaismuistot.info
        </a>{" "}
        -sivustolta.
      </p>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <ColumnHeader
              name="Kohde"
              valueFn={(v) => v.properties.registryItem.name}
            />
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
          {sortedModels.map(({ properties }, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <a href={properties.registryItem.url} target="_blank">
                  {properties.registryItem.name}
                </a>
              </td>
              <td>{properties.registryItem.municipality}</td>
              <td>{getLayerRegisterName(properties.registryItem.type)}</td>
              <td>
                <a href={properties.model.url} target="_blank">
                  {properties.model.name}
                </a>
              </td>
              <td>
                {new Date(properties.createdDate).toLocaleDateString("fi")}
              </td>
              <td>{properties.author}</td>
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
          ))}
        </tbody>
      </table>
    </>
  );
};
