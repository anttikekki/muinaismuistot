import * as React from "react";

interface Props {
  title: string;
  visible: boolean;
  hidePage: () => void;
}

export const Page: React.FC<Props> = ({
  title,
  visible,
  hidePage,
  children
}) => {
  return (
    <div
      className={`container page ${
        visible ? "page-right-visible" : "page-right-hidden"
      }`}
    >
      <div className="row pageHeader">
        <div className="col-xs-3">
          <button className="btn btn-primary btn-sm" onClick={hidePage}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true" />
            Sulje
          </button>
        </div>
        <div className="col-xs-9">
          <span className="pageHeaderText">{title}</span>
        </div>
      </div>

      <div className="pageContent">{visible && children}</div>
    </div>
  );
};
