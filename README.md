# muinaismuistot
Ohjelma Suomen muinaismuistojen näyttämiseen kartalla

Demo: http://kekki.org/muinaismuistot/

## Muinaismuistojen paikkatietojen päivitys

1. ogr2ogr -f GeoJSON Muinaisjaannospisteet.geojson Muinaisjaannospisteet_t_point.shp
2. Suorita npm run build-data