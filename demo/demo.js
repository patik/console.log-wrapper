/*global log:true, alert:true */

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
        },
        options = {
            container: null,
            lineNumber: null,
            group: null,
            groupContainer: null,
            groupCollapsed: null,
            groupOptions: null,
            groupLabel: null
        },
        addEvent;

    function init() {
        // Create the list of example methods and their buttons
        var buttons = document.getElementsByTagName('button'),
            i = buttons.length;

        while (i--) {
            addEvent(buttons[i], 'click', execute);
        }

        // Options
        if (window.console && typeof console.log === 'function') {
            // Cache form elements
            options.container = document.getElementById('options');
            options.lineNumber = document.getElementById('lineNumber');
            options.group = document.getElementById('group');
            options.groupContainer = options.group.parentNode.parentNode.parentNode.parentNode;
            options.groupCollapsed = document.getElementById('groupCollapsed');
            options.groupOptions = document.getElementById('group-options');
            options.groupLabel = document.getElementById('groupLabel');

            // Show options container
            options.container.className = options.container.className.replace(/\s*hidden\s*/, '');

            addEvent(options.lineNumber, 'change', onLineNumberChange);

            // Show group options
            if (console.group) {
                options.groupContainer.className = options.groupContainer.className.replace(/\s*hidden\s*/, '');

                addEvent(options.group, 'change', onGroupChange);
                addEvent(options.groupCollapsed, 'change', onGroupExtrasChange);
                addEvent(options.groupLabel, 'keyup', onGroupExtrasChange);
            }
        }
    }

    // Run the method associated with a button that was clicked
    function execute(evt) {
        var target = getEventTarget(evt),
            method = target.getAttribute('data-method');

        commands[target.getAttribute('data-command')][method]();
    }

    //////////////////////
    // Options updaters //
    //////////////////////

    function onLineNumberChange(evt) {
        log.settings({
            lineNumber: !!options.lineNumber.checked
        });
    }

    function onGroupChange(evt) {
        var checked = !!options.group.checked;

        if (checked) {
            log.settings({
                group: {
                    label: options.groupLabel.value,
                    collapsed: !!options.groupCollapsed.checked
                }
            });

            // Show other group options
            options.groupOptions.className = options.groupOptions.className.replace(/\s*hidden\s*/g, '');
        }
        else {
            log.settings({
                group: false
            });

            // Hide other group options
            options.groupOptions.className += ' hidden';
        }
    }

    function onGroupExtrasChange(evt) {
        log.settings({
            group: {
                label: options.groupLabel.value,
                collapsed: !!options.groupCollapsed.checked
            }
        });
    }

    ///////////////
    // Utilities //
    ///////////////

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

    // Simple cross-browser `addEventListener`
    if (window.addEventListener) {
        addEvent = function (elem, eventName, func) {
            elem.addEventListener(eventName, func, false);
        };
    }
    else {
        addEvent = function (elem, eventName, func) {
            elem.attachEvent('on' + eventName, func);
        };
    }

    // Fill in the page
    addEvent(window, 'load', init);
}());
