import "ol/ol.css";
import $ from "jquery";
import proj4 from "proj4";
import Map from "ol/Map";
import View from "ol/View";
import { register as registerProj4 } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";
import Collection from "ol/Collection";
import Geolocation from "ol/Geolocation";
import MaanmittauslaitosWMTS from "./MaanmittauslaitosWMTS";
import AhvenanmaaWMTS from "./AhvenanmaaWMTS";
import MuseovirastoArcGISWMS from "./MuseovirastoArcGISWMS";
import CurrentPositionAndSelectedLocationMarkerLayer from "./CurrentPositionAndSelectedLocationMarkerLayer";

export default function MuinaismuistotMap(
  muinaismuistotSettings,
  eventListeners
) {
  var self = this;
  var map;
  var view;
  var geolocation;
  var maanmittauslaitosWMTS;
  var museovirastoArcGISWMS;
  var ahvenanmaaWMTS;
  var positionAndSelectedLocation;

  var init = function() {
    proj4.defs(
      "EPSG:3067",
      "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    );
    registerProj4(proj4);

    var extent = [50199.4814, 6582464.0358, 761274.6247, 7799839.8902];
    getProjection("EPSG:3067").setExtent(extent);

    view = new View({
      center: [387685, 6679679],
      projection: "EPSG:3067",
      zoom: 8
    });

    map = new Map({
      target: "map",
      view: view,
      renderer: "canvas",
      controls: new Collection()
    });

    maanmittauslaitosWMTS = new MaanmittauslaitosWMTS(
      muinaismuistotSettings,
      eventListeners.showLoadingAnimation,
      function(mmlMaastokarttaLayer, mmlTaustakarttaLayer, mmlOrtokuvaLayer) {
        map.getLayers().insertAt(0, mmlMaastokarttaLayer);
        map.getLayers().insertAt(1, mmlTaustakarttaLayer);
        map.getLayers().insertAt(2, mmlOrtokuvaLayer);
      }
    );

    ahvenanmaaWMTS = new AhvenanmaaWMTS(
      muinaismuistotSettings,
      eventListeners.showLoadingAnimation,
      function(createdLayer) {
        map.getLayers().insertAt(3, createdLayer);
      }
    );

    museovirastoArcGISWMS = new MuseovirastoArcGISWMS(
      muinaismuistotSettings,
      eventListeners.showLoadingAnimation,
      function(createdLayer) {
        map.getLayers().insertAt(4, createdLayer);
      }
    );

    positionAndSelectedLocation = new CurrentPositionAndSelectedLocationMarkerLayer(
      function(createdLayer) {
        map.getLayers().insertAt(5, createdLayer);
      }
    );

    // Fires also on double click but "singleclick" has 250 ms delay so it is too annoying to be used
    map.on("click", loadFeaturesOnClickedCoordinate);
  };

  var loadFeaturesOnClickedCoordinate = function(e) {
    eventListeners.showLoadingAnimation(true);
    var ahvenanmaaQuery = ahvenanmaaWMTS.getFeatureInfo(
      e.coordinate,
      view.getProjection(),
      view.getZoom()
    );
    var museovirastoQuery = museovirastoArcGISWMS.identifyFeaturesAt(
      e.coordinate,
      map.getSize(),
      map.getView().calculateExtent(map.getSize())
    );

    $.when(ahvenanmaaQuery, museovirastoQuery).done(
      resolveFeaturesFromHttpResponseAndFireEventlistener
    );
  };

  var resolveFeaturesFromHttpResponseAndFireEventlistener = function(
    ahvenanmaaResult,
    museovirastoResult
  ) {
    eventListeners.showLoadingAnimation(false);
    var ahvennamaaFeatures = ahvenanmaaResult[0].features;
    var museovirastoFeatures = museovirastoResult[0].results;
    var allFeatures = ahvennamaaFeatures.concat(museovirastoFeatures);
    if (allFeatures.length > 0) {
      eventListeners.muinaisjaannosFeaturesSelected(allFeatures);
    }
  };

  var initGeolocation = function() {
    geolocation = new Geolocation({
      projection: view.getProjection(),
      tracking: true
    });

    geolocation.once("change:position", geolocationChanged);
  };

  var geolocationChanged = function() {
    self.centerToCurrentPositions();
  };

  var zoom = function(zoomChange) {
    view.animate({
      zoom: view.getZoom() + zoomChange,
      duration: 250
    });
  };

  this.updateVisibleMuinaismuistotLayersFromSettings = function() {
    museovirastoArcGISWMS.updateVisibleLayersFromSettings();
  };

  this.updateMuinaismuistotFilterParamsFromSettings = function() {
    museovirastoArcGISWMS.updateVisibleLayersFromSettings();
  };

  this.searchMuinaismuistoja = function(searchText, callbackFn) {
    museovirastoArcGISWMS.findFeatures(searchText, callbackFn);
  };

  this.getVisibleMaanmittauslaitosLayerName = function() {
    return maanmittauslaitosWMTS.getVisibleLayerName();
  };

  this.setVisibleMaanmittauslaitosLayerName = function(layerName) {
    maanmittauslaitosWMTS.setVisibleLayerName(layerName);
  };

  this.setMapLocation = function(coordinates) {
    view.setCenter(coordinates);
  };

  this.centerToCurrentPositions = function() {
    if (geolocation && geolocation.getPosition()) {
      var position = geolocation.getPosition();
      view.setCenter(position);
      positionAndSelectedLocation.addCurrentPositionMarker(position);
    } else {
      initGeolocation();
    }
  };

  this.showSelectedLocationMarker = function(coordinates) {
    positionAndSelectedLocation.addSelectedLocationFeatureMarker(coordinates);
  };

  this.zoomIn = function() {
    zoom(1);
  };

  this.zoomOut = function() {
    zoom(-1);
  };

  init();
}
