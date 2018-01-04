(function (window) {
	"use strict";

	function View(template) {
		this.ENTER_KEY = 13;

		/* search-panel */
		this.$searchPanel = UTIL.qs(".search-panel");
		// search
		this.$searchbarWrapper = UTIL.qs(".searchbar-wrapper", this.$searchPanel);
		this.$searchbar = UTIL.qs(".searchbar", this.$searchbarWrapper);
		this.$searchButton = UTIL.qs(".search-btn", this.$searchbarWrapper);

		// image uploader
		this.$imageUploader = UTIL.qs(".img-uploader", this.$searchPanel);

		/* result-panel */
		this.$resultPanel = UTIL.qs(".result-panel");
		this.$predictionPanel = UTIL.qs(".prediction-panel", this.$resultPanel);
		this.$thumb = UTIL.qs(".thumbnail", this.$predictionPanel);
		this.$preloader = UTIL.qs(".preloader-overlay", this.$predictionPanel);
		this.$predictedWordList = UTIL.qs(".predicted-word-list", this.$predictionPanel)
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
		} else if (event === "fileChosen") {
			UTIL.$on(self.$imageUploader, "change", function(event) {
				handler(self.$imageUploader.files[0]);
			});
		};
	};

	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		var viewCommands = {
			lightenSearchbar: function () {
				self._ligtenSearchbar();
			},

			darkenSearchbar: function () {
				self._darkenSearchbar();
			},

			showPredictionPanel: function () {
				self._hideSearchPanel();
				self._showResultPanel();
				self._showThumbPreloader("Loading");
			},

			showThumb: function () {
				self._setThumb(parameter.thumb);
				self._showThumbPreloader("Predicting");
			},

			showPredictionResult: function () {
				self._hideThumbPreloader();
				self._showPredictedWords(parameter.words);
			}
		};

		viewCommands[viewCmd]();
	};

	View.prototype._ligtenSearchbar = function() {
		UTIL.$addClass(this.$searchbarWrapper, "active");
	};

	View.prototype._darkerSearchbar = function() {
		UTIL.$removeClass(this.$searchbarWrapper, "active");
	};

	View.prototype._showSearchPanel = function() {
		UTIL.$removeClass(this.$searchPanel, "hidden");
	};

	View.prototype._hideSearchPanel = function() {
		UTIL.$addClass(this.$searchPanel, "hidden");
	};

	View.prototype._showResultPanel = function() {
		UTIL.$addClass(this.$resultPanel, "show");
	};

	View.prototype._hideResultPanel = function() {
		UTIL.$removeClass(this.$resultPanel, "show");
	};

	View.prototype._showThumbPreloader = function(text) {
		if (!!text) {
			this.$preloader.dataset.text = text;
		}
		UTIL.$addClass(this.$preloader, "show");
	};

	View.prototype._hideThumbPreloader = function() {
		UTIL.$removeClass(this.$preloader, "show");
	};

	View.prototype._setThumb = function(thumb) {
		var self = this;

		var onload = function () {
			var aspectRatio = UTIL.getAspectRatio({ width: self.$thumb.width, height: self.$thumb.height })
			UTIL.$removeClass(self.$thumb, "fit-height");
			UTIL.$removeClass(self.$thumb, "fit-width");
			if (aspectRatio >= 1) { // landscape
				UTIL.$addClass(self.$thumb, "fit-width");
			} else { // portrait
				UTIL.$addClass(self.$thumb, "fit-height");
			}
			UTIL.$off(self.$thumb, "load", onload);
		};

		UTIL.$on(this.$thumb, "load", onload);

		this.$thumb.src = thumb;
	};

	View.prototype._showPredictedWords = function(words) {
		var list = "";

		for (var word of words) {
			list += UTIL.parseTemplate("predicted_word_item", { word: word });
		}

		this.$predictedWordList.innerHTML = list;
	};

	// Export to window
	window.app = window.app || {};
	window.app.WordView = View;
}(window));
