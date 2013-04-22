define([
    "settings",
    "core/Log",
    "jquery"
], function(Settings, Log){
    Log.write('CORE/API loaded');

    var Api = {
        /**
         * Makes an API request.
         *
         * @author Alberto Miranda <alberto.php@gmail.com>
         * @param {object} params
         * @param {function} callback
         */
        request: function(params, callback) {
            $.ajax({
                url: Settings.apiUrl,
                contentType: 'application/json; charset=utf-8',
                type: 'post',
                timeout: 120 * 1000,
                data: JSON.stringify(params),
                success: function(response) {
                    if (!response || response.error) return false;

                    console.log('+ API RESPONSE: ');
                    console.log(response);

                    //callback
                    if (typeof callback == 'function') {
                        callback(response);
                    }
                },
                error: function(response){
                    Log.write('API ERROR: ');
                    console.log(response);
                    return false;
                }
            });
        }
    };

    return Api;
});