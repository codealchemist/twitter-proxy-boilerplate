/*global require*/
'use strict';

//namespace
var App = {};

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        jquery: {
            exports: 'jquery'
        },
        bootstrap: {
            exports: 'bootstrap',
            deps: ['jquery']
        },
        handlebars: {
            exports: 'handlebars'
        },
        colorbox: {
            deps: ['jquery'],
            exports: 'colorbox'
        }
    },
    paths: {
        jquery: 'lib/jquery-1.9.1.min',
        bootstrap: 'lib/bootstrap.min',
        handlebars: 'lib/handlebars',
        colorbox: 'lib/jquery.colorbox-min',
        settings: 'settings'
    }
});

require([
    'app',
    'core/Log',
    'bootstrap'
], function (App, Log) {
    Log.write('MAIN loaded');
    App.Tests.Search.load();
});
