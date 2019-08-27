import {
  ArgisFeature,
  MuinaisjaannosPisteArgisFeature,
  MuinaisjaannosAlueArgisFeature,
  MuinaisjaannosAjoitus,
  MuinaisjaannosAjoitusTimespan
} from "../data";

export const isKiinteäMuinaisjäännös = (
  feature: MuinaisjaannosPisteArgisFeature | MuinaisjaannosAlueArgisFeature
): boolean => {
  return trimTextData(feature.attributes.laji) === "kiinteä muinaisjäännös";
};

export const isMuuKulttuuriperintökohde = (
  feature: MuinaisjaannosPisteArgisFeature | MuinaisjaannosAlueArgisFeature
): boolean => {
  return trimTextData(feature.attributes.laji) === "muu kulttuuriperintökohde";
};

export const getFeatureName = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case "Muinaisjäännökset_piste":
    case "Muinaisjäännökset_alue":
    case "RKY_alue":
    case "RKY_piste":
    case "RKY_viiva":
    case "Suojellut_rakennukset_piste":
    case "Suojellut_rakennukset_alue":
      return trimTextData(feature.attributes.kohdenimi);
    case "Maailmanperintö_piste":
    case "Maailmanperintö_alue":
      return trimTextData(feature.attributes.Nimi);
    case "Fornminnen":
      return (
        trimTextData(feature.attributes.Namn) ||
        trimTextData(feature.attributes["Fornlämnings ID"])
      );
  }
};

export const getFeatureTypeName = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case "Muinaisjäännökset_piste":
      if (isKiinteäMuinaisjäännös(feature)) {
        return "Kiinteä muinaisjäännös";
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "Muu kulttuuriperintökohde";
      }
      break;
    case "Muinaisjäännökset_alue":
      if (isKiinteäMuinaisjäännös(feature)) {
        return "Kiinteä muinaisjäännös (alue)";
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "Muu kulttuuriperintökohde (alue)";
      }
      break;
    case "RKY_alue":
    case "RKY_piste":
    case "RKY_viiva":
      return "Rakennettu kulttuuriympäristö";
    case "Maailmanperintö_piste":
    case "Maailmanperintö_alue":
      return "Maailmanperintökohde";
    case "Suojellut_rakennukset_piste":
    case "Suojellut_rakennukset_alue":
      return "Rakennusperintökohde";
    case "Fornminnen":
      return "Ahvenanmaan muinaisjäännösrekisterin kohde";
  }
};

export const getFeatureTypeIconURL = (feature: ArgisFeature): string => {
  switch (feature.layerName) {
    case "Muinaisjäännökset_piste":
      if (isKiinteäMuinaisjäännös(feature)) {
        return "images/muinaisjaannos_kohde.png";
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "images/muu_kulttuuriperintokohde_kohde.png";
      }
      break;
    case "Muinaisjäännökset_alue":
      if (isKiinteäMuinaisjäännös(feature)) {
        return "images/muinaisjaannos_alue.png";
      } else if (isMuuKulttuuriperintökohde(feature)) {
        return "images/muu-kulttuuriperintokohde-alue.png";
      }
      break;
    case "RKY_alue":
      return "images/rky_alue.png";
    case "RKY_viiva":
      return "images/rky_viiva.png";
    case "RKY_piste":
      return "images/rky_piste.png";
    case "Maailmanperintö_alue":
      return "images/maailmanperinto_alue.png";
    case "Maailmanperintö_piste":
      return "images/maailmanperinto_piste.png";
    case "Suojellut_rakennukset_alue":
      return "images/rakennusperintorekisteri_alue.png";
    case "Suojellut_rakennukset_piste":
      return "images/rakennusperintorekisteri_rakennus.png";
    case "Fornminnen":
      return "images/ahvenanmaa_muinaisjaannos.png";
  }
};

export const getFeatureLocation = (feature: ArgisFeature) => {
  switch (feature.geometryType) {
    case "esriGeometryPolygon":
      var point = feature.geometry.rings[0][0];
      return {
        x: point[0],
        y: point[1]
      };
    case "esriGeometryPoint":
      return feature.geometry;
    case "esriGeometryPolyline":
      var point = feature.geometry.paths[0][0];
      return {
        x: point[0],
        y: point[1]
      };
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

export const trimTextData = (value: string | undefined | null): string => {
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
