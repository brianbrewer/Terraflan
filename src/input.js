// Script for managing input types etc.
// Also responsible for mobile overlay

/*jslint browser: true, devel: true */
/*global Terraflan*/
Terraflan.InputController = (function () {
    "use strict";

    var self = {},
        keyState = [],
        actionHandler = {};

    self.setup = function () {
        // Add keyhandlers
        window.addEventListener("keydown", function (e) {
            var i;

            if (!keyState[e.keyCode] || false) {
                keyState[e.keyCode] = true;

                // Execute all relevant callbacks
                if (actionHandler["K" + e.keyCode].start) {
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

                // Execute all relevant callbacks
                if (actionHandler["K" + e.keyCode].end) {
                    for (i = 0; i < actionHandler["K" + e.keyCode].end.length; i += 1) {
                        actionHandler["K" + e.keyCode].end[i](e);
                    }
                }
            }
        });

        // Add mousehandlers
        // Add controller handler (ish)
        // Add mobile overlay && handlers
    };

    self.addActionHandler = function (actionName, state, callback) {
        var i,
            keycode;

        // Add callbacks to keyboard handlers
        for (i = 0; i < Terraflan.Data.Controls[actionName].Keyboard.length; i += 1) {
            // Keyboard codes start with K eg. K85
            keycode = "K" + Terraflan.Data.Controls[actionName].Keyboard[i];
            actionHandler[keycode] = {};
            actionHandler[keycode][state] = [];
            actionHandler[keycode][state].push(callback);
        }

        // Add mouse handler callbacks
    };

    self.removeActionHandler = function (actionName, state, callback) {};

    self.update = function () {
        // If keystate open, run possible tick state of action
        // Work out those later :D
    };

    return self;
}());