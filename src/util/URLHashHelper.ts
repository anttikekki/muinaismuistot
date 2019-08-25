import { Coordinate } from "ol/coordinate";

export const createLocationHash = (coordinates: any) => {
  return "#x=" + coordinates.x + ";y=" + coordinates.y;
};

export const parseCoordinatesFromURL = (): Coordinate | null => {
  var coordinateArray = window.location.hash
    .replace("#", "")
    .replace("x=", "")
    .replace("y=", "")
    .split(";");

  if (coordinateArray.length !== 2) {
    return null;
  }
  const x = parseFloat(coordinateArray[0]);
  const y = parseFloat(coordinateArray[1]);

  if (!isNaN(x) && !isNaN(y)) {
    return [x, y];
  }
  return null;
};
