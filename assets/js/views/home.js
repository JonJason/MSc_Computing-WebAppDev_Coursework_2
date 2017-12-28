(function (window) {
	"use strict";

	function View(template) {
		this.ENTER_KEY = 13;

		this.$searchbarWrapper = UTIL.qs(".searchbar-wrapper");
		this.$searchbar = UTIL.qs(".searchbar");
		this.$searchButton = UTIL.qs(".search-btn");
	}

	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			lightenSearchbar: function () {
				UTIL.$addClass(self.$searchbarWrapper, "active");
			},

			darkenSearchbar: function () {
				UTIL.$removeClass(self.$searchbarWrapper, "active");
			}
		};

		viewCommands[viewCmd]();
	};

    /**
     * to bind event happens on the interface (such as search on searchbar)
     * @param {String} event        - view event name
     * @param {Function} handler    - event handler
     */
	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === "triggerSearch") {
            UTIL.$on(self.$searchbar, "keypress", function (event) {
                if (event.keyCode == self.ENTER_KEY) {
                    // prevent submitting the form
                    event.preventDefault();

    				handler(self.$searchbar.value);
                }
            });

			UTIL.$on(self.$searchButton, "click", function (event) {
				event.preventDefault();

				handler(self.$searchbar.value);
			});
		} else if (event === "searchbarFocused") {
			UTIL.$on(self.$searchbar, "focus", function(event) {
				handler();
			});
		} else if (event === "searchbarBlurred") {
			UTIL.$on(self.$searchbar, "blur", function(event) {
				handler();
			});
		} else if (event === "goToPage") {
			UTIL.$delegate(document.body, ".link-btn", "click", function(event, targetElement) {
				var page = targetElement.dataset.page;
				handler(page);
			});
		}
	};

	// Export to window
	window.app = window.app || {};
	window.app.HomeView = View;
}(window));
