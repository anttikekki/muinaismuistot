import $ from "jquery";

export default function MuinaismuistotInfoPage(eventListener) {
	$('#hide-infoPage-button').on('click', function() {
		eventListener.hidePage();
	});
};
