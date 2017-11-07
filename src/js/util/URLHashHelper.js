export default function URLHashHelper() {

  this.createLocationHash = function(coordinates) {
  	return '#x=' + coordinates.x + ';y=' + coordinates.y;
  };

  this.parseCoordinates = function() {
    var coordinateArray = window.location.hash
        .replace('#', '')
        .replace('x=', '')
        .replace('y=', '')
        .split(';');

    if(coordinateArray.length !== 2) {
      return null;
    }
    coordinateArray[0] = parseFloat(coordinateArray[0]);
    coordinateArray[1] = parseFloat(coordinateArray[1]);

    if(!isNaN(coordinateArray[0]) && !isNaN(coordinateArray[1])) {
      return coordinateArray;
    }
    return null;
  };
};
