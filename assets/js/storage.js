/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	function DBStorage(name) {
		this._name = name;
        var DB = this._getDB();
		if (!DB) { // if database is not found, initialise database
			var data = {
				WOTDs: []
			};

            this._saveDB(data)
		}
	}

	// get database
    DBStorage.prototype._getDB = function () {
        return JSON.parse(localStorage.getItem(this._name));
    };

	// save database
    DBStorage.prototype._saveDB = function (data) {
        localStorage.setItem(this._name, JSON.stringify(data));
    };

	// get All stored WOTD
    DBStorage.prototype.getAllWOTD = function (WOTD) {
        return this._getDB().WOTDs;
    };

	// get Word of The Day by its date
    DBStorage.prototype.getWOTDByDate = function (date) {
        return this.getAllWOTD().find(function(WOTD) {
            return UTIL.compareDate(new Date(WOTD.date), date);
        });
    };

	// save WOTD
    DBStorage.prototype.saveWOTD = function (data) {
        delete data.id;
        var DB = this._getDB();
        var date = new Date(data.date); // get the date of the WOTD
        if (this.getWOTDByDate(date)) { // check if the WOTD is already there
            var WOTDs = DB.WOTDs;
			// update the existing WOTD
            var index = DB.WOTDs.findIndex(function (WOTD) {
                return UTIL.compareDate(new Date(WOTD.date), date);
            });
            DB.WOTDs[index] = data;
        } else {
            DB.WOTDs.push(data);
        }

        this._saveDB(DB);
    };

	// get the Word of The Day
    DBStorage.prototype.getTodayWOTD = function () {
        return this.getWOTDByDate(new Date());
    };

	// clear expired Word of The Day
	DBStorage.prototype.clearExpiredWOTD = function () {
		var WOTDs = this.getAllWOTD();
		var date = new Date();
		var newWOTDs = []
		for (var WOTD of WOTDs) {
			// since it's impossible to have tomorrow's word of the day, this method should work
			if (UTIL.compareDate(new Date(WOTD.date), date)) {
				newWOTDs.push();
			}
		}
		var DB = this._getDB();
		DB.WOTDs = newWOTDs;
		this._setDB(DB);
	};

	// Export to window
	window.app = window.app || {};
	window.app.DB = new DBStorage("event-crawler.com");
})(window);
