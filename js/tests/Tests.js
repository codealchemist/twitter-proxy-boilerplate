//tests container
define([
   "tests/Search.test"
], function(Search){
    console.log('[ APP ] --> tests loaded');
    
    return {
        Search: Search
    };
});