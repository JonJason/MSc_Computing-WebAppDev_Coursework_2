(function (window) {
	'use strict';

	function Controller(view) {

		var self = this;
		self.view = view;

		self.view.bind("menuButtonClick", function () {
			self.showNavigation();
		});
	};

	/**
	 * initialises view
     * @param {string} pageName - page name
	 */
	Controller.prototype.setView = function (pageName) {
        this._setOngoingPage(pageName);
	};

	Controller.prototype._setOngoingPage = function (pageName) {
		this.view.render("setOngoingPageLink", pageName);
	};

    Controller.prototype.showNavigation = function () {
        this.view.render("showNavigation");
    };

    Controller.prototype.scrollTo = function (scrollTop, offset) {
        this.view.render("scrollTo", {scrollTop: scrollTop, offset: offset});
    };

	// Export to window
	window.app = window.app || {};
	window.app.LayoutController = Controller;
})(window);
