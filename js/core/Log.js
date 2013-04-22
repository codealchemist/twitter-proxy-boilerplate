define([
], function(){
    var write = function(message, prefix) {
        prefix = prefix || "[ APP ] --> ";

        if (typeof message == 'object') {
            console.log(prefix + ' OBJECT: ');
            console.log(message);
        } else {
            console.log(prefix + message);
        }
    };
    
    write('LOG loaded');
    
    return {
        write: write
    };
});