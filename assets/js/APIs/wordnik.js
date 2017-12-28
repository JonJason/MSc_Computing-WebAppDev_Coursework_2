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
            "wordDef": "/word.json/{{word}}/definitions"
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
                callback && callback(JSON.parse(response).searchResults);
            }
        });
    };

    api.prototype.getWordDef = function(word, callback) {
        var params = {
            "limit": 10,
            "includeRelated": true,
            "sourceDictionaries": "all",
            "useCanonical": true,
            "includeTags": false,
            "api_key": "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
        };

        var suffix = this.getSuffix("wordDef", { word: word });

        UTIL.sendRequest(UTIL.buildRequestURI(this.baseURL, params, suffix), {
            onLoad: function(response) {
                callback && callback(JSON.parse(response));
            }
        });
    }


    parent.wordnik = new api()

	return parent;
})(API || {});
