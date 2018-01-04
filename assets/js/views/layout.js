(function (window) {
	"use strict";

	function View(template) {
		this.$pageOverlay = UTIL.qs(".page-overlay");
        this.$menuBtn = UTIL.qs(".menu-btn");
        this.$body = document.body;
	}

	View.prototype.render = function (command, param) {
		var self = this;
		var viewCommands = {
            setOngoingPageLink: function (name) {
                var $activeNavLink = UTIL.qs(".nav-link[data-link-page='"+ name +"']");
                UTIL.$addClass($activeNavLink, "ongoing-page");
            },

            showNavigationDropdown: function() {
                self._setScrollTop(0);
    			UTIL.$toggleClass(self.$menuBtn, "active");
                var isActive = UTIL.$containsClass(self.$menuBtn, "active");
                UTIL.$toggleClass(self.$body, "no-scroll-y", isActive);
    			UTIL.$toggleClass(self.$pageOverlay, "show", isActive);
            }
		};

		viewCommands[command](param);
	};

    /**
     * to bind event happens on the interface (such as search on searchbar)
     * @param {String} event        - view event name
     * @param {Function} handler    - event handler
     */
	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === "menuButtonClick") {
			UTIL.$on(self.$menuBtn, "click", function(event) {
				handler();
			});
		};
	};

    /**
     * get scrolltop
     */
     View.prototype._getScrollTop = function () {
         return document.documentElement.scrollTop;
     }

     /**
      * get scrolltop
      */
      View.prototype._setScrollTop = function (value) {
          document.documentElement.scrollTop = value;
      }

	// Export to window
	window.app = window.app || {};
	window.app.LayoutView = View;
}(window));
