var MuinaismuistotDetailsPage = function() {
	var self = this;
	var muinaisjaannosFeatures = null;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;

		$('#hide-detailsPage-button').on('click', function() {
			eventListener.hideDetailsPage();
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	this.setMuinaisjaannosFeatures = function(features) {
		muinaisjaannosFeatures = features;
		var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
		var sectionVisibilityMap = {
			'muinaisjaannos-collapse-container': false,
			'muinaisjaannosalue-collapse-container': false,
			'rky-collapse-container': false,
			'maailmanperinto-collapse-container': false,
			'rakennusperintorekisteri-collapse-container': false,
		};

		features.forEach(function(feature) {
			switch (feature.layerId) {
				case layerMap['Muinaisjäännökset']:
					showMuinaisjaannos(feature);
					sectionVisibilityMap['muinaisjaannos-collapse-container'] = true;
					break;
				case layerMap['Muinaisjäännösalueet']:
					showMuinaisjaannosAlue(feature);
					sectionVisibilityMap['muinaisjaannosalue-collapse-container'] = true;
					break;
				case layerMap['RKY alueet']:
					showRkyAlue(feature);
					sectionVisibilityMap['rky-collapse-container'] = true;
					break;
				case layerMap['Maailmanperintö alueet']:
					showMaailmanperintokohde(feature);
					sectionVisibilityMap['maailmanperinto-collapse-container'] = true;
					break;
				case layerMap['Rakennetut alueet']:
					showRakennusperintorekisteriKohde(feature);
					sectionVisibilityMap['rakennusperintorekisteri-collapse-container'] = true;
					break;
			}

			for (var sectionId in sectionVisibilityMap) {
				if(sectionVisibilityMap[sectionId]) {
					$('#' + sectionId).removeClass('hidden');
				}
				else {
					$('#' + sectionId).addClass('hidden');
				}
			}
		});
	};

	var showMuinaisjaannos = function(feature) {
		$('#muinaisjaannos-Kohdenimi').html(feature.attributes.Kohdenimi.trim());
		$('#muinaisjaannos-Ajoitus').html(feature.attributes.Ajoitus.trim());
		$('#muinaisjaannos-Tyyppi').html(feature.attributes.Tyyppi.trim());
		$('#muinaisjaannos-Alatyyppi').html(feature.attributes.Alatyyppi.trim());
		$('#muinaisjaannos-Laji').html(feature.attributes.Laji.trim());
		$('#muinaisjaannos-muinaisjaannosarekisteri-link').attr('href', feature.attributes.URL);
	};

	var showMuinaisjaannosAlue = function(feature) {
		$('#muinaisjaannosalue-Kohdenimi').html(feature.attributes.Kohdenimi.trim());
		$('#muinaisjaannosalue-muinaisjaannosarekisteri-link').attr('href', generateKulttuuriymparistoURL(feature.attributes.Mjtunnus));
	};

	var showRkyAlue = function(feature) {
		$('#rky-Kohdenimi').html(feature.attributes.KOHDENIMI.trim());
		$('#rky-link').attr('href', generateRkyURL(feature.attributes.ID));
	};

	var showMaailmanperintokohde = function(feature) {
		$('#maailmanperinto-Kohdenimi').html(feature.attributes.Nimi.trim());
		$('#maailmanperinto-link').attr('href', feature.attributes.URL);
	};

	var showRakennusperintorekisteriKohde = function(feature) {
		$('#rakennusperintorekisteri-Kohdenimi').html(feature.attributes.Nimi.trim());
		$('#rakennusperintorekisteri-Kunta').html(feature.attributes.Kunta.trim());
		$('#rakennusperintorekisteri-Kohdetyyppi').html(feature.attributes.Kohdetyyppi.trim());
		$('#rakennusperintorekisteri-Kulttuurihist_tyyppi').html(feature.attributes.Kulttuurihist_tyyppi.trim());
		$('#rakennusperintorekisteri-Suojelu').html(feature.attributes.Suojelu.trim());
		$('#rakennusperintorekisteri-Ajoitus').html(feature.attributes.Ajoitus.trim());
		$('#rakennusperintorekisteri-link').attr('href', generateRakennusperintorekisteriURL(feature.attributes.KOHDEID));
	};

	var generateKulttuuriymparistoURL = function(muinaisjaannosTunnus) {
		return 'http://kulttuuriymparisto.nba.fi/netsovellus/rekisteriportaali/portti/default.aspx?sovellus=mjreki&taulu=T_KOHDE&tunnus=' + muinaisjaannosTunnus;
	};

	var generateRkyURL = function(id) {
		return 'http://www.rky.fi/read/asp/r_kohde_det.aspx?KOHDE_ID=' + id;
	};

	var generateRakennusperintorekisteriURL = function(id) {
		return 'http://kulttuuriymparisto.nba.fi/netsovellus/rekisteriportaali/rapea/read/asp/r_kohde_det.aspx?KOHDE_ID=' + id;
	};
};