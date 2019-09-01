import * as React from "react";

interface Props {
  visible: boolean;
}

export const LoadingAnimation: React.FC<Props> = ({ visible }) => {
  return (
    <div id="loading-animation" className={visible ? "" : "hidden"}>
      <img src="images/loading.gif" />
    </div>
  );
};
