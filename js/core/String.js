define([
    'core/Log'
], function(Log){
    var container = '#visualization';

    var ucword = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    Log.write('CORE/STRING loaded');
    return {
        ucword: ucword
    };
});