/**
 * ticketmaster.com API
 */
var API = (function(parent){


    var apiKey = "724a33ab8bc36327b200b041efb08bfc4f33e79890573443a";

	var api = function(){

		/**
		 * api baseURI
		 */
	    this.baseURL = "http://api.wordnik.com:80/v4";
        this.suffixes = {
            "wordsSearch": "/words.json/search/{{word}}",
            "wordDef": "/word.json/{{word}}/definitions",
            "randomWord": "/words.json/randomWord"
        };
	};

    api.prototype.getSuffix = function (action, params) {
        var suffix = this.suffixes[action];

		for (var key in params) {
			if (params.hasOwnProperty(key)) {
				suffix = suffix.replace("{{" + key + "}}", params[key])
			}
		}
        return suffix;
    };

    api.prototype.searchForWord = function(word, callback) {
        var params = {
            "api_key": apiKey,
            "caseSensitive": true,
            "minCorpusCount": 5,
            "maxCorpusCount": -1,
            "minDictionaryCount": 1,
            "maxDictionaryCount": -1,
            "minLength": 1,
            "maxLength": -1,
            "skip": 0,
            "limit": 10
        };

        var suffix = this.getSuffix("wordsSearch", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                console.log(JSON.parse(response));
                return;
                callback && callback(JSON.parse(response).searchResults);
            }
        });
    };

    api.prototype.getWordDef = function (word, callback) {
        var params = {
            "api_key": apiKey,
            "limit": 10,
            "includeRelated": true,
            "sourceDictionaries": "all",
            "useCanonical": true,
            "includeTags": false
        };

        var suffix = this.getSuffix("wordDef", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                callback && callback(JSON.parse(response));
            }
        });
    };

    api.prototype.getRandomWord = function (callback) {
        var params = {
            "api_key": apiKey,
            "hasDictionaryDef": true,
            "minCorpusCount": 0,
            "maxCorpusCount": -1,
            "minDictionaryCount": 1,
            "maxDictionaryCount": -1,
            "minLength": 2,
            "maxLength": -1
        };

        var suffix = this.getSuffix("randomWord", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                callback && callback(JSON.parse(response));
            }
        });
    };


    parent.wordnik = new api()

	return parent;
})(API || {});
