import {
  ArgisFeature,
  MuinaisjaannosPisteArgisFeature,
  MuinaisjaannosAlueArgisFeature,
  MuinaisjaannosAjoitus,
  MuinaisjaannosAjoitusTimespan,
  MaailmanperintoAlueArgisFeature,
  MaailmanperintoPisteArgisFeature,
  AhvenanmaaForminnenArgisFeature,
  MuseovirastoLayer,
  AhvenanmaaLayer,
  Model,
  GeoJSONFeature,
} from "../types";

export const isKiinteäMuinaisjäännös = (
  feature: MuinaisjaannosPisteArgisFeature | MuinaisjaannosAlueArgisFeature
): boolean => {
  return trim(feature.attributes.laji) === "kiinteä muinaisjäännös";
};

export const isMuuKulttuuriperintökohde = (
  feature: MuinaisjaannosPisteArgisFeature | MuinaisjaannosAlueArgisFeature
): boolean => {
  return trim(feature.attributes.laji) === "muu kulttuuriperintökohde";
};

export const getFeatureName = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
    case MuseovirastoLayer.Muinaisjäännökset_alue:
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return trim(feature.attributes.kohdenimi);
    case MuseovirastoLayer.Maailmanperintö_piste:
    case MuseovirastoLayer.Maailmanperintö_alue:
      return trim(feature.attributes.Nimi);
    case AhvenanmaaLayer.Fornminnen:
      return (
        trim(feature.attributes.Namn) ||
        trim(feature.attributes["Fornlämnings ID"])
      );
    case AhvenanmaaLayer.MaritimtKulturarv:
      return trim(feature.attributes.Namn) || trim(feature.attributes.FornID);
  }
};

export const getFeatureTypeName = (
  feature: ArgisFeature
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
      if (isKiinteäMuinaisjäännös(feature)) {
        return "Kiinteä muinaisjäännös";
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "Muu kulttuuriperintökohde";
      }
      break;
    case MuseovirastoLayer.Muinaisjäännökset_alue:
      if (isKiinteäMuinaisjäännös(feature)) {
        return "Kiinteä muinaisjäännös (alue)";
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "Muu kulttuuriperintökohde (alue)";
      }
      break;
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.RKY_viiva:
      return "Rakennettu kulttuuriympäristö";
    case MuseovirastoLayer.Maailmanperintö_piste:
    case MuseovirastoLayer.Maailmanperintö_alue:
      return "Maailmanperintökohde";
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return "Rakennusperintökohde";
    case AhvenanmaaLayer.Fornminnen:
      return "Ahvenanmaan muinaisjäännösrekisterin kohde";
    case AhvenanmaaLayer.MaritimtKulturarv:
      return "Ahvenamaan merellisen kulttuuriperintörekisterin kohde";
    default:
      return undefined;
  }
};

export const getFeatureTypeIconURL = (
  feature: ArgisFeature,
  has3dModels: boolean = false
): string | undefined => {
  const modelSuffix = has3dModels ? "_3d" : "";
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
      if (isKiinteäMuinaisjäännös(feature)) {
        return `images/muinaisjaannos_kohde${modelSuffix}.png`;
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return `images/muu_kulttuuriperintokohde_kohde${modelSuffix}.png`;
      }
      break;
    case MuseovirastoLayer.Muinaisjäännökset_alue:
      if (isKiinteäMuinaisjäännös(feature)) {
        return `images/muinaisjaannos_alue${modelSuffix}.png`;
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return `images/muu-kulttuuriperintokohde-alue${modelSuffix}.png`;
      }
      break;
    case MuseovirastoLayer.RKY_alue:
      return `images/rky_alue${modelSuffix}.png`;
    case MuseovirastoLayer.RKY_viiva:
      return `images/rky_viiva${modelSuffix}.png`;
    case MuseovirastoLayer.RKY_piste:
      return `images/rky_piste${modelSuffix}.png`;
    case MuseovirastoLayer.Maailmanperintö_alue:
      return `images/maailmanperinto_alue${modelSuffix}.png`;
    case MuseovirastoLayer.Maailmanperintö_piste:
      return `images/maailmanperinto_piste${modelSuffix}.png`;
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return `images/rakennusperintorekisteri_alue${modelSuffix}.png`;
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return `images/rakennusperintorekisteri_rakennus${modelSuffix}.png`;
    case AhvenanmaaLayer.Fornminnen:
      return `images/ahvenanmaa_muinaisjaannos${modelSuffix}.png`;
    case AhvenanmaaLayer.MaritimtKulturarv:
      return `images/ahvenanmaa_hylky${modelSuffix}.png`;
    default:
      return undefined;
  }
};

