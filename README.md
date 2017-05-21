# muinaismuistot
Ohjelma Suomen muinaismuistojen näyttämiseen kartalla.

Tekniikkana on selaimessa pyörivä [OpenLayers](http://openlayers.org/)-kartta. Palvelulla ei ole omia palvelitoiminnallisuuksia vaan kaikki data haetaan dynaamisesti avoimista rajapinnoista.

Sivusto käyttää pohjakarttana [Maanmittauslaitoksen](http://www.maanmittauslaitos.fi/kartat-ja-paikkatieto/asiantuntevalle-kayttajalle/kartta-ja-paikkatietojen-rajapintapalvelut-11) avoimesta WMTS-palvelusta saatavaa tausta- ja maastokarttaa.

Muinaisjäännösten tiedot haetaan [Museoviraston](http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer) avoimesta ArcGIS-palvelimen [WMS-palvelusta](http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/export?bbox=370057.1124662436,7303836.785799463,370265.22983375605,7303945.555638879) karttana ja muinaisjäännöspisteen yksityiskohtaiset tiedot [identify](http://kartta.nba.fi/arcgis/rest/services/WMS/MVWMS/MapServer/identify) palvelusta.

Sivusto: http://muinaismuistot.info
