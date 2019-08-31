import * as React from "react";

interface Props {
  visible: boolean;
  hidePage: () => void;
}

export const Page: React.FC<Props> = ({ visible, hidePage, children }) => {
  return (
    <div
      id="detailsPage"
      className={`container page ${
        visible ? "page-right-visible" : "page-right-hidden"
      }`}
    >
      <div className="pageHeader">
        <button
          className="btn btn-primary btn-sm"
          id="hide-detailsPage-button"
          onClick={hidePage}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />{" "}
          Sulje
        </button>
      </div>

      <div className="pageContent">{children}</div>
    </div>
  );
};