export const getLayerIconURLs = (
  layer: MuseovirastoLayer | AhvenanmaaLayer
): Array<string> => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
      return [
        "images/muinaisjaannos_kohde.png",
        "images/muu_kulttuuriperintokohde_kohde.png",
      ];
    case MuseovirastoLayer.Muinaisjäännökset_alue:
      return [
        "images/muinaisjaannos_alue.png",
        "images/muu-kulttuuriperintokohde-alue.png",
      ];
    case MuseovirastoLayer.RKY_alue:
      return ["images/rky_alue.png"];
    case MuseovirastoLayer.RKY_viiva:
      return ["images/rky_viiva.png"];
    case MuseovirastoLayer.RKY_piste:
      return ["images/rky_piste.png"];
    case MuseovirastoLayer.Maailmanperintö_alue:
      return ["images/maailmanperinto_alue.png"];
    case MuseovirastoLayer.Maailmanperintö_piste:
      return ["images/maailmanperinto_piste.png"];
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
      return ["images/rakennusperintorekisteri_alue.png"];
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return ["images/rakennusperintorekisteri_rakennus.png"];
    case AhvenanmaaLayer.Fornminnen:
      return ["images/ahvenanmaa_muinaisjaannos.png"];
    case AhvenanmaaLayer.MaritimtKulturarv:
      return ["images/ahvenanmaa_hylky.png"];
  }
};

export const getFeatureID = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
    case MuseovirastoLayer.Muinaisjäännökset_alue:
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
    case MuseovirastoLayer.Maailmanperintö_alue:
    case MuseovirastoLayer.Maailmanperintö_piste:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
    case AhvenanmaaLayer.Fornminnen:
    case AhvenanmaaLayer.MaritimtKulturarv:
      return feature.attributes.OBJECTID;
  }
};

export const getModelsForFeature = (
  feature: ArgisFeature,
  models?: Array<Model>
): Array<Model> => {
  let featureId: string | undefined;
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
      featureId = feature.attributes.mjtunnus;
      break;
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      featureId = feature.attributes.kohdeID;
      break;
    case MuseovirastoLayer.RKY_alue:
      featureId = feature.attributes.ID;
      break;
    case AhvenanmaaLayer.Fornminnen:
      featureId = feature.attributes.OBJECTID;
      break;
    case AhvenanmaaLayer.MaritimtKulturarv:
      featureId = feature.attributes.OBJECTID;
      break;
  }

  return models
    ? models
        .filter((model) => model.registryItem.type === feature.layerName)
        .filter((model) => model.registryItem.id.toString() === featureId)
    : [];
};

const getMaailmanperintoUrl = (
  feature: MaailmanperintoPisteArgisFeature | MaailmanperintoAlueArgisFeature
): string => {
  let url = feature.attributes.URL;
  if (
    url.startsWith(
      "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa"
    )
  ) {
    // Deprecated nba.fi url. Redirect to new page does not work. Create new working url.
    const hashStartIndex = url.indexOf("#");
    let hash = "";
    if (hashStartIndex !== -1) {
      hash = url.substring(hashStartIndex);
    }

    url =
      "https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa" +
      hash;
  }
  return url;
};

const generateAhvenanmaaKuntaPdfUrl = (
  feature: AhvenanmaaForminnenArgisFeature
): string | undefined => {
  switch (feature.attributes["Fornlämnings ID"].substring(0, 2)) {
    case "Br":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/BR%c3%84ND%c3%96.pdf";
    case "Ec":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/ECKER%c3%96.pdf";
    case "Fö":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/F%c3%96GL%c3%96.pdf";
    case "Fi":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/FINSTR%c3%96M.pdf";
    case "Ge":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/GETA.pdf";
    case "Ha":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/HAMMARLAND.pdf";
    case "Jo":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/JOMALA.pdf";
    case "Kö":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/K%c3%96KAR.pdf";
    case "Ku":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/KUMLINGE.pdf";
    case "Le":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/LEMLAND.pdf";
    case "Lu":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/LUMPARLAND.pdf";
    case "Ma":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/MARIEHAMN.pdf";
    case "Sa":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/SALTVIK.pdf";
    case "So":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/SOTTUNGA.pdf";
    case "Su":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/SUND.pdf";
    case "Vå":
      return "http://www.kulturarv.ax/wp-content/uploads/2014/11/V%c3%85RD%c3%96.pdf";
  }
  return undefined;
};

