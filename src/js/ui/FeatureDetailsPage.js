import $ from "jquery";

export default function FeatureDetailsPage(
  featureParser,
  muinaismuistotSettings,
  urlHashHelper,
  eventListener
) {
  var self = this;

  $("#hide-detailsPage-button").on("click", function() {
    eventListener.hidePage();
  });

  $('#accordion a[data-toggle="collapse"]').on("click", function(e) {
    e.preventDefault();
    var clickedSectionId = $(e.target)
      .parent()
      .data("section");
    $("#" + clickedSectionId + "-collapse").toggleClass("in");

    // Collapse all other visible feature sections
    getSectionIds().forEach(function(sectionId) {
      if (sectionId === clickedSectionId) {
        return;
      }

      if ($("#" + sectionId + "-collapse-container").hasClass("hidden")) {
        return;
      }
      $("#" + sectionId + "-collapse").removeClass("in");
    });
  });

  var getSectionIds = function() {
    return [
      "muinaisjaannos",
      "muinaisjaannosalue",
      "rky",
      "maailmanperinto",
      "rakennusperintorekisteriAlue",
      "rakennusperintorekisteriRakennus",
      "ahvenamaaMuinaismuisto"
    ];
  };

  this.setMuinaisjaannosFeatures = function(features) {
    var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    var sectionVisibilityMap = {
      muinaisjaannos: false,
      muinaisjaannosalue: false,
      rky: false,
      maailmanperinto: false,
      rakennusperintorekisteriAlue: false,
      rakennusperintorekisteriRakennus: false,
      ahvenamaaMuinaismuisto: false
    };

    features.forEach(function(feature) {
      switch (feature.layerId) {
        case layerMap.Muinaisjäännökset_piste:
          showMuinaisjaannos(feature);
          sectionVisibilityMap["muinaisjaannos"] = true;
          break;
        case layerMap.Muinaisjäännökset_alue:
          showMuinaisjaannosAlue(feature);
          sectionVisibilityMap["muinaisjaannosalue"] = true;
          break;
        case layerMap.RKY_alue:
        case layerMap.RKY_viiva:
        case layerMap.RKY_piste:
          showRky(feature);
          sectionVisibilityMap["rky"] = true;
          break;
        case layerMap.Maailmanperintö_piste:
        case layerMap.Maailmanperintö_alue:
          showMaailmanperintokohde(feature);
          sectionVisibilityMap["maailmanperinto"] = true;
          break;
        case layerMap.Suojellut_rakennukset_alue:
          showRakennusperintorekisteriAlue(feature);
          sectionVisibilityMap["rakennusperintorekisteriAlue"] = true;
          break;
        case layerMap.Suojellut_rakennukset_piste:
          showRakennusperintorekisteriRakennus(feature);
          sectionVisibilityMap["rakennusperintorekisteriRakennus"] = true;
          break;
      }

      var featureId = feature.id ? feature.id : "";
      if (featureId.startsWith("fornminnen.")) {
        showahvenamaaMuinaismuisto(feature);
        sectionVisibilityMap["ahvenamaaMuinaismuisto"] = true;
      }

      updateSectionsVisibility(sectionVisibilityMap);
    });
  };

  var updateSectionsVisibility = function(sectionVisibilityMap) {
    var lastVisibleSectionId = "";
    for (var sectionId in sectionVisibilityMap) {
      if (sectionVisibilityMap.hasOwnProperty(sectionId)) {
        var sectionContainerId = sectionId + "-collapse-container";

        $("#" + sectionId + "-collapse")
          .removeClass("in") //Bootstrap opened accordion
          .removeAttr("style"); //Bootstrap JS accordion custom style "height:0px"

        if (sectionVisibilityMap[sectionId]) {
          $("#" + sectionContainerId).removeClass("hidden");
          lastVisibleSectionId = sectionId;
        } else {
          $("#" + sectionContainerId).addClass("hidden");
        }
      }
    }

    $("#" + lastVisibleSectionId + "-collapse").addClass("in");
  };

  var showMuinaisjaannos = function(feature) {
    $("#muinaisjaannos-Kohdenimi").html(trim(feature.attributes.kohdenimi));
    $("#muinaisjaannos-Kunta").html(trim(feature.attributes.kunta));

    var ajoitus = trim(feature.attributes.ajoitus);
    $("#muinaisjaannos-Ajoitus").html(ajoitus);

    var ajoitusVuodet = featureParser.getTimespanInYearsForTimingName(ajoitus);
    if (ajoitusVuodet) {
      $("#muinaisjaannos-Ajoitus-aikajanne")
        .removeClass("hidden")
        .html(ajoitusVuodet);
    } else {
      $("#muinaisjaannos-Ajoitus-aikajanne").addClass("hidden");
    }

    $("#muinaisjaannos-Tyyppi").html(trim(feature.attributes.tyyppi));
    $("#muinaisjaannos-Alatyyppi").html(trim(feature.attributes.alatyyppi));

    var laji = trim(feature.attributes.laji);
    $("#muinaisjaannos-Laji").html(laji);

    $("#muinaisjaannos-details-icon").html(
      '<img src="' + featureParser.getFeatureTypeIconURL(feature) + '">'
    );
    $("#muinaisjaannos-heading-name").html(
      featureParser.getFeatureTypeName(feature)
    );

    $("#muinaisjaannos-muinaisjaannosarekisteri-link").attr(
      "href",
      "https://" + feature.attributes.url
    );
    $("#muinaisjaannos-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );
  };

  var showMuinaisjaannosAlue = function(feature) {
    $("#muinaisjaannosalue-Kohdenimi").html(trim(feature.attributes.kohdenimi));
    $("#muinaisjaannosalue-Kunta").html(trim(feature.attributes.kunta));
    $("#muinaisjaannosalue-Laji").html(trim(feature.attributes.laji));

    var laji = trim(feature.attributes.laji);
    $("#muinaisjaannosalue-Laji").html(laji);

    $("#muinaisjaannosalue-details-icon").html(
      '<img src="' + featureParser.getFeatureTypeIconURL(feature) + '">'
    );
    $("#muinaisjaannosalue-heading-name").html(
      featureParser.getFeatureTypeName(feature)
    );

    $("#muinaisjaannosalue-muinaisjaannosarekisteri-link").attr(
      "href",
      "https://" + feature.attributes.url
    );
    $("#muinaisjaannosalue-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );
  };

  var showRky = function(feature) {
    $("#rky-details-icon").html(
      '<img src="' + featureParser.getFeatureTypeIconURL(feature) + '">'
    );
    $("#rky-Kohdenimi").html(trim(feature.attributes.kohdenimi));

    var nimi = trim(feature.attributes.nimi);
    $("#rky-Nimi").html(nimi);
    if (nimi && nimi.length > 0) {
      $("#rky-Nimi-container").removeClass("hidden");
    } else {
      $("#rky-Nimi-container").addClass("hidden");
    }

    $("#rky-link").attr("href", feature.attributes.url);
    $("#rky-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );
  };

  var showMaailmanperintokohde = function(feature) {
    $("#maailmanperinto-details-icon").html(
      '<img src="' + featureParser.getFeatureTypeIconURL(feature) + '">'
    );
    $("#maailmanperinto-Kohdenimi").html(trim(feature.attributes.Nimi));

    var url = getMaailmanperintoUrl(feature);
    $("#maailmanperinto-link").attr("href", url);

    $("#maailmanperinto-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );
  };

  var getMaailmanperintoUrl = function(feature) {
    var url = feature.attributes.URL;
    if (
      url.startsWith(
        "http://www.nba.fi/fi/ajankohtaista/kansainvalinen_toiminta/maailmanperintokohteet_suomessa"
      )
    ) {
      // Deprecated nba.fi url. Redirect to new page does not work. Create new working url.
      var hashStartIndex = url.indexOf("#");
      var hash = "";
      if (hashStartIndex !== -1) {
        hash = url.substring(hashStartIndex);
      }

      url =
        "https://www.museovirasto.fi/fi/tietoa-meista/kansainvalinen-toiminta/maailmanperintokohteet-suomessa" +
        hash;
    }
    return url;
  };

  var showRakennusperintorekisteriAlue = function(feature) {
    $("#rakennusperintorekisteriAlue-Kohdenimi").html(
      trim(feature.attributes.kohdenimi)
    );
    $("#rakennusperintorekisteriAlue-Kunta").html(
      trim(feature.attributes.kunta)
    );
    $("#rakennusperintorekisteriAlue-Suojeluryhmä").html(
      trim(feature.attributes.suojeluryhmä)
    );
    $("#rakennusperintorekisteriAlue-link").attr(
      "href",
      "http://" + feature.attributes.url
    );
    $("#rakennusperintorekisteriAlue-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );
  };

  var showRakennusperintorekisteriRakennus = function(feature) {
    $("#rakennusperintorekisteriRakennus-Kohdenimi").html(
      trim(feature.attributes.kohdenimi)
    );
    $("#rakennusperintorekisteriRakennus-Rakennusnimi").html(
      trim(feature.attributes.rakennusnimi)
    );
    $("#rakennusperintorekisteriRakennus-Kunta").html(
      trim(feature.attributes.kunta)
    );
    $("#rakennusperintorekisteriRakennus-Suojeluryhmä").html(
      trim(feature.attributes.suojeluryhmä)
    );
    $("#rakennusperintorekisteriRakennus-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );

    var url = trim(feature.attributes.url);
    if (url.length > 0) {
      $("#rakennusperintorekisteriRakennus-link").attr("href", "http://" + url);
    }
  };

  var showahvenamaaMuinaismuisto = function(feature) {
    $("#ahvenamaaMuinaismuisto-Kunta").html(feature.properties.sn);
    $("#ahvenamaaMuinaismuisto-Kyla").html(feature.properties.by_);
    $("#ahvenamaaMuinaismuisto-Kategoria").html(feature.properties.huvudkat);
    $("#ahvenamaaMuinaismuisto-Ajoitus").html(feature.properties.tid);

    var ajoitusVuodet = featureParser.getTimespanInYearsForTimingName(
      feature.properties.tid
    );
    if (ajoitusVuodet) {
      $("#ahvenamaaMuinaismuisto-Ajoitus-aikajanne")
        .removeClass("hidden")
        .html(ajoitusVuodet);
    } else {
      $("#ahvenamaaMuinaismuisto-Ajoitus-aikajanne").addClass("hidden");
    }

    $("#ahvenamaaMuinaismuisto-Tunniste").html(feature.properties.fornl);
    $("#ahvenamaaMuinaismuisto-pdf-link-Tunniste").html(
      feature.properties.fornl
    );
    $("#ahvenamaaMuinaismuisto-permanent-link").attr(
      "href",
      urlHashHelper.createLocationHash(
        featureParser.getFeatureLocation(feature)
      )
    );

    var kuvaus = feature.properties.kommentar;
    if (kuvaus && kuvaus.length > 0) {
      $("#ahvenamaaMuinaismuisto-Kuvaus-container").removeClass("hidden");
      $("#ahvenamaaMuinaismuisto-Kuvaus").html(kuvaus);
    } else {
      $("#ahvenamaaMuinaismuisto-Kuvaus-container").addClass("hidden");
    }

    $("#ahvenamaaMuinaismuisto-pdf-link").attr(
      "href",
      generateAhvenanmaaKuntaPdfUrl(feature.properties.fornl)
    );
  };

  var generateAhvenanmaaKuntaPdfUrl = function(kohteenTunniste) {
    var kunnanPdfLinkkiTunnisteenAlkukirjaimelle = {
      Br:
        "http://www.kulturarv.ax/wp-content/uploads/2014/11/BR%c3%84ND%c3%96.pdf",
      Ec: "http://www.kulturarv.ax/wp-content/uploads/2014/11/ECKER%c3%96.pdf",
      Fö:
        "http://www.kulturarv.ax/wp-content/uploads/2014/11/F%c3%96GL%c3%96.pdf",
      Fi:
        "http://www.kulturarv.ax/wp-content/uploads/2014/11/FINSTR%c3%96M.pdf",
      Ge: "http://www.kulturarv.ax/wp-content/uploads/2014/11/GETA.pdf",
      Ha: "http://www.kulturarv.ax/wp-content/uploads/2014/11/HAMMARLAND.pdf",
      Jo: "http://www.kulturarv.ax/wp-content/uploads/2014/11/JOMALA.pdf",
      Kö: "http://www.kulturarv.ax/wp-content/uploads/2014/11/K%c3%96KAR.pdf",
      Ku: "http://www.kulturarv.ax/wp-content/uploads/2014/11/KUMLINGE.pdf",
      Le: "http://www.kulturarv.ax/wp-content/uploads/2014/11/LEMLAND.pdf",
      Lu: "http://www.kulturarv.ax/wp-content/uploads/2014/11/LUMPARLAND.pdf",
      Ma: "http://www.kulturarv.ax/wp-content/uploads/2014/11/MARIEHAMN.pdf",
      Sa: "http://www.kulturarv.ax/wp-content/uploads/2014/11/SALTVIK.pdf",
      So: "http://www.kulturarv.ax/wp-content/uploads/2014/11/SOTTUNGA.pdf",
      Su: "http://www.kulturarv.ax/wp-content/uploads/2014/11/SUND.pdf",
      Vå:
        "http://www.kulturarv.ax/wp-content/uploads/2014/11/V%c3%85RD%c3%96.pdf"
    };

    return kunnanPdfLinkkiTunnisteenAlkukirjaimelle[
      kohteenTunniste.substring(0, 2)
    ];
  };

  var trim = function(value) {
    return featureParser.trimTextData(value);
  };
}
