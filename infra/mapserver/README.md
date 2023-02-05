```
map2img -m mapserver.map -o testi.png -map_debug 3
```

```
docker run --rm  \
  --mount type=bind,source=/Users/akekki/harrastusprojektit/muinaismuistot/infra/mapserver/mapserver.map,target=/etc/mapserver/mapserver.map,readonly \
  --mount type=bind,source=/Users/akekki/harrastusprojektit/muinaismuistot/infra/mapserver/strandforskjutning_1_900.gpkg,target=/etc/mapserver/strandforskjutning_1_900.gpkg,readonly \
  -p 8080:80 \
  --env MS_DEBUGLEVEL=5 camptocamp/mapserver:8.0
```