export const getFeatureRegisterURL = (
  feature: ArgisFeature
): string | undefined => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
    case MuseovirastoLayer.Muinaisjäännökset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return "https://" + feature.attributes.url;
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return feature.attributes.url;
    case MuseovirastoLayer.Maailmanperintö_alue:
    case MuseovirastoLayer.Maailmanperintö_piste:
      return getMaailmanperintoUrl(feature);
    case AhvenanmaaLayer.Fornminnen:
      return generateAhvenanmaaKuntaPdfUrl(feature);
  }
};

export const getFeatureRegisterName = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
    case MuseovirastoLayer.Muinaisjäännökset_alue:
      return "Muinaisjäännösrekisteristä";
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return "rky.fi rekisteristä";
    case MuseovirastoLayer.Maailmanperintö_alue:
    case MuseovirastoLayer.Maailmanperintö_piste:
      return "Museoviraston sivuilta";
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return "rakennusperintörekisteristä";
    case AhvenanmaaLayer.Fornminnen:
      return "Ahvenamaan muinaisjäännösrekisteri";
    case AhvenanmaaLayer.MaritimtKulturarv:
      return "Ahvenamaan merellinen kulttuuriperintörekisteri";
  }
};

export const getLayerRegisterName = (
  layer: MuseovirastoLayer | AhvenanmaaLayer
): string => {
  switch (layer) {
    case MuseovirastoLayer.Muinaisjäännökset_piste:
    case MuseovirastoLayer.Muinaisjäännökset_alue:
      return "Muinaisjäännösrekisteri";
    case MuseovirastoLayer.RKY_alue:
    case MuseovirastoLayer.RKY_viiva:
    case MuseovirastoLayer.RKY_piste:
      return "Valtakunnallisesti merkittävät rakennetut kulttuuriympäristöt";
    case MuseovirastoLayer.Maailmanperintö_alue:
    case MuseovirastoLayer.Maailmanperintö_piste:
      return "Maailmanperintökohteet";
    case MuseovirastoLayer.Suojellut_rakennukset_alue:
    case MuseovirastoLayer.Suojellut_rakennukset_piste:
      return "Rakennusperintörekisteri";
    case AhvenanmaaLayer.Fornminnen:
      return "Ahvenamaan muinaisjäännösrekisteri";
    case AhvenanmaaLayer.MaritimtKulturarv:
      return "Ahvenamaan merellinen kulttuuriperintörekisteri";
  }
};

export const getFeatureLocation = (
  feature: ArgisFeature
): number[] | undefined => {
  switch (feature.geometryType) {
    case "esriGeometryPolygon":
      return feature.geometry.rings[0][0];
    case "esriGeometryPoint":
      return [feature.geometry.x, feature.geometry.y];
    case "esriGeometryPolyline":
      return feature.geometry.paths[0][0];
  }
};

export const getGeoJSONFeatureLocation = (
  feature: GeoJSONFeature
): number[] => {
  switch (feature.geometry.type) {
    case "Point":
      return feature.geometry.coordinates;
    case "Polygon":
      return feature.geometry.coordinates[0][0];
  }
};

/**
 * Resolves timespan in years for timing name.
 *
 * @param {string} name Timing name in SE or FI. Example: "Sentida" or "rautakautinen".
 * @return {string} timespan. Example: "1200 - 1600". Returns empty string if there is no timspan for timing name.
 */
export const getTimespanInYearsForTimingName = (
  ajoitus: MuinaisjaannosAjoitus
) => {
  return MuinaisjaannosAjoitusTimespan[ajoitus];
};

export const trim = (value: string | undefined | null): string => {
  if (value == null) {
    //Null and undefined
    return "";
  }

  value = value.trim();
  if (value.toLowerCase() === "null") {
    return ""; //For  example RKY ajoitus field may sometimes be 'Null'
  }

  //Remove trailing commas
  while (value.substr(value.length - 1, 1) === ",") {
    value = value.substring(0, value.length - 1).trim();
  }
  return value;
};

export const getGeoJSONDataLatestUpdateDate = (
  features: Array<GeoJSONFeature>
): Date => {
  let dates = features.map((feature) =>
    new Date(feature.properties.createdDate).getTime()
  );
  dates = Array.from(new Set(dates)); // Make unique
  return new Date(Math.max.apply(null, dates));
};
