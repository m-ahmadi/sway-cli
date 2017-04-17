require.config({
	baseUrl: "js/",
	paths: {
		lib: "../lib"
	}
});

require(["./mediator"], (page) => {
	
	page.beforeReady();
	
	$(function () {
		
		page.onReady();
		
	});
});