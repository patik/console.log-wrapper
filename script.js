(function() {
  var cldemo = {

    // The list of sample commands used to demonstrate the log() function
    commands: {
      button1: {
        method: function () { log( "Here's a string" , 3.14, {"three":false} ); }
      },
      button2: {
        method: function () { log( function () { alert("hello"); }, (2+2===5), new Date() ); }
      },
      button3: {
        method: function () { log( "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch" ); }
      }
    },

    // Setup the demo page for easy consumption
    init: function _init () {
      // Create the list of example methods and their buttons based on the object above,
      // rather than writing everything twice
      var ul = document.getElementById('command-list'),
          command, html, buttonIds = [];
      for (command in cldemo.commands) {
        if (cldemo.commands.hasOwnProperty(command)) {
          // Create a list item with a 'Run it' button and the code that it will, er, execute
          html  = '<li>';
          html += '<input type="button" id="' + command + '" value="Run" title="Go ahead, drop that log!"> ';
          html += '<code>';
          // Omit the wrapping "function () { }" for display
          html += cldemo.commands[command].method.toString().replace(/^function\s\(\)\s\{\s/,'').replace(/\s\}$/,'');
          html += '</code></li>';

          // Add the list item to the list
          ul.innerHTML += html;
          buttonIds.push(command);
        }
      }

      // Listen for button clicks
      buttonIds.forEach(function (buttonId) {
        cldemo.addEvent(document.getElementById(buttonId), 'click', function (event) { cldemo.executeMe(event); });
      });
    },

    // Run the method associated with a button that was clicked
    executeMe: function _executeMe (event) {
      if (!event && window.event) { log('ie event detected'); event = window.event; }
      var target = event.target || event.srcElement;
      cldemo.commands[target.id].method();
    },

    // Simple cross-browser addEventListener
    addEvent: function _addEvent (elem, eventName, func) {
      if (elem.addEventListener) {
        elem.addEventListener(eventName, func, false);
      }
      else if (elem.attachEvent) {
        elem.attachEvent('on' + eventName, func);
      }
    }
  };

  window.cldemo = cldemo;
  cldemo.addEvent(window, 'load', cldemo.setup);
}());

// Array.forEach polyfill
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function( callback, thisArg ) {
    var T, k;
    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    }
    var O = Object(this);
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32
    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }
    if ( thisArg ) {
      T = thisArg;
    }
    k = 0;
    while( k < len ) {
      var kValue;
      if ( k in O ) {
        kValue = O[ k ];
        callback.call( T, kValue, k, O );
      }
      k++;
    }
  };
}
