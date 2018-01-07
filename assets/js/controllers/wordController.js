(function (window) {
	'use strict';

	function Controller(view) {
		var self = this;
		self.view = view;

		self.collections = {
			word: new app.WordCollection()
		};

		self.view.bind("searchbarFocused", function () {
			self.lightenSearchbar();
		});

		self.view.bind("searchbarBlurred", function () {
			self.darkenSearchbar();
		});

		self.view.bind("triggerSearch", function (searchText) {
			self.searchForWord(searchText);
		});

		self.view.bind("fileChosen", function (filepath) {
			self.showPredictedWords(filepath);
		});

		self.view.bind("predictionWordPicked", function (word, isCollapsible) {
			if (!isCollapsible) {
				self.makePredictedWordCollapsible();
			}
			self.collapsePredictedWord();
			self.searchForWord(word);
		});

		self.view.bind("wordPhraseClick", function (phrase) {
			self.searchForWord(phrase);
		});

		var handleHash = function () {
			var hash = document.location.hash.slice(1);
			if (hash == "OTD") {
				self.fetchWordOfTheDay();
			} else if (hash == "random") {
				self.searchRandomWord();
			}
		};

		UTIL.$on(window, 'hashchange', handleHash);

		handleHash();
	}

	Controller.prototype.lightenSearchbar = function () {
		this.view.render("lightenSearchbar");
	};

	Controller.prototype.darkenSearchbar = function () {
		this.view.render("darkenSearchbar");
	};

    Controller.prototype.searchForWord = function (searchText) {
		var self = this;
        searchText = searchText.trim();

		if (searchText === '') { // cancel search if only whitespaces typed in the searchbar
			return;
		}

		API.wordnik.searchForWord(searchText, function(result) {
			if (!!result) {
				self.view.render("showResultPanel");
				self.addResult({ word: result.word });
			} else {
				// HANDLE
				window.alert('word "' + searchText + '" is not found or the detail for word "' + searchText + '" is not available at the moment yet')
			}
		});
    };

	Controller.prototype.searchRandomWord = function () {
		var self = this;
		API.wordnik.getRandomWord(function (result) {
			if (!!result) {
				self.view.render("showResultPanel");
				self.addResult({ word: result.word });
			}
		});
	};

	Controller.prototype.fetchWordOfTheDay = function () {
		var self = this;
		API.wordnik.getWOTD(function (data) {
			if (!!data) {
				data.isWOTD = true;
				self.view.render("showResultPanel");
				self.addResult(data);
			}
		});
	};

	Controller.prototype.showPredictedWords = function (filepath) {
		var self = this;
		self.view.render("showPredictionPanel");
		UTIL.getDataUri(filepath, function (data, fileUrl) {
			self.view.render("showThumb", {
				thumb: fileUrl
			});

			API.clarifai.getPrediction(data, function (predictions) {
				self.view.render("showResultPanel");
				self.view.render("showPredictionResult", {
					words: predictions.map(x => x.name)
				});
			});
		});
	};

	Controller.prototype.makePredictedWordCollapsible = function() {
		this.view.render("hideThumbWrapper");
		this.view.render("makePredictedWordCollapsible");
		app.layout.controller.shiftPageWrapper();
	};

	Controller.prototype.collapsePredictedWord = function() {
		this.view.render("collapsePredictedWord");
	}

	Controller.prototype.addResult = function (data) {
		var model = this.collections.word.findByWord(data.word);
		if (model === undefined) {
			model = new app.WordModel(data);
			this.collections.word.add(model);
			this.view.render("addWord", {
				id: model.get("id"),
				word: model.get("word")
			});
			this._fetchWordData(model);
		}

		var wordItem = this.view.getWordItem(model.get("id"));
		var predictedWordListHeader = this.view.getPredictedWordListHeader();
		var scrollTop = wordItem.offsetTop - predictedWordListHeader.offsetHeight;
		app.layout.controller.scrollTo(scrollTop);
	};

	Controller.prototype._fetchWordData = function(model) {
		var self = this;
		var word = model.get("word");

		// callback function for each property fetching
		var callback = function(name, value) {
			var data = {};
			data[name] = value;
			model.set(data);
			self.view.render("updateWord", { id: model.get("id"), key: name, value: model.get(name) });
		};

		// fetching definitions, phrases, audios, and examples
		if (model.get("definitions").length >= 1) {
			callback("definitions", model.get("definitions"));
		} else {
			API.wordnik.getWordDefinitions(word, function(definitions) { callback("definitions", definitions); });
		}

		if (model.get("phrases").length >= 1) {
			callback("phrases", model.get("phrases"));
		} else {
			API.wordnik.getWordPhrases(word, function(phrases) { callback("phrases", phrases); });
		}

		if (model.get("audios").length >= 1) {
			callback("audios", model.get("audios"));
		} else {
			API.wordnik.getWordAudios(word, function(audios) { callback("audios", audios); });
		}

		if (model.get("examples").length >= 1) {
			callback("examples", model.get("examples"));
		} else {
			API.wordnik.getWordExamples(word, function(examples) { callback("examples", examples); });
		}

	};

	// Export to window
	window.app = window.app || {};
	window.app.WordController = Controller;
})(window);
