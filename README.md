# muinaismuistot
Ohjelma Suomen muinaismuistojen näyttämiseen kartalla.

Tekniikkana on [OpenLayers 3](http://openlayers.org/). Palvelulla ei ole omia palvelitoiminnallisuuksia vaan kaikki data haetaan dynaamisesti avoimista rajapinnoista.

Sivusto käyttää pohjakarttana [Maanmittauslaitoksen](http://www.maanmittauslaitos.fi/aineistot-palvelut/rajapintapalvelut/paikkatiedon-palvelualustan-pilotti) avoimesta WMTS-palvelusta saatavaa tausta- ja maastokarttaa.

Muinaisjäännösten tiedot haetaan [Museoviraston](http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer) avoimesta ArcGIS-palvelimen [WMS-palvelusta](http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/export?bbox=370057.1124662436,7303836.785799463,370265.22983375605,7303945.555638879) karttana ja muinaisjäännöspisteen yksityiskohtaiset tiedot [identify](http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/identify) palvelusta.

Sivusto: http://muinaismuistot.info
