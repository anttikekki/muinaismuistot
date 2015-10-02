var MuinaismuistotSettingsPage = function() {
	var self = this;
	var eventListener;
	var muinaismuistotSettings;

	this.init = function(settings) {
		muinaismuistotSettings = settings;
		setSelectedMuinaismuistotLayerIds(settings.getSelectedMuinaismuistotLayerIds());
		setSelectedMapBackgroundLayerName(settings.getSelectedBackgroundMapLayerName());

		$('#hide-settingsPage-button').on('click', function() {
			eventListener.hidePage();
		});

		$("input[name='selectedMapLayer']").change(function() {
			var mapLayerName = $(this).val();
			settings.setSelectedBackgroundMapLayerName(mapLayerName);
		});

		$("#muinaismuistot-visible-layer-selections input").change(function() {
			var selectedLayerIds = getSelectedMuinaismuistotLayerIds();
			settings.setSelectedMuinaismuistotLayerIds(selectedLayerIds);
		});
	};

	this.setEventListener = function(listener) {
	    eventListener = listener;
	};

	var setSelectedMuinaismuistotLayerIds = function(layerIds) {
		layerIds.forEach(function(layerId) {
			$('#settings-muinaismuistot-layer-' + layerId).prop('checked', true);
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