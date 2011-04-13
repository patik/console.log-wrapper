// The list of sample commands used to demonstrate the log() function
var commands = {
  'log-exec1': {
    'method': function () { log( "Here's a string" , 3.14, {"three":false} ); }
  },
  'log-exec2': {
    'method': function () { log( function () { alert("hello"); }, (2+2===5), new Date() ); }
  },
  'log-exec3': {
    'method': function () { log( "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch" ); }
  }
};

// Setup the demo page for easy consumption
function setup ()
{
  // Create the list of example methods and their buttons based on the object above, 
  // rather than writing everything twice
  var ul = document.getElementById('command-list'),
      i, html, buttonIds = [];
  for (i in commands) {
    // Create a list item with a 'Run it' button and the code that it will, er, execute
    html  = '<li>'
    html += '<input type="button" id="' + i + '" value="Run it" title="Go ahead, drop that log!"> ';
    html += '<code>';
    // Omit the wrapping "function () { }" for display
    html += commands[i].method.toString().replace(/^function\s\(\)\s\{\s/,'').replace(/\s\}$/,'');
    html += '</code></li>';
    
    // Add the list item to the list
    ul.innerHTML += html;
    buttonIds.push(i);
  }
  
  // Listen for button clicks
  i = buttonIds.length;
  while (i--) {
    addEvent(document.getElementById(buttonIds[i]), 'click', function (event) { executeMe(event); });
  }
}

// Run the method associated with a button that was clicked
function executeMe (event)
{
  if (!event && window.event) { log('ie event'); event = window.event; }
  var target = event.target || event.srcElement;
  commands[target.id].method();
}

// (Overly?) Simple cross-browser addEventListener
function addEvent (oElem,sEventName,sFunction)
{
  if (oElem.addEventListener) {
    oElem.addEventListener(sEventName,sFunction,false);
  }
  else if (oElem.attachEvent) {
    oElem.attachEvent('on' + sEventName,sFunction);
  }
}

// Fill in the page
addEvent(window,'load',setup);

// Array.prototype.slice.call(arguments)