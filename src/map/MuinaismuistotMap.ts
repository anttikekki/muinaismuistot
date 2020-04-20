import "ol/ol.css";
import proj4 from "proj4";
import Map from "ol/Map";
import View from "ol/View";
import { register as registerProj4 } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";
import Collection from "ol/Collection";
import Geolocation from "ol/Geolocation";
import MaanmittauslaitosTileLayer from "./layer/MaanmittauslaitosTileLayer";
import AhvenanmaaTileLayer from "./layer/AhvenanmaaTileLayer";
import MuseovirastoTileLayer from "./layer/MuseovirastoTileLayer";
import CurrentPositionAndSelectedLocationMarkerLayer from "./layer/CurrentPositionAndSelectedLocationMarkerLayer";
import {
  ArgisFeature,
  Settings,
  DataLatestUpdateDates,
  Model,
} from "../common/types";
import MapBrowserEvent from "ol/MapBrowserEvent";
import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";
import ModelsLayer from "./layer/ModelsLayer";
import Layer from "ol/layer/Layer";
import Source from "ol/source/Source";

export interface MapEventListener {
  featuresSelected: (
    features: Array<ArgisFeature>,
    models: Array<Model>
  ) => void;
  showLoadingAnimation: (show: boolean) => void;
  featureSearchReady: (features: Array<ArgisFeature>) => void;
  dataLatestUpdateDatesReady: (dates: DataLatestUpdateDates) => void;
}

