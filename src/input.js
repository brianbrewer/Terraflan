// Script for managing input types etc.
// Also responsible for mobile overlay

/*jslint browser: true, devel: true */
/*global Terraflan*/
Terraflan.InputController = (function () {
    "use strict";

    var self = {},
        keyState = {},
        actionHandler = {},
        getMouseButton;

    self.setup = function () {
        // Add keyhandlers
        window.addEventListener("keydown", function (e) {
            var i;

            if (!keyState[e.keyCode] || false) {
                keyState[e.keyCode] = true;

                console.log(e.keyCode, "K" + e.keyCode);

                // Execute all relevant callbacks
                if (actionHandler["K" + e.keyCode] && actionHandler["K" + e.keyCode].start) {
                    for (i = 0; i < actionHandler["K" + e.keyCode].start.length; i += 1) {
                        actionHandler["K" + e.keyCode].start[i](e);
                    }
                }
            }
        });

        window.addEventListener("keyup", function (e) {
            var i;

            if (keyState[e.keyCode]) {
                keyState[e.keyCode] = false;

                console.log(e.keyCode, "K" + e.keyCode);

                // Execute all relevant callbacks
                if (actionHandler["K" + e.keyCode] && actionHandler["K" + e.keyCode].end) {
                    for (i = 0; i < actionHandler["K" + e.keyCode].end.length; i += 1) {
                        actionHandler["K" + e.keyCode].end[i](e);
                    }
                }
            }
        });

        // Add mousehandlers
        window.addEventListener("mousedown", function (e) {
            var i,
                button;

            button = getMouseButton(e);

            console.log(button, "M" + button);

            // Execute all relevant callbacks
            if (actionHandler["M" + button] && actionHandler["M" + button].start) {
                for (i = 0; i < actionHandler["M" + button].start.length; i += 1) {
                    actionHandler["M" + button].start[i](e);
                }
            }
        });

        window.addEventListener("mouseup", function (e) {
            var i,
                button;

            button = getMouseButton(e);

            console.log(button, "M" + button);

            // Execute all relevant callbacks
            if (actionHandler["M" + button] && actionHandler["M" + button].end) {
                for (i = 0; i < actionHandler["M" + button].end.length; i += 1) {
                    actionHandler["M" + button].end[i](e);
                }
            }
        });

        // Mouse wheel only has one state (start)
        window.addEventListener((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", function (e) {
            var i,
                button;

            button = getMouseButton(e);

            if (button !== null) {
                console.log(button, "M" + button);

                // Execute all relevant callbacks
                if (actionHandler["M" + button] && actionHandler["M" + button].start) {
                    for (i = 0; i < actionHandler["M" + button].start.length; i += 1) {
                        actionHandler["M" + button].start[i](e);
                    }
                }
            }
        });

        // Add controller handler (ish)
        // Add mobile overlay && handlers
    };

    self.addActionHandler = function (actionName, state, callback) {
        var i,
            keycode,
            mousecode;

        // Add callbacks to keyboard handlers
        for (i = 0; i < Terraflan.Data.Controls[actionName].Keyboard.length; i += 1) {
            // Keyboard codes start with K eg. K85
            keycode = "K" + Terraflan.Data.Controls[actionName].Keyboard[i];

            console.log(keycode);

            //@TODO: Check if state is possible (start, tick end)

            // Create if empty / otherwise create
            if (!actionHandler[keycode]) {
                actionHandler[keycode] = {};
            }

            // Create if empty / otherwise create
            if (!actionHandler[keycode][state]) {
                actionHandler[keycode][state] = [];
            }
            actionHandler[keycode][state].push(callback);
        }

        // Add mouse handler callbacks
        for (i = 0; i < Terraflan.Data.Controls[actionName].Mouse.length; i += 1) {
            // Mouse codes are MLeft, MRight, MUp, MDown
            mousecode = "M" + Terraflan.Data.Controls[actionName].Mouse[i];

            console.log(mousecode);

            //@TODO: Check if state is possible (start, tick end)

            // Create if empty / otherwise create
            if (!actionHandler[mousecode]) {
                actionHandler[mousecode] = {};
            }

            // Create if empty / otherwise create
            if (!actionHandler[mousecode][state]) {
                actionHandler[mousecode][state] = [];
            }
            actionHandler[mousecode][state].push(callback);
        }
    };

    self.removeActionHandler = function (actionName, state, callback) {};

    self.update = function () {
        // If keystate open, run possible tick state of action
        // Work out those later :D
    };

    getMouseButton = function (e) {
        var button,
            direction;

        // Normalize event variable
        e = window.event || e;

        // Set button to initially not recognised / false
        button = "";

        // Check if this is a button push event
        if (e.type === "mousedown" || e.type === "mouseup") {
            if (e.which === null) {
                // Check for IE
                button = (e.button < 2) ? "Left" : ((e.button === 4) ? "Middle" : "Right");
            } else {
                // Check for other browsers
                button = (e.which < 2) ? "Left" : ((e.which === 2) ? "Middle" : "Right");
            }
        } else {
            // If not a button event get the mouse scroll direction
            direction = e.detail ? e.detail * (-120) : e.wheelDelta;
            switch (direction) {
            case 120:
            case 240:
            case 360:
                button = "Up";
                break;
            case -120:
            case -240:
            case -360:
                button = "Down";
                break;
            }
        }

        return button;
    };

    return self;
}());