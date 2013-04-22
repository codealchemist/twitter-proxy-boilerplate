define([
    'core/Storage',
    'settings',
    'core/Log',
    'handlebars'
], function(Storage, Settings, Log){
    /**
     * Template parser.
     *
     * @author Alberto Miranda <alberto@glyder.co>
     */
    var Template = function() {
        Handlebars.registerHelper('json', function(context) {
            return JSON.stringify(context);
        });

        Handlebars.registerHelper('eachProperty', function(context, options) {
            var ret = "";
            for(var prop in context) {
                ret = ret + options.fn({name:prop,value:context[prop]});
            }
            return ret;
        });

        var templatesPath = Settings.templatesFolder;
        var useCache = false;
        //var sufix = '.template.html';

        /**
         * Templates cache object.
         * Allows easy template caching.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         */
        var Cache = function() {
            var ttl = null; //TODO

            /**
             * Saves passed template in cache.
             *
             * @author Alberto Miranda <alberto@glyder.co>
             */
            var save = function(templateName, value) {
                Log.write('Template.Cache.save: ' + templateName);
                Storage.set(templateName, value);
            };

            /**
             * Returns true if passed template cache is still valid and therefore
             * can be used.
             *
             * @author Alberto Miranda <alberto@glyder.co>
             * @param {string} templateName
             * @return {boolean}
             */
            var isValid = function(templateName) {
                Log.write('Template.Cache.isValid: ' + templateName);
                //TODO
            };

            /**
             * Returs cached copy of requested template.
             *
             * @author Alberto Miranda <alberto@glyder.co>
             * @param {string} templateName
             * @return {string}
             */
            var get = function(templateName) {
                Log.write('Template.Cache.get: ' + templateName);
                return Storage.get(templateName);
            };

            /**
             * Returns true if passed template is cached.
             * False if not.
             *
             * @author Alberto Miranda <alberto@glyder.co>
             * @param {string} templateName
             * @return {boolean}
             */
            var has = function(templateName) {
                Log.write('Template.Cache.has: ' + templateName);
                return Storage.has(templateName);
            };

            /**
             * Clears cache.
             *
             * @author Alberto Miranda <alberto@glyder.co>
             */
            var clear = function() {
                Storage.clear('.template.');
            };

            //public interface
            return {
                save: save,
                get: get,
                has: has,
                clear: clear
            };
        }();

        /**
         * Renders passed data into passed targetId using passed template.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {object} params {templateName: string, targetId: string, data: mixed, callback: function}
         */
        var render = function(params) {
            var templateName = params.templateName || null,
                targetId = params.targetId || null,
                append = params.append || true,
                data = params.data || null,
                callback = params.callback || null;

            console.group('--> Template.render');
            Log.write('+ TEMPLATE: ' + templateName);
            Log.write('+ TARGET: ' + targetId);
            Log.write('+ TEMPLATE DATA: ');
            Log.write(data);

            if (App.isLoading) {
                Log.write('LOADING in progress, render cancelled');
                //return false;
            }
            App.isLoading = true;
            data = data || {}; //default value
            var templateFile = templatesPath + '/' + templateName;

            //CACHED
            //if template is cached used cached copy
            if (useCache) {
                Log.write('+ CACHE IS ENABLED');
                if (Cache.has(templateFile)) {
                    Log.write('+ USING CACHED TEMPLATE: ' + templateFile);
                    var html = Cache.get(templateFile);

                    //parse
                    var view = Handlebars.compile(html);
                    var parsed = view(data);
                    console.groupCollapsed('+ PARSED TEMPLATE: ' + parsed);
                    console.groupEnd();

                    //render parsed template
                    if (targetId != undefined){
                        if (append) {
                            $('#' + targetId).append(parsed);
                        } else {
                            $('#' + targetId).html(parsed);
                        }
                    }

                    //callback
                    if (callback) callback(data, parsed);

                    App.isLoading = false;
                    console.groupEnd();
                    return true;
                }
                Log.write('TEMPLATE NOT CACHED: ' + templateFile);
            }

            //NON CACHED
            //load template file and parse it
            $.get(templateFile, function(html){
                console.groupCollapsed('+ GOT TEMPLATE: ' + templateFile);
                Log.write(html);
                console.groupEnd();
                if (useCache) Cache.save(templateFile, html);

                //parse
                var view = Handlebars.compile(html);
                var parsed = view(data);
                console.groupCollapsed('+ PARSED TEMPLATE: ');
                Log.write(parsed);
                console.groupEnd();

                //render parsed template
                if (targetId != undefined){ 
                    if (append) {
                        $('#' + targetId).append(parsed);
                    } else {
                        $('#' + targetId).html(parsed);
                    }
                }

                //callback
                if (callback) callback(data, parsed);
                App.isLoading = false;
                console.groupEnd();
            });
        };

        //public interface
        return {
            render: render
        };
    }();

    Log.write('CORE/TEMPLATE PARSER loaded');
    return Template;
});