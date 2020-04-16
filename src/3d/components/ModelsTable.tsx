import * as React from "react";
import { Model } from "../../common/types";
import { getLayerRegisterName } from "../../common/util/featureParser";

type Feature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: Array<number>;
  };
  properties: Model;
};

type GeoJSONResponse = {
  type: "FeatureCollection";
  features: Array<Feature>;
};

export const ModelsTable: React.FC = () => {
  const [features, setFeatures] = React.useState<Array<Feature>>([]);

  React.useEffect(() => {
    fetch("3d.json")
      .then((response) => response.json())
      .then((data) => data as GeoJSONResponse)
      .then((data) => setFeatures(data.features));
  }, []);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Kohde</th>
          <th>Rekisteri</th>
          <th>Mallin nimi</th>
          <th>Lisätty</th>
          <th>Tekijä/Jukaisija</th>
          <th>Lisenssi</th>
        </tr>
      </thead>
      <tbody>
        {features.map(({ properties }, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>
              <a href={properties.registryItem.url} target="_blank">
                {properties.registryItem.name}
              </a>
            </td>
            <td>{getLayerRegisterName(properties.registryItem.type)}</td>
            <td>
              <a href={properties.model.url} target="_blank">
                {properties.model.name}
              </a>
            </td>
            <td>{new Date(properties.createdDate).toLocaleDateString("fi")}</td>
            <td>{properties.author}</td>
            <td>
              <a href={properties.licenceUrl} target="_blank">
                {properties.licence}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
