var fs = require('fs');

var minifiedFeatures = [];
require('../data/Muinaisjaannospisteet.json').features.forEach(function(feature) {
	minifiedFeatures.push({
		m: feature.properties.Mjtunnus,
		x: feature.geometry.coordinates[0],
		y: feature.geometry.coordinates[1]
	});
});

fs.writeFile('data/Muinaisjaannospisteet_min.json', JSON.stringify(minifiedFeatures), 'utf8', function (err) {
  if (err) return console.log(err);
});