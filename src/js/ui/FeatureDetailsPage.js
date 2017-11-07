import $ from "jquery";

export default function FeatureDetailsPage(featureParser, muinaismuistotSettings, urlHashHelper, eventListener) {
	var self = this;

	$('#hide-detailsPage-button').on('click', function() {
		eventListener.hidePage();
	});

	$('#accordion a[data-toggle="collapse"]').on('click', function(e) {
		e.preventDefault();
		var clickedSectionId = $(e.target).parent().data('section');
		$('#' + clickedSectionId + '-collapse').toggleClass('in');

		// Collapse all other visible feature sections
		getSectionIds().forEach(function(sectionId) {
			if (sectionId === clickedSectionId) {
				return;
			}

			if ($('#' +  sectionId + '-collapse-container').hasClass('hidden')) {
				return;
			}
			$('#' + sectionId + '-collapse').removeClass('in');
		});
	});

	var getSectionIds = function() {
		return [
			'muinaisjaannos',
			'muinaisjaannosalue',
			'rky',
			'maailmanperinto',
			'rakennusperintorekisteriAlue',
			'rakennusperintorekisteriRakennus',
			'ahvenamaaMuinaismuisto'
		];
	};

	this.setMuinaisjaannosFeatures = function(features) {
		var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
		var sectionVisibilityMap = {
			'muinaisjaannos': false,
			'muinaisjaannosalue': false,
			'rky': false,
			'maailmanperinto': false,
			'rakennusperintorekisteriAlue': false,
			'rakennusperintorekisteriRakennus': false,
			'ahvenamaaMuinaismuisto': false
		};

		features.forEach(function(feature) {
			switch (feature.layerId) {
				case layerMap['Muinaisjäännökset']:
				case layerMap['Muinaisj.alakohteet']:
					showMuinaisjaannos(feature);
					sectionVisibilityMap['muinaisjaannos'] = true;
					break;
				case layerMap['Muinaisjäännösalueet']:
					showMuinaisjaannosAlue(feature);
					sectionVisibilityMap['muinaisjaannosalue'] = true;
					break;
				case layerMap['RKY alueet']:
				case layerMap['RKY viivat']:
				case layerMap['RKY pisteet']:
					showRky(feature);
					sectionVisibilityMap['rky'] = true;
					break;
				case layerMap['Maailmanperintö alueet']:
				case layerMap['Maailmanperintö pisteet']:
					showMaailmanperintokohde(feature);
					sectionVisibilityMap['maailmanperinto'] = true;
					break;
				case layerMap['Rakennetut alueet']:
					showRakennusperintorekisteriAlue(feature);
					sectionVisibilityMap['rakennusperintorekisteriAlue'] = true;
					break;
				case layerMap['Rakennukset']:
					showRakennusperintorekisteriRakennus(feature);
					sectionVisibilityMap['rakennusperintorekisteriRakennus'] = true;
					break;
			}

			var featureId = feature.id ? feature.id : '';
			if (featureId.startsWith('fornminnen.')) {
				showahvenamaaMuinaismuisto(feature);
				sectionVisibilityMap['ahvenamaaMuinaismuisto'] = true;
			}

			updateSectionsVisibility(sectionVisibilityMap);
		});
	};

	var updateSectionsVisibility = function(sectionVisibilityMap) {
		var lastVisibleSectionId = '';
		for (var sectionId in sectionVisibilityMap) {
			if (sectionVisibilityMap.hasOwnProperty(sectionId)) {
				var sectionContainerId = sectionId + '-collapse-container';

				$('#' + sectionId + '-collapse')
					.removeClass('in')  //Bootstrap opened accordion
					.removeAttr( 'style' ); //Bootstrap JS accordion custom style "height:0px"

				if(sectionVisibilityMap[sectionId]) {
					$('#' + sectionContainerId).removeClass('hidden');
					lastVisibleSectionId = sectionId;
				}
				else {
					$('#' + sectionContainerId).addClass('hidden');
				}
			}
		}

		$('#' + lastVisibleSectionId + '-collapse').addClass('in');
	};

	var showMuinaisjaannos = function(feature) {
		$('#muinaisjaannos-Kohdenimi').html(trim(feature.attributes.Kohdenimi));
		$('#muinaisjaannos-Kunta').html(trim(feature.attributes.Kunta));
		$('#muinaisjaannos-Ajoitus').html(trim(feature.attributes.Ajoitus));
		$('#muinaisjaannos-Tyyppi').html(trim(feature.attributes.Tyyppi));
		$('#muinaisjaannos-Alatyyppi').html(trim(feature.attributes.Alatyyppi));
		$('#muinaisjaannos-Laji').html(trim(feature.attributes.Laji));
		$('#muinaisjaannos-muinaisjaannosarekisteri-link').attr('href', feature.attributes.URL);
		$('#muinaisjaannos-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));
	};

	var showMuinaisjaannosAlue = function(feature) {
		$('#muinaisjaannosalue-Kohdenimi').html(trim(feature.attributes.Kohdenimi));
		$('#muinaisjaannosalue-muinaisjaannosarekisteri-link').attr('href', generateKulttuuriymparistoURL(feature.attributes.Mjtunnus));
		$('#muinaisjaannosalue-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));
	};

	var showRky = function(feature) {
		$('#rky-details-icon').html('<img src="' + featureParser.getFeatureTypeIconURL(feature) + '">');
		$('#rky-Kohdenimi').html(trim(feature.attributes.KOHDENIMI));
		$('#rky-link').attr('href', generateRkyURL(feature.attributes.ID));
		$('#rky-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));
	};

	var showMaailmanperintokohde = function(feature) {
		$('#maailmanperinto-details-icon').html('<img src="' + featureParser.getFeatureTypeIconURL(feature) + '">');
		$('#maailmanperinto-Kohdenimi').html(trim(feature.attributes.Nimi));
		$('#maailmanperinto-link').attr('href', feature.attributes.URL);
		$('#maailmanperinto-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));
	};

	var showRakennusperintorekisteriAlue = function(feature) {
		$('#rakennusperintorekisteriAlue-Kohdenimi').html(trim(feature.attributes.Nimi));
		$('#rakennusperintorekisteriAlue-Kunta').html(trim(feature.attributes.Kunta));
		$('#rakennusperintorekisteriAlue-Kohdetyyppi').html(trim(feature.attributes.Kohdetyyppi));
		$('#rakennusperintorekisteriAlue-Kulttuurihist_tyyppi').html(trim(feature.attributes.Kulttuurihist_tyyppi));
		$('#rakennusperintorekisteriAlue-Suojelu').html(trim(feature.attributes.Suojelu));
		$('#rakennusperintorekisteriAlue-Ajoitus').html(trim(feature.attributes.Ajoitus));
		$('#rakennusperintorekisteriAlue-link').attr('href', generateRakennusperintorekisteriURL(feature.attributes.KOHDEID));
		$('#rakennusperintorekisteriAlue-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));
	};

	var showRakennusperintorekisteriRakennus = function(feature) {
		$('#rakennusperintorekisteriRakennus-Kohdenimi').html(trim(feature.attributes.Nimi));
		$('#rakennusperintorekisteriRakennus-Osoite').html(trim(feature.attributes.Osoite));
		$('#rakennusperintorekisteriRakennus-Suojelu').html(trim(feature.attributes.Suojelu));
		$('#rakennusperintorekisteriRakennus-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));

		var url = trim(feature.attributes.URL)
		if(url.length > 0) {
			$('#rakennusperintorekisteriRakennus-link').attr('href', url);
		}
	};

	var showahvenamaaMuinaismuisto = function(feature) {
		$('#ahvenamaaMuinaismuisto-Kunta').html(feature.properties.sn);
		$('#ahvenamaaMuinaismuisto-Kyla').html(feature.properties.by_);
		$('#ahvenamaaMuinaismuisto-Kategoria').html(feature.properties.huvudkat);
		$('#ahvenamaaMuinaismuisto-Ajoitus').html(feature.properties.tid);
		$('#ahvenamaaMuinaismuisto-Tunniste').html(feature.properties.fornl);
		$('#ahvenamaaMuinaismuisto-pdf-link-Tunniste').html(feature.properties.fornl);
		$('#ahvenamaaMuinaismuisto-permanent-link').attr('href', urlHashHelper.createLocationHash(featureParser.getFeatureLocation(feature)));

		var kuvaus = feature.properties.kommentar;
		if (kuvaus && kuvaus.length > 0) {
			$('#ahvenamaaMuinaismuisto-Kuvaus-container').removeClass('hidden');
			$('#ahvenamaaMuinaismuisto-Kuvaus').html(kuvaus);
		} else {
			$('#ahvenamaaMuinaismuisto-Kuvaus-container').addClass('hidden');
		}

		$('#ahvenamaaMuinaismuisto-pdf-link').attr('href', generateAhvenanmaaKuntaPdfUrl(feature.properties.fornl));
	};

	var generateKulttuuriymparistoURL = function(muinaisjaannosTunnus) {
		return 'https://www.kyppi.fi/palveluikkuna/mjreki/read/asp/r_kohde_det.aspx?KOHDE_ID=' + muinaisjaannosTunnus;
	};

	var generateRkyURL = function(id) {
		return 'http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=' + id;
	};

	var generateRakennusperintorekisteriURL = function(id) {
		return 'https://www.kyppi.fi/palveluikkuna/rapea/read/asp/r_kohde_det.aspx?KOHDE_ID=' + id;
	};

	var generateAhvenanmaaKuntaPdfUrl = function(kohteenTunniste) {
		var kunnanPdfLinkkiTunnisteenAlkukirjaimelle = {
			'Br': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/BR%c3%84ND%c3%96.pdf',
			'Ec': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/ECKER%c3%96.pdf',
			'Fö': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/F%c3%96GL%c3%96.pdf',
			'Fi': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/FINSTR%c3%96M.pdf',
			'Ge': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/GETA.pdf',
			'Ha': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/HAMMARLAND.pdf',
			'Jo': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/JOMALA.pdf',
			'Kö': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/K%c3%96KAR.pdf',
			'Ku': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/KUMLINGE.pdf',
			'Le': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/LEMLAND.pdf',
			'Lu': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/LUMPARLAND.pdf',
			'Ma': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/MARIEHAMN.pdf',
			'Sa': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/SALTVIK.pdf',
			'So': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/SOTTUNGA.pdf',
			'Su': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/SUND.pdf',
			'Vå': 'http://www.kulturarv.ax/wp-content/uploads/2014/11/V%c3%85RD%c3%96.pdf'
		};

		return kunnanPdfLinkkiTunnisteenAlkukirjaimelle[kohteenTunniste.substring(0, 2)];
	};

	var trim = function(value) {
		return featureParser.trimTextData(value);
	};
};
