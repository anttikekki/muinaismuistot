import * as React from "react";
import { trim } from "../../../../common/util/featureParser";

interface Props {
  label: string;
  value?: string;
}

export const Field: React.FC<Props> = ({ label, value, children }) => {
  const trimmedValue = trim(value);
  if (!children && !trimmedValue) {
    return null;
  }
  return (
    <div className="form-group">
      <label>{label}</label>
      {children ? children : <p>{trimmedValue}</p>}
    </div>
  );
};
