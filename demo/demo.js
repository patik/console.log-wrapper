var demo = {

  // The list of sample commands used to demonstrate the log() function
  commands: {
    a: {
      log: function () { log( "Here's a string" , 3.14, {"alpha": 5, "bravo": false}, document.getElementById('charlie'), new Date() ); },
      console: function () { console.log( "Here's a string" , 3.14, {"alpha": 5, "bravo": false}, document.getElementById('charlie'), new Date() ); }
    },
    b: {
      log: function () { log( function () { alert("hello"); }, (2+2===5), [1, '2', 3, 4, '5'] ); },
      console: function () { console.log( function () { alert("hello"); }, (2+2===5), [1, '2', 3, 4, '5'] ); }
    },
    c: {
      log: function () { log( "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch" ); },
      console: function () { console.log( "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch" ); }
    }
  },

  init: function _init () {
    // Create the list of example methods and their buttons
    var inputs = document.getElementsByTagName('input'),
        i = inputs.length;

    while (i--) {
      demo.event.add(inputs[i], 'click', demo.execute);
    }
  },

  // Run the method associated with a button that was clicked
  execute: function _execute (evt) {
    var target = demo.event.getTarget(evt),
        method = target.getAttribute('data-method');

    demo.commands[target.getAttribute('data-command')][method]();
  },

  event: {
    getTarget: function _event_getTarget (evt) {
      var targ;
      if (!evt && window.event) { evt = window.event; }
      targ = evt.target || evt.srcElement;
      if (targ.nodeType === 3) { targ = targ.parentNode; } // Safari (old) bug?
      return targ;
    },

    // Simple cross-browser addEventListener
    add: function _event_add (elem, eventName, func) {
      if (elem.addEventListener) {
        elem.addEventListener(eventName, func, false);
      }
      else if (elem.attachEvent) {
        elem.attachEvent('on' + eventName, func);
      }
    }
  }
};

// Fill in the page
demo.event.add(window, 'load', demo.init);
