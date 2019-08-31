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
import { ArgisFeature, MaanmittauslaitosLayer, Settings } from "../data";
import MapBrowserEvent from "ol/MapBrowserEvent";
import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";

export interface MapEventListener {
  featuresSelected: (features: Array<ArgisFeature>) => void;
  showLoadingAnimation: (show: boolean) => void;
  featureSearchReady: (features: Array<ArgisFeature>) => void;
}

export default class MuinaismuistotMap {
  private map: Map;
  private view: View;
  private geolocation: Geolocation;
  private maanmittauslaitosWMTS: MaanmittauslaitosWMTS;
  private museovirastoArcGISWMS: MuseovirastoArcGISWMS;
  private ahvenanmaaWMTS: AhvenanmaaWMTS;
  private positionAndSelectedLocation: CurrentPositionAndSelectedLocationMarkerLayer;
  private eventListeners: MapEventListener;

  public constructor(
    initialSettings: Settings,
    eventListeners: MapEventListener
  ) {
    this.eventListeners = eventListeners;

    proj4.defs(
      "EPSG:3067",
      "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    );
    registerProj4(proj4);

    const extent: Extent = [
      50199.4814,
      6582464.0358,
      761274.6247,
      7799839.8902
    ];
    getProjection("EPSG:3067").setExtent(extent);

    this.view = new View({
      center: [385249.63630000036, 6672695.7579],
      projection: "EPSG:3067",
      zoom: 8
    });

    this.map = new Map({
      target: "map",
      view: this.view,
      controls: new Collection()
    });

    this.maanmittauslaitosWMTS = new MaanmittauslaitosWMTS(
      initialSettings,
      eventListeners.showLoadingAnimation,
      (mmlMaastokarttaLayer, mmlTaustakarttaLayer, mmlOrtokuvaLayer) => {
        this.map.getLayers().insertAt(0, mmlMaastokarttaLayer);
        this.map.getLayers().insertAt(1, mmlTaustakarttaLayer);
        this.map.getLayers().insertAt(2, mmlOrtokuvaLayer);
      }
    );

    this.ahvenanmaaWMTS = new AhvenanmaaWMTS(
      eventListeners.showLoadingAnimation,
      createdLayer => {
        this.map.getLayers().insertAt(3, createdLayer);
      }
    );

    this.museovirastoArcGISWMS = new MuseovirastoArcGISWMS(
      initialSettings,
      eventListeners.showLoadingAnimation,
      createdLayer => {
        this.map.getLayers().insertAt(4, createdLayer);
      }
    );

    this.positionAndSelectedLocation = new CurrentPositionAndSelectedLocationMarkerLayer(
      createdLayer => {
        this.map.getLayers().insertAt(5, createdLayer);
      }
    );

    // Fires also on double click but "singleclick" has 250 ms delay so it is too annoying to be used
    this.map.on("click", this.loadFeaturesOnClickedCoordinate);
  }

  private loadFeaturesOnClickedCoordinate = (e: MapBrowserEvent) => {
    this.eventListeners.showLoadingAnimation(true);
    const ahvenanmaaQuery = this.ahvenanmaaWMTS.identifyFeaturesAt(
      e.coordinate,
      this.map.getSize(),
      this.map.getView().calculateExtent(this.map.getSize())
    );
    const museovirastoQuery = this.museovirastoArcGISWMS.identifyFeaturesAt(
      e.coordinate,
      this.map.getSize(),
      this.map.getView().calculateExtent(this.map.getSize())
    );

    $.when(ahvenanmaaQuery, museovirastoQuery).done(
      this.resolveFeaturesFromHttpResponseAndFireEventlistener
    );
  };

  private resolveFeaturesFromHttpResponseAndFireEventlistener = (
    ahvenanmaaResult: Array<{ results: Array<ArgisFeature> }>,
    museovirastoResult: Array<{ results: Array<ArgisFeature> }>
  ) => {
    this.eventListeners.showLoadingAnimation(false);
    var ahvennamaaFeatures = ahvenanmaaResult[0].results;
    var museovirastoFeatures = museovirastoResult[0].results;
    var allFeatures = ahvennamaaFeatures.concat(museovirastoFeatures);
    if (allFeatures.length > 0) {
      this.eventListeners.featuresSelected(allFeatures);
    }
  };

  private initGeolocation = () => {
    this.geolocation = new Geolocation({
      projection: this.view.getProjection(),
      tracking: true
    });

    this.geolocation.once("change:position", this.geolocationChanged);
  };

  private geolocationChanged = () => {
    this.centerToCurrentPositions();
  };

  private zoom = (zoomChange: number) => {
    this.view.animate({
      zoom: this.view.getZoom() + zoomChange,
      duration: 250
    });
  };

  public selectedFeatureLayersChanged = (settings: Settings): void => {
    this.museovirastoArcGISWMS.selectedFeatureLayersChanged(settings);
  };

  public selectedMuinaisjaannosTypesChanged = (settings: Settings): void => {
    this.museovirastoArcGISWMS.selectedMuinaisjaannosTypesChanged(settings);
  };

  public selectedMuinaisjaannosDatingsChanged = (settings: Settings): void => {
    this.museovirastoArcGISWMS.selectedMuinaisjaannosDatingsChanged(settings);
  };

  public searchFeatures = (searchText: string): void => {
    this.eventListeners.showLoadingAnimation(true);
    var ahvenanmaaQuery = this.ahvenanmaaWMTS.findFeatures(searchText);
    var museovirastoQuery = this.museovirastoArcGISWMS.findFeatures(searchText);

    $.when(ahvenanmaaQuery, museovirastoQuery).done(
      (
        ahvenanmaaResult: Array<{ results: Array<ArgisFeature> }>,
        museovirastoResult: Array<{ results: Array<ArgisFeature> }>
      ) => {
        this.eventListeners.showLoadingAnimation(false);
        var ahvennamaaFeatures = ahvenanmaaResult[0].results;
        var museovirastoFeatures = museovirastoResult[0].results;
        var allFeatures = ahvennamaaFeatures.concat(museovirastoFeatures);
        this.eventListeners.featureSearchReady(allFeatures);
      }
    );
  };

  public selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
    this.maanmittauslaitosWMTS.selectedMaanmittauslaitosLayerChanged(settings);
  };

  public setMapLocation = (coordinates: Coordinate) => {
    this.view.setCenter(coordinates);
  };

  public centerToCurrentPositions = () => {
    if (this.geolocation && this.geolocation.getPosition()) {
      var position = this.geolocation.getPosition();
      this.view.setCenter(position);
      this.positionAndSelectedLocation.addCurrentPositionMarker(position);
    } else {
      this.initGeolocation();
    }
  };

  public showSelectedLocationMarker = (coordinates: Coordinate) => {
    this.positionAndSelectedLocation.addSelectedLocationFeatureMarker(
      coordinates
    );
  };

  public zoomIn = () => {
    this.zoom(1);
  };

  public zoomOut = () => {
    this.zoom(-1);
  };
}
