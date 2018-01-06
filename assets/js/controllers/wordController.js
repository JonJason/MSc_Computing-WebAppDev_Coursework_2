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

		API.wordnik.searchForWord(searchText, function(results) {
			self.addResults(results);
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
	};

	Controller.prototype.collapsePredictedWord = function() {
		this.view.render("collapsePredictedWord");
	}

	Controller.prototype.addResults = function(results) {
		this.view.render("showResultPanel");
		if (results.length > 0) {
			for (var result of results) {
				this.addResult(result.word);
			}
		}
	};

	Controller.prototype.addResult = function (word) {
		var model = new app.WordModel({ word: word });
		this.collections.word.add(model);
		this.view.render("addWord", {
			id: model.get("id"),
			word: model.get("word")
		});
		this._fetchWordData(model);
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
		API.wordnik.getWordDefinitions(word, function(definitions) { callback("definitions", definitions); });
		API.wordnik.getWordPhrases(word, function(phrases) { callback("phrases", phrases); });
		API.wordnik.getWordAudios(word, function(audios) { callback("audios", audios); });
		API.wordnik.getWordExamples(word, function(examples) { callback("examples", examples); });
	};

	// Export to window
	window.app = window.app || {};
	window.app.WordController = Controller;
})(window);
