```
map2img -m mapserver.map -o testi.png -map_debug 3
```

```
docker run -d \
        --restart unless-stopped \
        -v /:/etc/mapserver/:ro \
        camptocamp/mapserver
```