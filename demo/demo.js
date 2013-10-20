/*global log:true */

(function demo() {
    // Sample commands used to demonstrate the log() function
    var commands = {
            a: {
                log: function() {
                    log("Here's a string", 3.14, {
                        'alpha': 5,
                        'bravo': false
                    }, document.getElementById('charlie'), new Date());
                },
                console: function() {
                    console.log("Here's a string", 3.14, {
                        'alpha': 5,
                        'bravo': false
                    }, document.getElementById('charlie'), new Date());
                }
            },
            b: {
                log: function() {
                    log(function() {
                        alert('hello');
                    }, (2 + 2 === 5), [1, '2', 3, 4, '5']);
                },
                console: function() {
                    console.log(function() {
                        alert('hello');
                    }, (2 + 2 === 5), [1, '2', 3, 4, '5']);
                }
            },
            c: {
                log: function() {
                    log('Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch');
                },
                console: function() {
                    console.log('Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch');
                }
            }
        };

    function init() {
        // Create the list of example methods and their buttons
        var inputs = document.getElementsByTagName('input'),
            i = inputs.length;

        while (i--) {
            addEvent(inputs[i], 'click', execute);
        }
    }

    // Run the method associated with a button that was clicked
    function execute(evt) {
        var target = getEventTarget(evt),
            method = target.getAttribute('data-method');

        commands[target.getAttribute('data-command')][method]();
    }

    function getEventTarget(evt) {
        var targ;

        if (!evt && window.event) {
            evt = window.event;
        }

        targ = evt.target || evt.srcElement;

        // Safari (old) bug?
        if (targ.nodeType === 3) {
            targ = targ.parentNode;
        }

        return targ;
    }


    // Simple cross-browser addEventListener
    function addEvent(elem, eventName, func) {
        if (elem.addEventListener) {
            elem.addEventListener(eventName, func, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent('on' + eventName, func);
        }
    }

    // Fill in the page
    addEvent(window, 'load', init);
}());
