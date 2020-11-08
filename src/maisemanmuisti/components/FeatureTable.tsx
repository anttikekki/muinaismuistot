import * as React from "react";
import {
  GeoJSONFeature,
  MaisemanMuistiFeatureProperties,
} from "../../common/types";
import { createLocationHash } from "../../common/util/URLHashHelper";

interface SubFeature {
  id: number;
  coordinates: [number, number];
}

interface GroupedFeature {
  number: number;
  name: string;
  municipality: string;
  region: string;
  subFeatures: Array<SubFeature>;
}

interface Props {
  features: Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>;
}

const groupFeatures = (
  features: Array<GeoJSONFeature<MaisemanMuistiFeatureProperties>>
): Array<GroupedFeature> => {
  const result = new Map<number, GroupedFeature>();

  features.forEach((f) => {
    const { id, municipality, name, number, region } = f.properties;

    const subFeature: SubFeature = {
      id,
      coordinates:
        f.geometry.type === "Point"
          ? f.geometry.coordinates
          : f.geometry.coordinates[0][0],
    };

    if (result.has(number)) {
      result.get(number)?.subFeatures.push(subFeature);
    } else {
      result.set(number, {
        number,
        name,
        municipality,
        region,
        subFeatures: [subFeature],
      });
    }
  });

  return Array.from(result, (pair) => pair[1]);
};

const NameColumn: React.FC<{ feature: GroupedFeature }> = ({ feature }) => {
  if (feature.subFeatures.length === 1) {
    return (
      <td>
        <a
          href={`https://www.kyppi.fi/to.aspx?id=112.${feature.subFeatures[0].id}`}
          target="_blank"
        >
          {feature.name}
        </a>
      </td>
    );
  }
  return (
    <td>
      <p>{feature.name}</p>
      {feature.subFeatures.map((subFeature, index) => (
        <p>
          <a
            href={`https://www.kyppi.fi/to.aspx?id=112.${subFeature.id}`}
            target="_blank"
          >
            {`Kohde #${index + 1}`}
          </a>{" "}
          [
          <a
            href={`../${createLocationHash(subFeature.coordinates)}`}
            target="_blank"
          >
            kartta
          </a>
          ]
        </p>
      ))}
    </td>
  );
};

const MapColumn: React.FC<{ feature: GroupedFeature }> = ({ feature }) => {
  if (feature.subFeatures.length > 1) {
    return <td></td>;
  }
  return (
    <td>
      [
      <a
        href={`../${createLocationHash(feature.subFeatures[0].coordinates)}`}
        target="_blank"
      >
        kartta
      </a>
      ]
    </td>
  );
};

export const FeatureTable: React.FC<Props> = ({ features }) => {
  const [sortedFeatures, setSortedFeatures] = React.useState<
    Array<GroupedFeature>
  >([]);
  const [sortColumn, setSortColumn] = React.useState<string>("Lisätty");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );

  React.useEffect(() => setSortedFeatures(groupFeatures(features)), [features]);

  const onSortClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    newSortColumn: string,
    compareFn: (a: GroupedFeature, b: GroupedFeature) => number
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

    let sortResult = [...sortedFeatures].sort(compareFn);
    sortResult =
      newSortDirection === "desc" ? sortResult.reverse() : sortResult;
    setSortedFeatures(sortResult);
  };

  const StringColumnHeader: React.FC<{
    name: string;
    valueFn: (v: GroupedFeature) => string;
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

  const NumberColumnHeader: React.FC<{
    name: string;
    valueFn: (v: GroupedFeature) => number;
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
    );
  };

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
          </a>{" "}
          paitsi kohteissa jotka koostuvat monesta muinaisjäännöksessä. Näissä
          linkki on alakohteen numero.
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
        -sivustolta.
      </p>

      <table className="table table-striped">
        <thead>
          <tr>
            <NumberColumnHeader name="Numero" valueFn={(v) => v.number} />
            <StringColumnHeader name="Nimi" valueFn={(v) => v.name} />
            <th></th>
            <StringColumnHeader name="Kunta" valueFn={(v) => v.municipality} />
            <StringColumnHeader name="Maakunta" valueFn={(v) => v.region} />
          </tr>
        </thead>
        <tbody>
          {sortedFeatures.map((feature, i) => {
            const { number, municipality, region } = feature;
            return (
              <tr key={number}>
                <td>{number}</td>
                <NameColumn feature={feature} />
                <MapColumn feature={feature} />
                <td>{municipality}</td>
                <td>{region}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
