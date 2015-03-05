/*global log:true, kind:true, define:true */

// Tell IE9 to use its built-in console
if (Function.prototype.bind && /^object$|^function$/.test(typeof console) && typeof console.log === 'object' && typeof window.addEventListener === 'function') {
    // Supported console methods
    ['assert', 'clear', 'dir', 'error', 'info', 'log', 'profile', 'profileEnd', 'warn']
        .forEach(function(method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);

    // Unsupported console methods, fallback to `log`
    ['_exception', 'count', 'debug', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace']
        .forEach(function(method) {
            console[method] = console.log;
        });
}

// AMD support
(function (name, definition) {
    if (typeof module !== 'undefined') {
        module.exports = definition();
    }
    else if (typeof define === "function" && define.amd) {
        define(definition);
    }
    // Fall back to a global variable
    else {
        window[name] = definition();
    }
}('log',

    /**
     * Complete cross-browser console.log wrapper
     *
     * @return  {Function}  `log` method
     */
    function _log() {
        var log,
            ua = navigator.userAgent,
            isIECompatibilityView = (function() {
                // If the detailPrint plugin is loaded, check for IE11- pretending to be an older version,
                //   otherwise it won't pass the "Browser with a console" condition below. IE8-10 can use
                //   console.log normally, even though in IE7/8 modes it will claim the console is not defined.
                // TODO: Can someone please test this on Windows Vista and Windows 8?
                var winRegexp = /Windows\sNT\s(\d+\.\d+)/;

                // Check for certain combinations of Windows and IE versions to test for IE running in an older mode
                if (typeof console !== 'undefined' && console.log && /MSIE\s(\d+)/.test(ua) && winRegexp.test(ua)) {
                    // Windows 7 or higher cannot possibly run IE7 or older
                    if (parseFloat(winRegexp.exec(ua)[1]) >= 6.1) {
                        return true;
                    }
                    // Cannot reliably test for IE8+ running in IE7 mode on XP (Win 5.1) or Vista (Win 6.0)...
                }

                return false;
            }()),
            // Test if the browser is IE8
            isIE8 = (function _isIE8() {
                var fpb = Function.prototype.bind;

                // Modernizr, es5-shim, and other scripts may polyfill `Function.prototype.bind` so we can't rely solely on whether that is defined
                return (!fpb || (fpb && typeof window.addEventListener === 'undefined')) &&
                    typeof console === 'object' &&
                    typeof console.log === 'object';
            }()),
            // Check for IE 10/11 now that we've had a chance to properly define `isIECompatibilityView` above
            isIEModern = (!isIECompatibilityView && !isIE8 && /Trident\//.test(ua)),
            // Whether this browser has a console we can call directly
            // Must evaluate this on each run in case Firebug was loaded since it will define the console
            hasConsole = (isIECompatibilityView || (window.console && typeof console.log === 'function')),
            firebugAttempts = 0,
            defaultGroupOptions = {
                label: 'Log:',
                collapsed: true
            },

            /**
             * Add Firebug Lite to the page
             */
            includeFirebug = function _includeFirebug() {
                (function(F,i,r,e,b,u,g,L,I,T,E){if(F.getElementById(b)){return;}E=F[i+'NS']&&F.documentElement.namespaceURI;E=E?F[i+'NS'](E,'script'):F[i]('script');E[r]('id',b);E[r]('src',I+g+T);E[r](b,u);(F[e]('head')[0]||F[e]('body')[0]).appendChild(E);E=new Image();E[r]('src',I+L);})(document,'createElement','setAttribute','getElementsByTagName','FirebugLite','4','firebug-lite.js','releases/lite/latest/skin/xp/sprite.png','https://getfirebug.com/','#startOpened');
            },

            /**
             * Extract line number from the error stack
             * Thanks to drzaus http://stackoverflow.com/a/14841411/348995
             */
            getLineFromStack = function _getLineFromStack(stack) {
                var suffix = stack.split('\n').pop(),
                    path = document.location.pathname.substr(0, document.location.pathname.lastIndexOf('/') + 1);

                // Remove the current document path to get a relative path, if applicable
                // We do this check (instead of calling `.replace()` directly) so we only remove the protocol if the path was also removed
                if (suffix.indexOf(path) > -1) {
                    suffix = suffix
                                .replace(path, '')
                                .replace(document.location.protocol + '//', '');
                }

                // Format: `/path/to/file.js:12:34`
                // Chrome and Safari
                if (/[^\(\@]+\:\d+\:\d+\)?$/.test(suffix)) {
                    suffix = '@' + /([^\(\@]+\:\d+\:\d+)\)?$/.exec(suffix)[1];
                }
                else {
                    // Format similar to `(at /path/to/file.js:12:34)`
                    if (suffix.indexOf(' (') > -1) {
                        suffix = suffix.split(' (')[1].substring(0, suffix.length - 1);
                    }
                    else if (suffix.indexOf('at ') > -1) {
                        suffix = suffix.split('at ')[1];
                    }
                    // Fallback to looking for just `file.js:12:34` (only gets the file name, not the path)
                    else if (/([^\/]+\:\d+\:\d+)/.test(suffix)) {
                        suffix = /([^\/]+\:\d+\:\d+)/.exec(suffix)[1];
                    }

                    suffix = '@' + suffix.substring(suffix.lastIndexOf('/') + 1);
                }

                return suffix;
            },

            /** @description Precise type-checker for JavaScript
             * @version 1.0.0
             * @date 2014-11-27
             * @copyright 2014
             * https://github.com/patik/kind
             */
            kind=function(a){var b,c,d;if(null===a){return"null";}if(/function|undefined|string|boolean|number/.test(typeof a)){return typeof a;}if("object"===typeof a){for(b=Object.prototype.toString.call(a),c=["Math","ErrorEvent","Error","Date","RegExp","Event","Array"],d=c.length;d--;){if(b==="[object "+c[d]+"]"){return c[d].toLowerCase();}return"object"===typeof HTMLElement&&a instanceof HTMLElement?"element":"string"===typeof a.nodeName&&1===a.nodeType?"element":"object"===typeof Node&&a instanceof Node?"node":"number"===typeof a.nodeType&&"string"===typeof a.nodeName?"node":/^\[object (HTMLCollection|NodeList|Object)\]$/.test(b)&&"number"===typeof a.length&&"undefined"!==typeof a.item&&(0===a.length||"object"===typeof a[0]&&a[0].nodeType>0)?"nodelist":"object";}}return"unknown";};

        // Define function
        log = function() {
            var args = arguments,
                // Convert arguments to an array
                sliced = Array.prototype.slice.call(args),
                // Whether this browser has a console we can call directly
                // Must evaluate this on each run in case Firebug was loaded since it will define the console
                hasConsole = (isIECompatibilityView || (window.console && typeof console.log === 'function')),
                err, i;

            log.history.push(arguments);

            // Browser with a console
            if (hasConsole) {
                // Group arguments
                if (log.options.group) {
                    if (log.options.group.collapsed) {
                        console.groupCollapsed(log.options.group.label);
                    }
                    else {
                        console.group(log.options.group.label);
                    }
                }

                // Add line number
                if (log.options.lineNumber) {
                    err = new Error();

                    // Firefox
                    if (err.fileName && err.lineNumber) {
                        sliced.push('@' + err.fileName.substr(err.fileName.lastIndexOf('/') + 1) + ':' + err.lineNumber + ':1');
                    }
                    // Chrome/WebKit
                    else if (err.stack) {
                        sliced.push(getLineFromStack(err.stack));
                    }
                }

                // Get argument details for browsers with primitive consoles if this optional plugin is included
                if (log.detailPrint && log.needsDetailPrint) {
                    // Display a separator before the list
                    console.log('-----------------');
                    args = log.detailPrint(args);
                    i = 0;

                    while (i < args.length) {
                        console.log(args[i]);

                        i++;
                    }
                }
                // Single argument, which is a string
                else if (sliced.length === 1 && typeof sliced[0] === 'string') {
                    console.log(sliced.toString());
                }
                // Multiple arguments
                else {
                    // IE 10 & 11 need to use `console.dir` for objects to display them in a useful manner
                    if (isIEModern) {
                        // Loop through arguments and log them individually so we can pick out the objects
                        i = 0;
                        while (i < args.length) {
                            // Plain object
                            if (isIEModern && kind(args[i]) === 'object') {
                                console.dir(args[i]);
                            }
                            // Some other type
                            else {
                                console.log(args[i]);
                            }

                            i++;
                        }
                    }
                    else {
                        // All other modern browsers (Chrome, Firefox, etc)
                        console.log(sliced);
                    }
                }

                // Group arguments
                if (log.options.group) {
                    console.groupEnd();
                }
            }
            // IE8
            else if (isIE8) {
                if (log.detailPrint) {
                    // Prettify arguments
                    args = log.detailPrint(args);

                    // Add separator at the beginning of the list
                    args.unshift('-----------------');

                    // Loop through arguments and log them individually
                    i = 0;
                    while (i < args.length) {
                        Function.prototype.call.call(console.log, console, Array.prototype.slice.call([args[i]]));
                        i++;
                    }
                }
                else {
                    Function.prototype.call.call(console.log, console, Array.prototype.slice.call(args));
                }
            }
            // IE7 and lower, and other old browsers
            else {
                // Inject Firebug lite
                if (!document.getElementById('FirebugLite')) {
                    // Include the script
                    includeFirebug();

                    // Give FBL a couple seconds to load, then attempt to log the arguments
                    setTimeout(function() {
                        window.log.apply(window, args);
                    }, 3000);

                    log.needsDetailPrint = false;
                }
                else if (firebugAttempts < 20) {
                    // FBL was included but it hasn't finished loading yet, so try again momentarily
                    setTimeout(function() {
                        window.log.apply(window, args);
                    }, 500);

                    firebugAttempts++;
                }
                else {
                    // Limit reached, Firebug must not be loading properly
                    // Reset the counter so the next call to `log()` can try again
                    firebugAttempts = 0;
                }
            }
        };

        // Maintain a history of all logs for reference
        log.history = [];

        // Default options
        log.options = {
            lineNumber: true,
            group: false
        };

        // IE 10/11 need grouping since the items will be logged on separate lines
        if (isIEModern && !log.options.group) {
            log.options.group = defaultGroupOptions;
        }

        // Update options
        log.settings = function _settings(opt) {
            if (opt && kind(opt) === 'object') {
                // Group options
                // Only apply to supporting browsers
                if (hasConsole && console.group) {
                    // Enable default group options
                    if (typeof opt.group === 'boolean') {
                        if (opt.group) {
                            log.options.group = defaultGroupOptions;
                        }
                        else {
                            log.options.group = false;
                        }
                    }
                    else if (kind(opt.group) === 'object') {
                        log.options.group = defaultGroupOptions;

                        if (typeof opt.group.collapsed !== 'undefined') {
                            log.options.group.collapsed = !!opt.group.collapsed;
                        }

                        if (typeof opt.group.label === 'string') {
                            log.options.group.label = opt.group.label;
                        }
                    }
                }

                if (typeof opt.lineNumber !== 'undefined') {
                    log.options.lineNumber = !!opt.lineNumber;
                }

            }
        };

        return log;
    }
));
