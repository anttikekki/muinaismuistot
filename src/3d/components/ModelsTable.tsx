import * as React from "react";
import { GeoJSONResponse, GeoJSONFeature } from "../../common/types";
import { getLayerRegisterName } from "../../common/util/featureParser";

interface Props {
  models: Array<GeoJSONFeature>;
}

export const ModelsTable: React.FC<Props> = ({ models }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Kohde</th>
          <th>Kunta</th>
          <th>Rekisteri</th>
          <th>Mallin nimi</th>
          <th>Lisätty</th>
          <th>Tekijä/Jukaisija</th>
          <th>Lisenssi</th>
        </tr>
      </thead>
      <tbody>
        {models.map(({ properties }, i) => (
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
            <td>{new Date(properties.createdDate).toLocaleDateString("fi")}</td>
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
  );
};
