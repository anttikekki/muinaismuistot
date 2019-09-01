import * as React from "react";
import { ArgisFeature } from "../../../../data";
import {
  getFeatureTypeIconURL,
  getFeatureTypeName,
  getFeatureLocation,
  getFeatureName
} from "../../../../util/featureParser";
import { createLocationHash } from "../../../../util/URLHashHelper";

interface Props {
  isOpen: boolean;
  onToggleOpen: () => void;
  feature: ArgisFeature;
}

export const FeatureCollapsePanel: React.FC<Props> = ({
  isOpen,
  onToggleOpen,
  feature,
  children
}) => {
  const permanentLink = createLocationHash(getFeatureLocation(feature));
  const onTitleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    onToggleOpen();
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading feature-collapse-panel-heading" role="tab">
        <h4 className="panel-title">
          <a role="button" href="" onClick={onTitleClick}>
            {getFeatureName(feature)}
          </a>
          <a className="pull-right" href={permanentLink}>
            <span className="glyphicon glyphicon-link" aria-hidden="true" />
          </a>
        </h4>
        <h6 className="panel-title">
          <a role="button" href="" onClick={onTitleClick}>
            <img src={getFeatureTypeIconURL(feature)} />
            <span>{getFeatureTypeName(feature)}</span>
          </a>
        </h6>
      </div>
      <div
        className={`panel-collapse collapse ${isOpen ? "in" : ""}`}
        role="tabpanel"
      >
        <div className="panel-body">{children}</div>
      </div>
    </div>
  );
};
