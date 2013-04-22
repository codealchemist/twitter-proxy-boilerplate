define([
    "core/Log"
], function(Log){
    /**
     * LocalStorage interface.
     *
     * @author Alberto Miranda <alberto@glyder.co>
     */
    var Storage = (function(){
        /**
         * Returns value for passed key.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {string} key
         * @return {mixed}
         */
        var get = function(key){
            var itemString = localStorage.getItem(key);
            var itemObj = JSON.parse(itemString);
            return itemObj;
        };

        /**
         * Sets passed value for passed key.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {string} key
         * @param {mixed} value
         */
        var set = function(key, value){
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        };

        /**
         * Returns true if passed key exists in Storage.
         * False if not.
         *
         * @author Alberto Miranda <alberto.php@gmail.com>
         * @param {string} key
         * @returns {boolean}
         */
        var has = function(key) {
            if (localStorage[key] !== undefined) return true;
            return false;
        };

        /**
         * Unsets passed key.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {string} key
         */
        var remove = function(key){
            localStorage.removeItem(key);
        };

        /**
         * Unsets all keys.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         */
        var removeAll = function(){
            localStorage.clear();
        };

        return {
            has: has,
            get: get,
            set: set,
            remove: remove,
            removeAll: removeAll
        };
    })();

    Log.write('CORE/STORAGE loaded');
    return Storage;
});