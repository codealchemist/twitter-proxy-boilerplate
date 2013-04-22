define([
    "core/Log"
], function(Log){
    /**
    * Set value for passed namespace string.
    * 
    * @author Alberto Miranda <alberto@glyder.co>
    * @param {string} namespace
    * @param {mixed} data
    */
    var set = function(namespace, data) {
        var object = window,
            tokens = namespace.split("."),
            token;

        var lastToken = tokens.pop();
        while (tokens.length > 0) {
            token = tokens.shift();

            if (typeof object[token] === "undefined") {
                object[token] = {};
            }

            object = object[token];
        }

        object[lastToken] = data;
        return object;
    };
   
   /**
    * Get value from passed namespace string.
    * 
    * @author Alberto Miranda <alberto@glyder.co>
    * @param {string} namespace
    * @return {mixed}
    */
    var get = function(namespace) {
       var object = window,
           tokens = namespace.split("."),
           token;

       while (tokens.length > 0) {
           token = tokens.shift();

           if (typeof object[token] === "undefined") {
               object[token] = {};
           }

           object = object[token];
       }

       return object;
    };
    Log.write('CORE/NAMESPACE loaded');

    //--------------------------------------------------------------------------
    
    //public interface
    return {
        get: get,
        set: set
    };
});
