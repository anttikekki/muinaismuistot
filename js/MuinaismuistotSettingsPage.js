var MuinaismuistotSettingsPage = function() {
	var self = this;
	this.eventListener;

	this.init = function() {
		$('#hide-settingsPage-button').on('click', function() {
			self.eventListener.hideSettingsPage();
		});

		$("input[name='selectedMapLayer']").change(function() {
			var mapLayerName = $(this).val();
			self.eventListener.selectedMapBackgroundLayerChanged(mapLayerName);
		});

		$("#muinaismuistot-visible-layer-selections input").change(function() {
			self.eventListener.visibleMuinaismuistotLayersChanged(self.getSelectedMuinaismuistotLayerIds());
		});
	};

	this.getSelectedMuinaismuistotLayerIds = function() {
		var layerIds = [];
	    $('#muinaismuistot-visible-layer-selections :checked').each(function() {
	       layerIds.push($(this).val());
	    });
	    return layerIds;
	};

	this.setEventListener = function(listener) {
	    this.eventListener = listener;
	};

	this.setSelectedMapBackgroundLayerName = function(mapName) {
		$('#map-selection-'+mapName).click();
	};

};