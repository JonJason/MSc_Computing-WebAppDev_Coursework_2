(function (window) {
	"use strict";

	function View(template) {
		this.$body = document.body;
		this.$pageOverlay = UTIL.qs(".page-overlay", this.$body);
        this.$menuBtn = UTIL.qs(".menu-btn", this.$body);
		this.$pageWrapper = UTIL.qs(".page-wrapper", this.$body);
	}

	View.prototype.render = function (command, parameter) {
		var self = this;
		var viewCommands = {
            setOngoingPageLink: function () {
				self._setOngoingPage(parameter);
            },

            showNavigation: function() {
				self._showNavigationPopup();
            },

            scrollTo: function() {
                self._scrollTo(parameter);
            }
		};

		viewCommands[command]();
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

	View.prototype._setOngoingPage = function (name) {
		var $activeNavLink = UTIL.qs(".nav-link[data-link-page='"+ name +"']");
		UTIL.$addClass($activeNavLink, "ongoing-page");
	};

	View.prototype._showNavigationPopup = function () {
		UTIL.$toggleClass(this.$menuBtn, "active");
		var isActive = UTIL.$containsClass(this.$menuBtn, "active");
		UTIL.$toggleClass(this.$pageOverlay, "show", isActive);
	};

    /**
     * get scrolltop
     */
     View.prototype._getScrollTop = function () {
         return this.$pageWrapper.scrollTop;
     };

     /**
      * set scrolltop
      */
      View.prototype._setScrollTop = function (value) {
          this.$pageWrapper.scrollTop = value;
      };

      /**
       * set scrolltop
       */
       View.prototype._scrollTo = function (option) {
		   var self = this;
		   var start = self._getScrollTop();
		   var end = option.scrollTop + option.offset;
		   var total = end - start;
		   UTIL.animate(function(progress) {
			   self._setScrollTop(progress * total + start);
		   }, 1000);
       };

	// Export to window
	window.app = window.app || {};
	window.app.LayoutView = View;
}(window));
