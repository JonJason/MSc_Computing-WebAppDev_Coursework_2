(function () {
	'use strict';

	var pages = {

		/**
		 * Home page app.
		 */
		Home: function () {
			this.view = new app.HomeView();
			this.controller = new app.HomeController(this.view);
		},

		/**
		 * Word page app.
		 */
		 Word: function () {
		 	this.view = new app.WordView();
			this.controller = new app.WordController(this.view);
		 },

		/**
		* About page app.
		*/
		About: function () {
			this.view = new app.AboutView();
			this.controller = new app.AboutController(this.view);
		},
	};

	var Layout = function() {
		this.view = new app.LayoutView();
		this.controller = new app.LayoutController(this.view);
	}

	function setupLayout (name) {
		app.layout = new Layout();
		app.layout.controller.setView(name);
	};

	function setupPage(name) {
		app.pages = app.pages || {};
		app.pages[name] = new pages[UTIL.capitalise(name)]();
	};

	function setupApp() {
		var pageName = document.body.dataset.page;
		setupLayout(pageName);
		setupPage(pageName);
	};

	UTIL.$on(window, 'load', setupApp);
	// UTIL.$on(window, 'hashchange', setView);
})();
