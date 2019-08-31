import * as React from "react";
import { ArgisFeature } from "../../../data";
import { getFeatureID } from "../../../util/FeatureParser";
import { Page } from "../Page";

interface Props {
  visible: boolean;
  hidePage: () => void;
  searchFeatures: (searchText: string) => void;
  searchResultFeatures?: Array<ArgisFeature>;
}

export const SearchPage: React.FC<Props> = ({
  visible,
  hidePage,
  searchFeatures,
  searchResultFeatures
}) => {
  return (
    <Page visible={visible} hidePage={hidePage}>
      <form id="search-form">
        <div
          id="search-form-error"
          className="alert alert-danger hidden"
          role="alert"
        >
          Hakusanan pitää olla vähintään kolme merkkiä
        </div>
        <div className="input-group">
          <input
            type="text"
            id="search-text"
            className="form-control"
            placeholder="Kirjoita nimi tai sen osa"
          />
          <span className="input-group-btn">
            <button
              id="search-button"
              className="btn btn-default"
              type="button"
            >
              Hae
            </button>
          </span>
        </div>
      </form>

      <h5 id="search-result-header" className="hidden">
        Hakutulokset
        <small id="search-result-count" />
      </h5>

      <div id="search-results-container" />
    </Page>
  );
};
