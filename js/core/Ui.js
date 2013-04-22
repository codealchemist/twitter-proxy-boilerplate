define([
    'core/Log',
    'settings',
    'colorbox'
], function(Log, Settings){
    var container = '#result';
    
    /**
     * Shows / hides loading animation.
     * 
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var Loading = {
        show: function() {
            $(container).append('<div class="loading"></div>');
        },
        hide: function() {
            $(container + ' .loading').remove();
        }
    };
    
    /**
     * Scroll timed listener.
     * Avoids calling the callback each time scroll is fired, which happens
     * A LOT! Instead, detects if scroll ocurred and after a given interval, if
     * it did so, calls the callback function.
     * 
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var scrollInterval;
    var onScroll = function(callback) {
        $(container).on('wheel', function(event){
            //gecko compatible
            App.Ui.scroll.didScroll = true;

            if (event.originalEvent.deltaY >= 0) {
                App.Ui.scroll.scrolledUp = true;
            } else {
                App.Ui.scroll.scrolledUp = false;
            }

            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        });
        $(container).on('mousewheel', function(event){
            //webkit compatible
            App.Ui.scroll.didScroll = true;
            
            if (event.originalEvent.wheelDelta >= 0) {
                App.Ui.scroll.scrolledUp = true;
            } else {
                App.Ui.scroll.scrolledUp = false;
            }

            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        });

        scrollInterval = setInterval(function() {
            if ( App.Ui.scroll.didScroll ) {
                App.Ui.scroll.didScroll = false;
                if (App.Ui.scroll.scrolledUp) {
                    ++App.Ui.scroll.value;
                } else {
                    --App.Ui.scroll.value;
                }
                
                if (typeof callback == 'function') {
                    callback(App.Ui.scroll);
                }
            }
        }, 50);
    };

    /**
     * Removes scroll interval function.
     */
    var removeScroll = function() {
        clearInterval(scrollInterval);

        $(container).unbind('wheel');
        $(container).unbind('mousewheel');
    };

    /**
     * Handles Menu actions.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {string} id
     */
    var Menu = {
        /**
         * Activates passed menu item id.
         *
         * @author Alberto Miranda <alberto.php@gmail.com>
         * @param {string} id
         */
        activate: function(id) {
            this.deactivateAll();
            $('#menu-' + id).addClass('active');
        },

        /**
         * Deactivates all menu items.
         *
         * @author Alberto Miranda <alberto.php@gmail.com>
         */
        deactivateAll: function() {
            $('.nav li').removeClass('active');
        }
    };

    /**
     * Loads requested CSS file.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {string} filename Without .css
     */
    var loadCss = function(filename){
        var cssFile = filename + '.css';
        Log.write('loading css: ' + cssFile);
        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', cssFile) );
    };

    /**
     * Displays passed message with whole app look and feel.
     *
     * @author Alberto Miranda <alberto@getpocketoffice.com>
     * @param {string} message
     * @param {string} title
     * @param {string} buttonTitle
     */
    var showMessage = function(message, title, buttonTitle) {
        //set defaults
        if (buttonTitle === undefined) buttonTitle = 'OK';

        var button = '<p><a class="btn btn-large" onclick="$.colorbox.close()" style="float:right">' + buttonTitle + '</a></p>';
        if (!buttonTitle) button = '';
        //var titleHtml = '';
        //if (title) titleHtml = '<h3 style="padding:5px; display:block; border-bottom:1px solid black; font-weight:bold; margin-bottom: 20px">' + title + '</h3>';
        $.colorbox({
            "html": '<div class="messageboxContent"><h4>' + message + '</div><div>' + button + '</h4></div>',
            "opacity": 0.7,
            "className": "messagebox",
            "close": false,
            "width": "300px",
            "transition": "fade",
            "title": title
        });
    };

    /**
     * Closes currently visible message.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var closeMessage = function() {
        $.colorbox.close();
    };
    
    Log.write('CORE/UI loaded');
    return {
        onScroll: onScroll,
        removeScroll: removeScroll,
        Loading: Loading,
        Menu: Menu,
        loadCss: loadCss,
        showMessage: showMessage,
        closeMessage: closeMessage
    };
});