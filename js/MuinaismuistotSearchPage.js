var MuinaismuistotSearchPage = function() {
	var self = this;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;

		$('#hide-searchPage-button').on('click', function() {
			eventListener.hidePage();
		});

		//Ajoitus
		$('#muinaisjaannos-search-ajoitus-container input')
			.prop('checked', true)
			.change(function() {
				var ajoitukset = [];
				$('#muinaisjaannos-search-ajoitus-container :checked').each(function() {
			       ajoitukset.push($(this).val());
			    });
				var params = settings.getSearchParameters();
				params['Muinaisjäännökset'].ajoitus = ajoitukset;
				settings.setSearchParameters(params)
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

};