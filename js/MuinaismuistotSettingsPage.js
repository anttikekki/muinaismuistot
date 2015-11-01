var MuinaismuistotSettingsPage = function() {
	var self = this;
	var eventListener;
	var settings;
	var layerCheckboxSelector = "#muinaismuistot-visible-layer-selections input";
	var layerCheckboxListerDisabled = false;

	this.init = function(muinaismuistotSettings) {
		settings = muinaismuistotSettings;
		setSelectedMuinaismuistotLayerIds(settings.getSelectedMuinaismuistotLayerIds());
		setSelectedMapBackgroundLayerName(settings.getSelectedBackgroundMapLayerName());

		$('#hide-settingsPage-button').on('click', function() {
			eventListener.hidePage();
		});

		$("input[name='selectedMapLayer']").on('change', function() {
			var mapLayerName = $(this).val();
			settings.setSelectedBackgroundMapLayerName(mapLayerName);
		});

		initLayerCheckboxChangeLister();

		//Muinaisjäännösrekisteri
		addCheckboxListener('muinaisjaannos-filter-tyyppi-container', 'Muinaisjäännökset', 'tyyppi');
		addCheckboxListener('muinaisjaannos-filter-ajoitus-container', 'Muinaisjäännökset', 'ajoitus');
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	this.setVisibleMuinaismuistotLayers = function(selectedLayerIds) {
		layerCheckboxListerDisabled = true;
		setSelectedMuinaismuistotLayerIds(selectedLayerIds);
		layerCheckboxListerDisabled = false;
	};

	var addCheckboxListener = function(inputContainerId, layerName, paramName) {
		$('#' + inputContainerId + ' input')
			.prop('checked', true) //Select all for start
			.change(function() {
				var selectedValues = [];
				$('#' + inputContainerId + ' input:checked').each(function() {
			       selectedValues.push($(this).val());
			    });
				settings.setMuinaisjaannosFilterParameter(paramName, selectedValues);
		});
	};

	var initLayerCheckboxChangeLister = function() {
		$(layerCheckboxSelector).on('change', function() {
			if(layerCheckboxListerDisabled) {
				return;
			}
			var checkbox = $(this);
			settings.layerSelectionChanged(checkbox.val(), checkbox.prop('checked') === true);
		});
	};

	var setSelectedMuinaismuistotLayerIds = function(layerIds) {
		settings.getMuinaismuistotLayerIds().forEach(function(layerId) {
			$('#settings-muinaismuistot-layer-' + layerId).prop('checked', layerIds.indexOf(layerId) !== -1);
		});
	};

	var getSelectedMuinaismuistotLayerIds = function() {
		var layerIds = [];
	    $('#muinaismuistot-visible-layer-selections :checked').each(function() {
	       layerIds.push($(this).val());
	    });
	    return layerIds;
	};

	var setSelectedMapBackgroundLayerName = function(mapName) {
		$('#map-selection-'+mapName).click();
	};

};