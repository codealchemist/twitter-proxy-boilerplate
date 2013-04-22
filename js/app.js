var TBP = TBP || {};

define([
   "jquery",
   "core/Ui",
   "tests/Tests",
   "core/Api",
   "service/Twitter",
   "core/String",
   "core/Log"
], function($, Ui, Tests, Api, Twitter, String, Log){
    Log.write('app loaded');

    //--------------------------------------------------------------------------
    //UI events
    $('.nav .menuItem').on('click', function(){
        var menuId = $(this).attr('id').match(/^menu-(.*)$/)[1];
        var testName = String.ucword(menuId);
        Log.write('activating MENU: ' + menuId + ", test name: " + testName);

        Ui.loadCss('css/default');
        Ui.Menu.activate(menuId);
        Tests[testName].load();
    });
    //--------------------------------------------------------------------------

    //export api into global namespace
    TBP.Api = Api;
    TBP.Twitter = Twitter;
    
    return {
        Tests: Tests
    };
});