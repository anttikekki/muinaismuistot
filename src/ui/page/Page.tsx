import * as React from "react";

export enum PageVisibility {
  Visible = "Visible",
  Closing = "Closing",
  Hidden = "Hidden"
}

interface Props {
  title: string;
  visibility: PageVisibility;
  hidePage: () => void;
}

export const Page: React.FC<Props> = ({
  title,
  visibility,
  hidePage,
  children
}) => {
  let classes = "";
  switch (visibility) {
    case PageVisibility.Visible:
      classes = "page-right-visible";
      break;
    case PageVisibility.Closing:
      classes = "page-right-closing";
      break;
    case PageVisibility.Hidden:
      classes = "page-right-hidden";
      break;
  }

  return (
    <div className={`container page ${classes}`}>
      {visibility !== PageVisibility.Hidden && (
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
      )}

      {visibility !== PageVisibility.Hidden && (
        <div className="pageContent">{children}</div>
      )}
    </div>
  );
};
