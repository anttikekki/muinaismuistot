var MuinaismuistotSearchPage = function() {
	var self = this;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;

		$('#hide-searchPage-button').on('click', function() {
			eventListener.hidePage();
		});

		//Muinaisjäännösrekisteri
		addCheckboxListener('muinaisjaannos-search-tyyppi-container', 'Muinaisjäännökset', 'tyyppi');
		addCheckboxListener('muinaisjaannos-search-ajoitus-container', 'Muinaisjäännökset', 'ajoitus');
		
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	var addCheckboxListener = function(inputContainerId, layerName, paramName) {
		$('#' + inputContainerId + ' input')
			.prop('checked', true) //Select all for start
			.change(function() {
				var selectedValues = [];
				$('#' + inputContainerId + ' input:checked').each(function() {
			       selectedValues.push($(this).val());
			    });
				var params = muinaismuistotSettings.getSearchParameters();
				params[layerName][paramName] = selectedValues;
				muinaismuistotSettings.setSearchParameters(params)
		});
	};

};