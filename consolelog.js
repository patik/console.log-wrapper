/*global log:false*/

// Tell IE9 to use its built-in console
if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log === 'object') {
  ['log','info','warn','error','assert','dir','clear','profile','profileEnd']
    .forEach(function (method) {
      console[method] = this.call(console[method], console);
    }, Function.prototype.bind);
}

// log() -- The complete, cross-browser (we don't judge!) console.log wrapper for his or her logging pleasure
if (!window.log) {
  window.log = function () {
    var args = arguments,
        isReallyIE8 = false,
        isReallyIE8Plus = false,
        ua, winRegexp, script, i;

    log.history = log.history || [];  // store logs to an array for reference
    log.history.push(arguments);

    // If the detailPrint plugin is loaded, check for IE10- pretending to be an older version,
    //   otherwise it won't pass the "Browser with a console" condition below. IE8-10 can use
    //   console.log normally, even though in IE7/8 modes it will claim the console is not defined.
    // TODO: Does IE11+ still have a primitive console, too? If so, how do I check for IE11+ running in old IE mode?
    // TODO: Can someone please test this on Windows Vista and Windows 8?
    if (log.detailPrint && log.needDetailPrint) {
      ua = navigator.userAgent;
      winRegexp = /Windows\sNT\s(\d+\.\d+)/;
      // Check for certain combinations of Windows and IE versions to test for IE running in an older mode
      if (console && console.log && /MSIE\s(\d+)/.test(ua) && winRegexp.test(ua)) {
        // Windows 7 or higher cannot possibly run IE7 or older
        if (parseFloat(winRegexp.exec(ua)[1]) >= 6.1) {
          isReallyIE8Plus = true;
        }
        // Cannot test for IE8+ running in IE7 mode on XP (Win 5.1) or Vista (Win 6.0)...
      }
    }

    // Browser with a console
    if (isReallyIE8Plus || (typeof console !== 'undefined' && typeof console.log === 'function')) {
      // Get argument details for browsers with primitive consoles if this optional plugin is included
      if (log.detailPrint && log.needDetailPrint && log.needDetailPrint()) {
        console.log('-----------------'); // Separator
        args = log.detailPrint(args);
        i = 0;
        while (i < args.length) {
          console.log(args[i]);
          i++;
        }
      }
      // Single argument, which is a string
      else if ((Array.prototype.slice.call(args)).length === 1 && typeof Array.prototype.slice.call(args)[0] === 'string') {
        console.log((Array.prototype.slice.call(args)).toString());
      }
      else {
        console.log((Array.prototype.slice.call(args)));
      }
    }

    // IE8
    else if (!Function.prototype.bind && typeof console !== 'undefined' && typeof console.log === 'object') {
      if (log.detailPrint) {
        Function.prototype.call.call(console.log, console, Array.prototype.slice.call(['-----------------'])); // Separator
        args = log.detailPrint(args);
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
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'firebug-lite';
        // If you run the script locally, change this to /path/to/firebug-lite/build/firebug-lite.js
        script.src = 'https://getfirebug.com/firebug-lite.js';
        // If you want to expand the console window by default, uncomment this line
        //document.getElementsByTagName('HTML')[0].setAttribute('debug','true');
        document.getElementsByTagName('HEAD')[0].appendChild(script);
        setTimeout(function () { window.log.apply(window, args); }, 2000);
      }
      else {
        // FBL was included but it hasn't finished loading yet, so try again momentarily
        setTimeout(function () { window.log.apply(window, args); }, 500);
      }
    }
  };
}
