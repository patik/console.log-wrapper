/*global log:true, kind:true */

// Tell IE9 to use its built-in console
if (Function.prototype.bind && /^object$|^function$/.test(typeof console) && typeof console.log === 'object' && typeof window.addEventListener === 'function') {
    ['_exception', 'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn']
        .forEach(function(method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
}

// log() -- The complete, cross-browser console.log wrapper for his or her logging pleasure
(function _log() {
    if (window.log) {
        return;
    }

    window.log = function() {
        var args = arguments,
            isIECompatibilityView = false,
            isIEModern = false, // IE 10 and 11, as of 11/2014
            i, sliced,
            // Test if the browser is IE8
            isIE8 = (function _isIE8() {
                // Modernizr, es5-shim, and other scripts may polyfill `Function.prototype.bind` so we can't rely solely on whether that is defined
                return (!Function.prototype.bind || (Function.prototype.bind && typeof window.addEventListener === 'undefined')) &&
                    typeof console === 'object' &&
                    typeof console.log === 'object';
            }());

        // Store logs to an array for reference
        log.history = log.history || [];
        log.history.push(arguments);

        if (typeof console === 'undefined') {
            return {};
        }

        // If the detailPrint plugin is loaded, check for IE10- pretending to be an older version,
        //   otherwise it won't pass the "Browser with a console" condition below. IE8-10 can use
        //   console.log normally, even though in IE7/8 modes it will claim the console is not defined.
        // TODO: Can someone please test this on Windows Vista and Windows 8?
        if (log.detailPrint && log.needsDetailPrint) {
            (function() {
                var ua = navigator.userAgent,
                    winRegexp = /Windows\sNT\s(\d+\.\d+)/;

                // Check for certain combinations of Windows and IE versions to test for IE running in an older mode
                if (console && console.log && /MSIE\s(\d+)/.test(ua) && winRegexp.test(ua)) {
                    // Windows 7 or higher cannot possibly run IE7 or older
                    if (parseFloat(winRegexp.exec(ua)[1]) >= 6.1) {
                        isIECompatibilityView = true;
                    }
                    // Cannot reliably test for IE8+ running in IE7 mode on XP (Win 5.1) or Vista (Win 6.0)...
                }
            }());
        }

        // Check for IE 10/11 now that we've had a chance to properly define `isIECompatibilityView` above
        isIEModern = (!isIECompatibilityView && !isIE8 && /Trident\//.test(navigator.userAgent));

        // Browser with a console
        if (isIECompatibilityView || (window.console && typeof console.log === 'function')) {
            sliced = Array.prototype.slice.call(args);

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
            else {
                // IE 10 & 11 need to use `console.dir` for objects to display them in a useful manner
                if (isIEModern) {
                    console.group();

                    // Loop through arguments and log them individually so we can pick out the objects
                    i = 0;
                    while (i < args.length) {
                        // Plain object
                        if (kind(args[i]) === 'object') {
                            console.dir(args[i]);
                        }
                        // Some other type
                        else {
                            console.log(args[i]);
                        }

                        i++;
                    }

                    console.groupEnd();
                }
                else {
                    // All other modern browsers (Chrome, Firefox, etc)
                    console.log(sliced);
                }
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
            if (!document.getElementById('firebug-lite')) {
                // Include the script
                (function () {
                    var script = document.createElement('script');

                    script.type = 'text/javascript';
                    script.id = 'firebug-lite';

                    // If you run the script locally, change this to /path/to/firebug-lite/build/firebug-lite.js
                    script.src = 'https://getfirebug.com/firebug-lite.js';

                    // If you want to expand the console window by default, uncomment this line
                    //document.getElementsByTagName('HTML')[0].setAttribute('debug','true');
                    document.getElementsByTagName('HEAD')[0].appendChild(script);
                }());

                // Give FBL a couple seconds to load, then attempt to log the arguments
                setTimeout(function() {
                    window.log.apply(window, args);
                }, 2000);
            }
            else {
                // FBL was included but it hasn't finished loading yet, so try again momentarily
                setTimeout(function() {
                    window.log.apply(window, args);
                }, 500);
            }
        }
    };
}());

/*! @description Precise type-checker for JavaScript
 * @version 1.0.0
 * @date 2014-11-27
 * @copyright 2014
 * https://github.com/patik/kind
 */
window.kind=function(a){var b,c,d;if(null===a){return"null";}if(/function|undefined|string|boolean|number/.test(typeof a)){return typeof a;}if("object"===typeof a){for(b=Object.prototype.toString.call(a),c=["Math","ErrorEvent","Error","Date","RegExp","Event","Array"],d=c.length;d--;){if(b==="[object "+c[d]+"]"){return c[d].toLowerCase();}return"object"===typeof HTMLElement&&a instanceof HTMLElement?"element":"string"===typeof a.nodeName&&1===a.nodeType?"element":"object"===typeof Node&&a instanceof Node?"node":"number"===typeof a.nodeType&&"string"===typeof a.nodeName?"node":/^\[object (HTMLCollection|NodeList|Object)\]$/.test(b)&&"number"===typeof a.length&&"undefined"!==typeof a.item&&(0===a.length||"object"===typeof a[0]&&a[0].nodeType>0)?"nodelist":"object";}}return"unknown";};
