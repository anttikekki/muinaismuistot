https://www.sgu.se/produkter-och-tjanster/geologiska-data/oppna-data/jordarter-oppna-data/strandforskjutningsmodell/
https://resource.sgu.se/oppnadata/html/jordarter/strandforskjutningsmodell-nedladdning.html

Aineiston projektio: EPSG:3006 - SWEREF99 TM
Suomen projektio: EPSG:3067

Alkuperäinen EPSG:3006 Extent: [xmin ymin xmax ymax]
-113500.8304020670038881,5857147.1695998599752784 : 1214504.8304001400247216,7965502.8304001400247216

Suomen EPSG:3067 extent: [xmin ymin xmax ymax]
50199.4814 6582464.0358 761274.6247 7799839.8902

Lopullinen EPSG:3067 extent:
50199.4814 6582464.0358 761274.6247 7320000.0000

Projektion vaihto:

```
ogr2ogr strandforskjutning_1_900_EPSG-3067.gpkg -t_srs "EPSG:3067" strandforskjutning_1_900.gpkg
```

Crop Geopackage:

v1: (pelkkä data, ei koko karttaa)

```
ogr2ogr -f gpkg -spat 50199.4814 6582464.0358 761274.6247 7799839.8902 strandforskjutning_1_900_EPSG-3067_cropped.gpkg strandforskjutning_1_900_EPSG-3067.gpkg
```

v2: (koko kartta)

```
ogr2ogr -f gpkg -clipsrc 50199.4814 6582464.0358 761274.6247 7799839.8902 strandforskjutning_1_900_EPSG-3067_cropped-2.gpkg strandforskjutning_1_900_EPSG-3067.gpkg
```

v3: (lappi pois)

```
ogr2ogr -f gpkg -clipsrc 50199.4814 6582464.0358 761274.6247 7320000.0000 strandforskjutning_1_900_EPSG-3067_cropped-3.gpkg strandforskjutning_1_900_EPSG-3067.gpkg
```

Tietoja Geopackagen layerista:

```
ogrinfo strandforskjutning_1_900.gpkg issjohav_1 -summary
```

Mapserver-conffiksen testaus:

```
map2img -m mapserver.map -o testi.png -map_debug 3
```

Palvelinen käynnistys:

```
docker run --rm  \
  --mount type=bind,source=/Users/akekki/harrastusprojektit/muinaismuistot/infra/mapserver/mapserver.map,target=/etc/mapserver/mapserver.map,readonly \
  --mount type=bind,source=/Users/akekki/harrastusprojektit/muinaismuistot/infra/mapserver/strandforskjutning_1_900_EPSG-3067_cropped-3.gpkg,target=/etc/mapserver/strandforskjutning_1_900_EPSG-3067_cropped-3.gpkg,readonly \
  -p 8080:80 \
  --env MS_DEBUGLEVEL=5 camptocamp/mapserver:8.0
```

Koko kartta:

```
 curl "http://localhost:8080?map=/etc/mapserver/mapserver.map&layer=issjohav_1&mode=map" --output ./mode-map.png
```

WMS:

```
http://localhost:8080/?map=/etc/mapserver/mapserver.map&service=WMS&version=1.3.0&request=GetMap&width=1000&height=1000&styles=&layers=issjohav_1&format=image/png&crs=EPSG:3067&bbox=50199.4814,6582464.0358,761274.6247,7320000.0000
```

WMS Get Capabilities:

```
http://localhost:8080/?map=/etc/mapserver/mapserver.map&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities
```

```
docker build --tag maannousu-base:2023-03-16 --tag maannousu-base:latest --file Dockerfile.base .

docker build --tag maannousu-final:2023-03-17 --tag maannousu-final:latest --file Dockerfile.final .

docker run --rm -p 8080:80 --name maannousu-final maannousu-final:latest

docker exec -it maannousu-base bash
```
