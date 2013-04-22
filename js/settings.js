define([
    "core/Log"
], function(Log){
    Log.write('SETTINGS loaded');

    return {
        apiUrl: "api/api.php",
        templatesFolder: "js/templates/",
        testsCssPath: "js/tests/css/"
    };
});