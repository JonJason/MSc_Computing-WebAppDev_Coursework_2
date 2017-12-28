(function () {
	'use strict';

	var pages = {

		/**
		 * Sets up Home page.
		 */
		Home: function () {
			this.view = new app.HomeView();
			this.controller = new app.HomeController(this.view);
		},

		/**
		* Sets up About page.
		*/
		About: function () {
			this.view = new app.AboutView();
			this.controller = new app.AboutController(this.view);
		},
	}

	function setupPage() {
		var pageName = document.body.dataset.page;
		new pages[UTIL.capitalise(pageName)];
	}

	UTIL.$on(window, 'load', setupPage);
	// UTIL.$on(window, 'hashchange', setView);
})();
