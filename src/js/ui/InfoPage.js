import $ from "jquery";

export default function InfoPage(eventListener) {
	$('#hide-infoPage-button').on('click', function() {
		eventListener.hidePage();
	});
};
