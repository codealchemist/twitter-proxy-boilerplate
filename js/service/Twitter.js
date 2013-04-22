define([
    "core/Api",
    "core/Storage",
    "core/Log"
], function(Api, Storage, Log){
    Log.write('TWITTER SERVICE loaded');

    var Twitter = {
        /**
         * Returns result for passed URI.
         *
         * @author Alberto Miranda
         * @param {string} uri
         * @param {object} getParams Optional params
         * @param {function} callback
         */
        get: function(uri, getParams, callback) {
            var storageKey = JSON.stringify({
                uri: uri,
                getParams: getParams
            });
            if ( Storage.has(storageKey) ) {
                var cached = Storage.get(storageKey);
                Log.write('USING CACHED VALUE for key: ' + storageKey);
                return callback(cached);
            }

            getParams = getParams || null;
            var apiParams = {
                object: "TwitterController",
                method: "api",
                params: {
                    method: "get",
                    params: {
                        uri: uri,
                        params: getParams
                    }
                }
            };

            Api.request(apiParams, function(response) {
                Storage.set(storageKey, response);
                callback(response);
            });
        },

        /**
         * Returns requested User.
         *
         * @author Alberto Miranda
         * @param {string} screenName
         * @param {function} callback
         */
        getUser: function(screenName, callback) {
            if ( Storage.has(screenName) ) {
                var cached = Storage.get(screenName);
                Log.write('USING CACHED VALUE for key: ' + screenName);
                return callback(cached);
            }

            var apiParams = {
                object: "TwitterController",
                method: "api",
                params: {
                    method: "users/show",
                    params: {
                        "screen_name": "albertomiranda"
                    }
                }
            };

            Api.request(apiParams, function(response) {
                Storage.set(screenName, response);
                callback(response);
            });
        },

        /**
         * Returns results for passed query.
         *
         * @author Alberto Miranda
         * @param {string} criteria
         * @param {function} callback
         * @param {int} limit Default: 10
         */
        search: function(criteria, callback, limit) {
            if ( Storage.has(criteria) ) {
                var cached = Storage.get(criteria);
                Log.write('USING CACHED VALUE for key: ' + criteria);
                return callback(cached);
            }

            limit = limit || 10; //TODO: implement
            var apiParams = {
                object: "TwitterController",
                method: "api",
                params: {
                    method: "search/tweets",
                    params: {
                        "q": criteria
                    }
                }
            };

            Api.request(apiParams, function(response) {
                Storage.set(criteria, response);
                callback(response);
            });
        },

        /**
         * Returns results for passed geo query.
         *
         * @author Alberto Miranda
         * @param {object} criteria
         * @param {function} callback
         * @param {int} limit Default: 10
         */
        geoSearch: function(criteria, callback, limit) {
            //try cached results first
            var storageKey = JSON.stringify(criteria);
            if ( Storage.has(storageKey) ) {
                var cached = Storage.get(storageKey);
                Log.write('USING CACHED VALUE for key: ' + storageKey);
                return callback(cached);
            }

            //default params
            criteria.granularity = criteria.granularity || 'city';

            limit = limit || 10;
            var apiParams = {
                object: "TwitterController",
                method: "api",
                params: {
                    method: "geo/search",
                    params: criteria
                }
            };

            Api.request(apiParams, function(response) {
                Storage.set(storageKey, response);
                callback(response);
            });
        },

        /**
         * Returns requested geo place for passed id.
         *
         * @author Alberto Miranda
         * @param {string} placeId
         * @param {function} callback
         * @param {int} limit Default: 10
         */
        getPlaceById: function(placeId, callback, limit) {
            //try cached results first
            if ( Storage.has(placeId) ) {
                var cached = Storage.get(placeId);
                Log.write('USING CACHED VALUE for key: ' + placeId);
                return callback(cached);
            }

            limit = limit || 10; //TODO implement
            var apiParams = {
                object: "TwitterController",
                method: "api",
                params: {
                    method: "geo/id/" + placeId,
                    params: {

                    }
                }
            };

            Api.request(apiParams, function(response) {
                Storage.set(placeId, response);
                callback(response);
            });
        },

        /**
         * Returns requested Tweet for passed Tweet ID.
         *
         * @author Alberto Miranda
         * @param {string} tweetId
         * @param {function} callback
         * @param {int} limit Default: 10
         */
        getTweet: function(tweetId, callback, limit) {
            //try cached results first
            if ( Storage.has(tweetId) ) {
                var cached = Storage.get(tweetId);
                Log.write('USING CACHED VALUE for key: ' + tweetId);
                return callback(cached);
            }

            limit = limit || 10; //TODO implement
            var apiParams = {
                object: "TwitterController",
                method: "api",
                params: {
                    method: "statuses/show/" + tweetId,
                    params: {

                    }
                }
            };

            Api.request(apiParams, function(response) {
                Storage.set(tweetId, response);
                callback(response);
            });
        }
    };

    return Twitter;
});