export default class MuinaismuistotMap {
  private map: Map;
  private view: View;
  private geolocation?: Geolocation;
  private maanmittauslaitosTileLayer: MaanmittauslaitosTileLayer;
  private museovirastoTileLayer: MuseovirastoTileLayer;
  private ahvenanmaaTileLayer: AhvenanmaaTileLayer;
  private positionAndSelectedLocation: CurrentPositionAndSelectedLocationMarkerLayer;
  private modelsLayer: ModelsLayer;
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
      7799839.8902,
    ];
    getProjection("EPSG:3067").setExtent(extent);

    this.view = new View({
      center: [385249.63630000036, 6672695.7579],
      projection: "EPSG:3067",
      zoom: 8,
    });

    this.map = new Map({
      target: "map",
      view: this.view,
      controls: new Collection(),
    });

    this.maanmittauslaitosTileLayer = new MaanmittauslaitosTileLayer(
      initialSettings,
      eventListeners.showLoadingAnimation,
      (mmlMaastokarttaLayer, mmlTaustakarttaLayer, mmlOrtokuvaLayer) => {
        this.map.getLayers().insertAt(0, mmlMaastokarttaLayer);
        this.map.getLayers().insertAt(1, mmlTaustakarttaLayer);
        this.map.getLayers().insertAt(2, mmlOrtokuvaLayer);
      }
    );

    this.ahvenanmaaTileLayer = new AhvenanmaaTileLayer(
      eventListeners.showLoadingAnimation,
      (createdLayer) => {
        this.map.getLayers().insertAt(3, createdLayer);
      }
    );

    this.museovirastoTileLayer = new MuseovirastoTileLayer(
      initialSettings,
      eventListeners.showLoadingAnimation,
      (createdLayer) => {
        this.map.getLayers().insertAt(4, createdLayer);
      }
    );

    this.positionAndSelectedLocation = new CurrentPositionAndSelectedLocationMarkerLayer(
      (createdLayer) => {
        this.map.getLayers().insertAt(5, createdLayer);
      }
    );

    this.modelsLayer = new ModelsLayer((createdLayer) => {
      this.map.getLayers().insertAt(6, createdLayer);
    });

    this.map.on("singleclick", this.loadFeaturesOnClickedCoordinate);
  }

  private loadFeaturesOnClickedCoordinate = (e: MapBrowserEvent) => {
    this.eventListeners.showLoadingAnimation(true);
    const ahvenanmaaQuery = this.ahvenanmaaTileLayer.identifyFeaturesAt(
      e.coordinate,
      this.map.getSize(),
      this.map.getView().calculateExtent(this.map.getSize())
    );

    const museovirastoQuery = this.museovirastoTileLayer.identifyFeaturesAt(
      e.coordinate,
      this.map.getSize(),
      this.map.getView().calculateExtent(this.map.getSize())
    );

    const modelsResult: Array<Model> = this.map
      .getFeaturesAtPixel(e.pixel, {
        layerFilter: (layer: Layer<Source>) =>
          layer === this.modelsLayer.getLayer(),
        hitTolerance: 10,
      })
      .map((feature) => feature.getProperties() as Model);

    Promise.all([ahvenanmaaQuery, museovirastoQuery]).then(
      ([ahvenanmaaResult, museovirastoResult]) => {
        this.eventListeners.showLoadingAnimation(false);
        const allFeatures = ahvenanmaaResult.results.concat(
          museovirastoResult.results
        );
        this.eventListeners.featuresSelected(allFeatures, modelsResult);
      }
    );
  };

  private initGeolocation = () => {
    this.geolocation = new Geolocation({
      projection: this.view.getProjection(),
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
      },
    });

    this.geolocation.once("change:position", this.centerToCurrentPositions);
    this.geolocation.on("change:position", this.geolocationChanged);
  };

  private geolocationChanged = () => {
    if (this.geolocation && this.geolocation.getPosition()) {
      const position = this.geolocation.getPosition();
      this.positionAndSelectedLocation.addCurrentPositionMarker(position);
    }
  };

  private zoom = (zoomChange: number) => {
    this.view.animate({
      zoom: this.view.getZoom() + zoomChange,
      duration: 250,
    });
  };

  public selectedFeatureLayersChanged = (settings: Settings): void => {
    this.museovirastoTileLayer.selectedFeatureLayersChanged(settings);
  };

  public selectedMuinaisjaannosTypesChanged = (settings: Settings): void => {
    this.museovirastoTileLayer.selectedMuinaisjaannosTypesChanged(settings);
  };

  public selectedMuinaisjaannosDatingsChanged = (settings: Settings): void => {
    this.museovirastoTileLayer.selectedMuinaisjaannosDatingsChanged(settings);
  };

  public searchFeatures = (searchText: string): void => {
    this.eventListeners.showLoadingAnimation(true);
    const ahvenanmaaQuery = this.ahvenanmaaTileLayer.findFeatures(searchText);
    const museovirastoQuery = this.museovirastoTileLayer.findFeatures(
      searchText
    );

    Promise.all([ahvenanmaaQuery, museovirastoQuery]).then(
      ([ahvenanmaaResult, museovirastoResult]) => {
        this.eventListeners.showLoadingAnimation(false);
        const allFeatures = ahvenanmaaResult.results.concat(
          museovirastoResult.results
        );
        this.eventListeners.featureSearchReady(allFeatures);
      }
    );
  };

  public selectedMaanmittauslaitosLayerChanged = (settings: Settings) => {
    this.maanmittauslaitosTileLayer.selectedMaanmittauslaitosLayerChanged(
      settings
    );
  };

  public setMapLocation = (coordinates: Coordinate) => {
    this.view.setCenter(coordinates);
  };

  public centerToCurrentPositions = () => {
    if (this.geolocation && this.geolocation.getPosition()) {
      const position = this.geolocation.getPosition();
      this.view.setCenter(position);
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

  public fetchDataLatestUpdateDates = () => {
    Promise.all([
      this.museovirastoTileLayer.getDataLatestUpdateDate(),
      this.ahvenanmaaTileLayer.getForminnenDataLatestUpdateDate(),
      this.ahvenanmaaTileLayer.getMaritimtKulturarvDataLatestUpdateDate(),
      this.modelsLayer.getDataLatestUpdateDate(),
    ])
      .then(
        ([
          museovirastoResult,
          ahvenanmaaForminnenResult,
          ahvenanmaaMaritimtKulturarvResult,
          modelsResult,
        ]) => {
          this.eventListeners.dataLatestUpdateDatesReady({
            museovirasto: museovirastoResult,
            ahvenanmaaForminnen: ahvenanmaaForminnenResult,
            ahvenanmaaMaritimtKulturarv: ahvenanmaaMaritimtKulturarvResult,
            models: modelsResult,
          });
        }
      )
      .catch(() =>
        this.eventListeners.dataLatestUpdateDatesReady({
          museovirasto: null,
          ahvenanmaaForminnen: null,
          ahvenanmaaMaritimtKulturarv: null,
          models: null,
        })
      );
  };
}
