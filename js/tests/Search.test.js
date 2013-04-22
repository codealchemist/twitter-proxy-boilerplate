define([
    "core/Ui",
    "service/twitter",
    "core/Log",
    "core/Template",
    "settings"
], function(Ui, Twitter, Log, Template, Settings){
    var testName = 'SEARCH TEST',
        cssFile = Settings.testsCssPath + 'search.test',
        container = '#result',
        description = 'Querying Twitter with API v1.1.<br />Searching for <em>"getGlyder"</em> and showing first results.',
        detailedTweets = []; //will contain detailed Tweets objects

    /**
     * Load and render current test.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var load = function() {
        Log.write('Loading test: ' + testName);
        
        Ui.loadCss(cssFile);
        $(container).html('');
        Ui.removeScroll();
        Ui.Loading.show();
        
        //show description
        $('#description').html(description);
        
        //render it
        render();
    };

    /**
     * Receives Twitter search response and gets detailed data for each available Tweet.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {object} searchResponse
     */
    var getDetailedTweets = function(searchResponse) {
        Log.write('get detailed tweets...');

        detailedTweets = []; //reset
        var data = searchResponse.statuses;
        var totalFound = data.length;
        if (!totalFound) {
            Log.write('No Tweets found.');
            Ui.showMessage('Sorry, no Tweets found', 'Empty', false);
            return false;
        }

        //get detailed Tweet data for each found Tweet
        var currentItem;
        for (var i=totalFound; i--;) { //iterate Tweets
            currentItem = data[i];
            Log.write('current TWEET: ');
            Log.write(currentItem);

            //get details
            Twitter.getTweet(currentItem.id_str, function(Tweet) {
                detailedTweets.push(Tweet);
                renderTweet(Tweet);

                //check for last Tweet
                var renderedTweets = detailedTweets.length;
                if (renderedTweets == totalFound) {
                    Log.write('ALL TWEETS RENDERED');
                    Ui.closeMessage();
                }
            });
        }
    };

    /**
     * Renders passed detailed Tweet.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {object} Tweet result of calling statuses/show/[tweet_id]
     */
    var renderTweet = function(Tweet) {
        Log.write('render detailed Tweet: ');
        Log.write(Tweet);

        if (!Tweet.user) {
            Log.write('OOPS! Invalid Tweet data! Unable to render it.');
            Log.write(Tweet);
            return false;
        }

        //render tweet
        Template.render({
            templateName: 'tweet.template.html',
            targetId: 'result',
            data: Tweet,
            callback: function() {
                console.log('TWEET RENDERED SUCCESSFULLY! :)');
            }
        });
    };

    /**
     * Enter keypress handler for query input element.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param e
     * @returns {boolean}
     */
    var onQueryEnter = function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) { //Enter keycode
            //remove previous markers
            $('.leaflet-marker-shadow, .leaflet-marker-icon').remove();

            //search
            var currentSearch = $('#query').val();
            if (!currentSearch) {
                Ui.showMessage('No search criteria!', 'Oops!', 'Try again');
                return false;
            }

            Ui.showMessage('Searching Twitter for ' + currentSearch, 'Searching...');
            searchTwitter(currentSearch);
        }
    };
    
    /**
     * Runs Twitter search with passed query.
     * 
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {string} query
     */
    var searchTwitter = function(query) {
        //reset previous content
        $(container).html('');
        
        Twitter.search(query, function(response){
            getDetailedTweets(response);
        }, 10);
    };

    /**
     * Renders current test.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var render = function() {
        //----------------------------------------------------------------------
        //add search
        $('#description').prepend('<div id="searchContainer"></div>');
        Template.render({
            templateName: 'searchForm.template.html',
            targetId: 'searchContainer',
            data: {defaultCriteria: "getGlyder"},
            callback: function() {
                console.log('SEARCH FORM RENDERED!');
                $('#query').on('keydown', onQueryEnter);
                $('#queryButton').on('click', searchTwitter);
                $('#query').on('focus', function(){
                    $('#query').select();
                });
            }
        });
        //----------------------------------------------------------------------

        //---------------------------------------------------------------
        //load tweets and render them
        Ui.showMessage('Loading Tweets...', 'Loading', false);
        var defaultSearch = "getGlyder";
        searchTwitter(defaultSearch);
        //---------------------------------------------------------------

        Ui.Loading.hide();
    };

    return {
        load: load
    };
});