import $ from "jquery";
import TileLayer from "ol/layer/tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTSSource from "ol/source/WMTS";
import extent from "ol/extent";
import reproj from "ol/reproj";
import proj from "ol/proj";
import size from "ol/size";

export default function AhvenanmaaWMTS(
  muinaismuistotSettings,
  showLoadingAnimationFn,
  onLayerCreatedCallbackFn
) {
  var source;
  var layer;

  var init = function() {
    loadAlandWmtsCapabilitiesAndAddLayers();
  };

  var loadAlandWmtsCapabilitiesAndAddLayers = function() {
    $.ajax({
      url: muinaismuistotSettings.getAhvenanmaaWMTSCapabilitiesURL(),
      success: function(response) {
        addAlandWmtsLayers(response);
      }
    });
  };

  var addAlandWmtsLayers = function(response) {
    var parser = new WMTSCapabilities();
    var capabilities = parser.read(response);

    source = new WMTSSource(
      WMTSSource.optionsFromCapabilities(capabilities, {
        layer: "inspire:fornminnen",
        format: "image/png"
      })
    );

    layer = new TileLayer({
      title: "Ahvenanmaa",
      source: source,
      visible: true
    });

    layer.setOpacity(0.7);
    onLayerCreatedCallbackFn(layer);
  };

  /**
   * Ahvenmaa WMTS layer projection EPSG:4326 is different than in View projection EPSG:3067 so we need to
   * transform clicked coordinate.
   *
   * @param {ol.Coordinate} clickedViewProjectionCoordinate Clicked view projection EPSG:3067 coordinate (example: [120085.10887374285, 6693391.965484285]).
   * @param {ol.proj.Projection} viewProjection View projection EPSG:3067.
   * @return {ol.Coordinate} Coordinate in EPSG:4326 (example: [20.13916745874376, 60.199400306258006]).
   */
  var transformClickedCoordinateFromViewProjectionToAhvenanmaaWMTSProjection = function(
    clickedViewProjectionCoordinate,
    viewProjection
  ) {
    var ahvenanmaaWMTSProjection = source.getProjection().getCode();
    return proj.transform(
      clickedViewProjectionCoordinate,
      viewProjection,
      ahvenanmaaWMTSProjection
    );
  };

  /**
   * Ahvenmaa WMTS layer resolution is different than in View EPSG:3067 projection so we need to
   * calculate correct resolution.
   *
   * Code copied from ol.reproj.Tile
   *
   * @param {ol.Coordinate} clickedViewProjectionCoordinate Clicked view projection EPSG:3067 coordinate (example: [120085.10887374285, 6693391.965484285]).
   * @param {ol.proj.Projection} viewProjection View projection EPSG:3067.
   * @param {number} viewZoomLevel View zoom level (example: 8).
   * @return {number} Resolution in EPSG:4326 (example: 0.00008308617923688985).
   */
  var calculateAhvenanmaaWMTSResolution = function(
    clickedViewProjectionCoordinate,
    viewProjection,
    viewZoomLevel
  ) {
    var sourceProjection = source.getProjection();
    var targetProjection = viewProjection;
    var sourceTileGrid = source.getTileGridForProjection(sourceProjection);
    var targetTileGrid = source.getTileGridForProjection(targetProjection);

    var targetTileCoord = targetTileGrid.getTileCoordForCoordAndZ(
      clickedViewProjectionCoordinate,
      viewZoomLevel
    );
    var targetExtent = targetTileGrid.getTileCoordExtent(targetTileCoord);
    var targetResolution = targetTileGrid.getResolution(viewZoomLevel);
    var targetCenter = extent.getCenter(targetExtent);
    return reproj.calculateSourceResolution(
      sourceProjection,
      targetProjection,
      targetCenter,
      targetResolution
    );
  };

  /**
   * Ahvenmaa WMTS layer zoom level is different than in View EPSG:3067 projection so we need to
   * calculate correct zoom level.
   *
   * @param {number} ahvenanmaaWMTSResolution Resolution in EPSG:4326 (example: 0.00008308617923688985).
   * @return {number} Zoom level in EPSG:4326 (example: 12).
   */
  var calculateAhvenanmaaWMTSZoomLevel = function(ahvenanmaaWMTSResolution) {
    var tileGrid = source.getTileGrid();
    return tileGrid.getZForResolution(ahvenanmaaWMTSResolution);
  };

  /**
   * Transforms EPSG:4326 coordinate to tile pixel. Tile is 256 x 256 px image in map.
   *
   * Code copied OpenLayers WMTS FeatureInfo pull request https://github.com/openlayers/openlayers/pull/2373/files
   *
   * @param {ol.Coordinate} clickedCoordinateInAhvenanmaaWMTSProjection Clicked coordinate in EPSG:4326 projection (example: [20.13916745874376, 60.199400306258006]).
   * @param {number} ahvenanmaaWMTSResolution Resolution in EPSG:4326 (example: 0.00008308617923688985).
   * @return {ol.Coordinate} Clicked tile pixel (example: [147, 68]).
   */
  var calculateClickedAhvenanmaaWMTSTilePixel = function(
    clickedCoordinateInAhvenanmaaWMTSProjection,
    ahvenanmaaWMTSResolution
  ) {
    var tileGrid = source.getTileGrid();
    var ahvenanmaaWMTSZoomLevel = calculateAhvenanmaaWMTSZoomLevel(
      ahvenanmaaWMTSResolution
    );
    var tileCoord = tileGrid.getTileCoordForCoordAndZ(
      clickedCoordinateInAhvenanmaaWMTSProjection,
      ahvenanmaaWMTSZoomLevel
    );
    var tileExtent = tileGrid.getTileCoordExtent(tileCoord);
    var tileSize = size.toSize(tileGrid.getTileSize(ahvenanmaaWMTSZoomLevel));
    var pixelRatio = source.getTilePixelRatio();

    var x = Math.floor(
      (clickedCoordinateInAhvenanmaaWMTSProjection[0] - tileExtent[0]) /
        (ahvenanmaaWMTSResolution / pixelRatio)
    );
    var y = Math.floor(
      (tileExtent[3] - clickedCoordinateInAhvenanmaaWMTSProjection[1]) /
        (ahvenanmaaWMTSResolution / pixelRatio)
    );

    /*
     * Above calculation produces few pixel too large results. This is problem near the tile borders
     * where x or y could go up to 257 or 258 when maximum is tile size 256. Cap values to 256 to fix this.
     */
    x = Math.min(x, tileSize[0]);
    y = Math.min(y, tileSize[1]);

    return [x, y];
  };

  /**
   * Create WMTS GetFeatureInfo url for Ahvenanmaa WMTS
   *
   * @param {ol.Coordinate} clickedCoordinateInAhvenanmaaWMTSProjection Clicked coordinate in EPSG:4326 projection (example: [20.13916745874376, 60.199400306258006]).
   * @param {number} ahvenanmaaWMTSZoomLevel Zoom level in EPSG:4326 (example: 12).
   * @param {ol.Coordinate} clickedAhvenanmaaWMTSTilePixel Clicked tile pixel (example: [147, 68]).
   * @return {string} GetFeatureInfo Url. Example (line changes added): "https://d1f9arsuysrzgl.cloudfront.net/
   *  ?layer=inspire%3Afornminnen
   *  &style=
   *  &tilematrixset=EPSG%3A4326
   *  &Service=WMTS
   *  &Request=GetFeatureInfo
   *  &Version=1.0.0
   *  &Format=image%2Fpng
   *  &TileMatrix=EPSG%3A4326%3A13
   *  &TileCol=9110
   *  &TileRow=1356
   *  &INFOFORMAT=application%2Fjson
   *  &I=38
   *  &J=210"
   */
  var getFeatureInfoUrl = function(
    clickedCoordinateInAhvenanmaaWMTSProjection,
    ahvenanmaaWMTSZoomLevel,
    clickedAhvenanmaaWMTSTilePixel
  ) {
    var tileGrid = source.getTileGrid();
    var tileCoord = tileGrid.getTileCoordForCoordAndZ(
      clickedCoordinateInAhvenanmaaWMTSProjection,
      ahvenanmaaWMTSZoomLevel
    );
    var tileUrlFunction = source.getTileUrlFunction();
    var pixelRatio = source.getTilePixelRatio();
    var sourceProjection = source.getProjection();
    var tileUrl = tileUrlFunction.call(
      source,
      tileCoord,
      pixelRatio,
      sourceProjection
    );

    return (
      tileUrl.replace("Request=GetTile", "Request=GetFeatureInfo") +
      "&INFOFORMAT=" +
      encodeURIComponent("application/json") +
      "&I=" +
      clickedAhvenanmaaWMTSTilePixel[0] +
      "&J=" +
      clickedAhvenanmaaWMTSTilePixel[1]
    );
  };

  /**
   * Checks if clicked EPSG:4326 coordinate is inside Ahvenanmaa WMTS data extent (area).
   *
   * @param {ol.Coordinate} clickedCoordinateInAhvenanmaaWMTSProjection Clicked coordinate in EPSG:4326 projection (example: [20.13916745874376, 60.199400306258006]).
   * @return {boolean} True clicked coordinate is inside Ahvenanmaa WMTS data extent
   */
  var isCoordinateInsideAhvenmaaWMTSTileGrid = function(
    clickedCoordinateInAhvenanmaaWMTSProjection
  ) {
    return extent.containsCoordinate(
      source.getTileGrid().getExtent(),
      clickedCoordinateInAhvenanmaaWMTSProjection
    );
  };

  /**
  * Loads features with GetFeatureInfo request from Ahvenanmaa WMTS service for clicked coordinate.
  *
  * @param {ol.Coordinate} clickedViewProjectionCoordinate Clicked view projection EPSG:3067 coordinate (example: [120085.10887374285, 6693391.965484285]).
  * @param {ol.proj.Projection} viewProjection View projection EPSG:3067.
  * @param {number} viewZoomLevel View zoom level (example: 8).
  * @return {jQuery.jqXHR} jQuery XMLHttpRequest for HTTP request. Example of response payload:
  {
    "type": "FeatureCollection",
    "totalFeatures": "unknown",
    "features": [
      {
        "type": "Feature",
        "id": "fornminnen.120",
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
            [
              [
                [121303.32407870464, 6693345.780128546],
                [121286.80985667056, 6693414.75746031],
                [121281.00085634645, 6693482.451980942],
                [121298.25663466856, 6693489.197676873],
                [121314.41457159346, 6693475.621371474],
                [121346.16097760451, 6693375.908598265],
                [121303.32407870464, 6693345.780128546]
              ]
            ]
          ]
        },
        "geometry_name": "geom",
        "properties": {
          "gid": 120,
          "fornl": "Su 27.2",
          "sn": "Sund",
          "by_": "Tranvik",
          "huvudkat": "Höggravfält",
          "antal_anl": 26,
          "tid": "Yngre järnålder",
          "annan_kat": "Husgrund",
          "kommentar": "1 st, yngre järnålder",
          "reg_datum": "2013-06-10Z",
          "inmätning": null,
          "info": null
        }
      }
    ],
    "crs": {
      "type": "name",
      "properties": {
        "name": "urn:ogc:def:crs:EPSG::3067"
      }
    }
  }
  */
  this.getFeatureInfo = function(
    clickedViewProjectionCoordinate,
    viewProjection,
    viewZoomLevel
  ) {
    /*
     * Make sure that zoom level is integer. This may be decimal (9.141352016977429) if map is zoomed very far away and
     * then zoomed back closer. calculateAhvenanmaaWMTSResolution method requires that zoom is integer.
     */
    viewZoomLevel = Math.floor(viewZoomLevel);

    var clickedCoordinateInAhvenanmaaWMTSProjection = transformClickedCoordinateFromViewProjectionToAhvenanmaaWMTSProjection(
      clickedViewProjectionCoordinate,
      viewProjection
    );

    if (
      !isCoordinateInsideAhvenmaaWMTSTileGrid(
        clickedCoordinateInAhvenanmaaWMTSProjection
      )
    ) {
      // Returns resolved Promise with data that mimicks JQuery Ajax response
      return $.Deferred().resolveWith(self, [{ features: [] }, {}]);
    }

    var ahvenanmaaWMTSResolution = calculateAhvenanmaaWMTSResolution(
      clickedViewProjectionCoordinate,
      viewProjection,
      viewZoomLevel
    );
    var ahvenanmaaWMTSZoomLevel = calculateAhvenanmaaWMTSZoomLevel(
      ahvenanmaaWMTSResolution
    );
    var clickedAhvenanmaaWMTSTilePixel = calculateClickedAhvenanmaaWMTSTilePixel(
      clickedCoordinateInAhvenanmaaWMTSProjection,
      ahvenanmaaWMTSResolution
    );
    var featureInfoUrl = getFeatureInfoUrl(
      clickedCoordinateInAhvenanmaaWMTSProjection,
      ahvenanmaaWMTSZoomLevel,
      clickedAhvenanmaaWMTSTilePixel
    );

    showLoadingAnimationFn(true);

    return $.getJSON(featureInfoUrl).done(function(response) {
      showLoadingAnimationFn(false);
    });
  };

  init();
}
