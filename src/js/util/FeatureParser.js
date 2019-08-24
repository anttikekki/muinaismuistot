export default function FeatureParser(muinaismuistotSettings) {
  this.isKiinteäMuinaisjäännös = function(feature) {
    return (
      this.trimTextData(feature.attributes.laji) === "kiinteä muinaisjäännös"
    );
  };

  this.isMuuKulttuuriperintökohde = function(feature) {
    return (
      this.trimTextData(feature.attributes.laji) === "muu kulttuuriperintökohde"
    );
  };

  this.getFeatureName = function(feature) {
    switch (feature.layerName) {
      case "Muinaisjäännökset_piste":
      case "Muinaisjäännökset_alue":
      case "RKY_alue":
      case "RKY_piste":
      case "RKY_viiva":
      case "Suojellut_rakennukset_piste":
      case "Suojellut_rakennukset_alue":
        return feature.attributes.kohdenimi;
      case "Maailmanperintö_piste":
      case "Maailmanperintö_alue":
        return feature.attributes.Nimi;
      case "Fornminnen":
        return feature.attributes.Namn && feature.attributes.Namn !== "Null"
          ? feature.attributes.Namn
          : feature.attributes["Fornlämnings ID"];
    }
  };

  this.getFeatureTypeName = function(feature) {
    switch (feature.layerName) {
      case "Muinaisjäännökset_piste":
        if (this.isKiinteäMuinaisjäännös(feature)) {
          return "Kiinteä muinaisjäännös";
        } else if (this.isMuuKulttuuriperintökohde(feature)) {
          return "Muu kulttuuriperintökohde";
        }
        break;
      case "Muinaisjäännökset_alue":
        if (this.isKiinteäMuinaisjäännös(feature)) {
          return "Kiinteä muinaisjäännös (alue)";
        } else if (this.isMuuKulttuuriperintökohde(feature)) {
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

  this.getFeatureTypeIconURL = function(feature) {
    switch (feature.layerName) {
      case "Muinaisjäännökset_piste":
        if (this.isKiinteäMuinaisjäännös(feature)) {
          return "images/muinaisjaannos_kohde.png";
        } else if (this.isMuuKulttuuriperintökohde(feature)) {
          return "images/muu_kulttuuriperintokohde_kohde.png";
        }
        break;
      case "Muinaisjäännökset_alue":
        if (this.isKiinteäMuinaisjäännös(feature)) {
          return "images/muinaisjaannos_alue.png";
        } else if (this.isMuuKulttuuriperintökohde(feature)) {
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

  this.getFeatureLocation = function(feature) {
    if (feature.geometryType === "esriGeometryPolygon") {
      var point = feature.geometry.rings[0][0];
      return {
        x: point[0],
        y: point[1]
      };
    } else if (feature.geometryType === "esriGeometryPoint") {
      return feature.geometry;
    } else if (feature.geometryType === "esriGeometryPolyline") {
      var point = feature.geometry.paths[0][0];
      return {
        x: point[0],
        y: point[1]
      };
    } else if (feature.geometry && feature.geometry.type === "MultiPolygon") {
      // Ahvenanmaan muinaismuisto
      var point = feature.geometry.coordinates[0][0][0];
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
   * @return {string} timespan. Example: "1200 - 1600". Returns undefined if there is no timspan for timing name.
   */
  this.getTimespanInYearsForTimingName = function(name) {
    var timings = {
      Stenålder: "8600–1500 eaa.",
      Bronsålder: "1700 – 500 eaa.",
      "Brons/Ä järnålder": "1700 eaa. – 1200 jaa.",
      "Äldre järnålder": "500 eaa. – 400 jaa.",
      "Yngre järnålder": "800 – 1200 jaa.",
      Järnålder: "500 eaa. - 1200 jaa.",
      "Järnålder/Medeltid": "500 eaa. – 1570 jaa.",
      Medeltida: "1200 - 1570 jaa.",
      Sentida: "1570 jaa. -",
      esihistoriallinen: "8600 eaa. - 1200 jaa.",
      kivikautinen: "8600 – 1500 eaa.",
      varhaismetallikautinen: "1500 eaa. - 200 jaa.",
      pronssikautinen: "1700 – 500 eaa.",
      rautakautinen: "500 eaa. - 1200 jaa.",
      keskiaikainen: "1200 - 1570 jaa.",
      historiallinen: "1200 jaa. -",
      moderni: "1800 jaa -"
    };
    return timings[name];
  };

  this.trimTextData = function(value) {
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
}
