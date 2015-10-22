var MuinaismuistotFilterPage = function() {
	var self = this;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;

		$('#hide-filterPage-button').on('click', function() {
			eventListener.hidePage();
		});

		//Muinaisjäännösrekisteri
		addCheckboxListener('muinaisjaannos-filter-tyyppi-container', 'Muinaisjäännökset', 'tyyppi');
		addCheckboxListener('muinaisjaannos-filter-ajoitus-container', 'Muinaisjäännökset', 'ajoitus');
		
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
				muinaismuistotSettings.setFilterParameterForLayer(layerName, paramName, selectedValues);
		});
	};

};