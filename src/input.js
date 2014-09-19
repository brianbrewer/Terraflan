// Script for managing input types etc.
// Also responsible for mobile overlay*
// *maybe not

/*jslint browser: true, devel: true */
/*global Terraflan*/

/*
 * Internal Action Handler Even Codes
 * Code : Explanation : Event States Supported
 *
 * Keyboard Codes -
 * Kx : x is a keyCode : Start, End, Tick
 *
 * Mouse Codes -
 * MLeft : LMB : Start
 * MRight : RMB : Start
 * MMiddle : MMB : Start
 * MUp : Scroll Up : Start
 * MDown : Scroll Down : Start
 * Position: x, y of mouse : Tick
 *
 * Controller Codes -
 * CBx : x is a button : Start, End, Tick
 * CAx : x is an axis : Start, End, Tick
 */

Terraflan.InputController = (function () {
    "use strict";

    var self = {},
        actionHandler = {},
        keyState = {},
        mouseState = {},
        buttonState = [[], [], [], []],
        axisState = [[], [], [], []],
        getMouseButton,
        manageControllers,
        constructCallback,
        debug = false;

    self.Gamepads = [];

    self.OPTIONS = {
        axisDeadZone: 0.1
    };

    self.setup = function () {
        var gamepadSupported;
        // Check for gamepad support
        gamepadSupported = navigator.getGamepads ||
            !!navigator.webkitGetGamepads ||
            !!navigator.webkitGamepads;

        if (!gamepadSupported) {
            console.log("No controller support");
        }

        // Add keyhandlers
        window.addEventListener("keydown", function (e) {
            var i;

            if (!keyState[e.keyCode] || false) {
                keyState[e.keyCode] = true;

                if (debug) { console.log(e.keyCode, "K" + e.keyCode); }

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

                if (debug) { console.log(e.keyCode, "K" + e.keyCode); }

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

            if (debug) { console.log(button, "M" + button); }

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

            if (debug) { console.log(button, "M" + button); }

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
                if (debug) { console.log(button, "M" + button); }

                // Execute all relevant callbacks
                if (actionHandler["M" + button] && actionHandler["M" + button].start) {
                    for (i = 0; i < actionHandler["M" + button].start.length; i += 1) {
                        actionHandler["M" + button].start[i](e);
                    }
                }
            }
        });

        // Add controller handler
        // Add mobile overlay && handlers
    };

    self.addActionHandler = function (actionName, state, callback) {
        var i,
            keycode,
            mousecode,
            buttoncode,
            axiscode;

        // Add callbacks to keyboard handlers
        for (i = 0; i < Terraflan.Data.Controls[actionName].Keyboard.length; i += 1) {
            // Keyboard codes start with K eg. K85
            keycode = "K" + Terraflan.Data.Controls[actionName].Keyboard[i];
            if (debug) { console.log(keycode); }

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
            if (debug) { console.log(mousecode); }

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

        // Add controller handler callbacks
        for (i = 0; i < Terraflan.Data.Controls[actionName].Controller.Button.length; i += 1) {
            buttoncode = "CB" + Terraflan.Data.Controls[actionName].Controller.Button[i];
            if (debug) { console.log(buttoncode); }

            if (!actionHandler[buttoncode]) {
                actionHandler[buttoncode] = {};
            }
            if (!actionHandler[buttoncode][state]) {
                actionHandler[buttoncode][state] = [];
            }
            actionHandler[buttoncode][state].push(callback);
        }
        for (i = 0; i < Terraflan.Data.Controls[actionName].Controller.Axis.length; i += 1) {
            axiscode = "CA" + Terraflan.Data.Controls[actionName].Controller.Axis[i];
            if (debug) { console.log(axiscode); }

            if (!actionHandler[axiscode]) {
                actionHandler[axiscode] = {};
            }
            if (!actionHandler[axiscode][state]) {
                actionHandler[axiscode][state] = [];
            }
            actionHandler[axiscode][state].push(callback);
        }
    };

    //@TODO: Flesh out
    self.removeActionHandler = function (actionName, state, callback) {
        console.log(actionName, state, callback);
        throw ".removeActionHandler not implemented";
    };

    self.update = function (delta) {
        // If keystate open, run possible tick state of action
        // Work out those later :D

        // Keyboard State Tick
        var key, i;
        for (key in keyState) {
            if (keyState.hasOwnProperty(key) && keyState[key]) {
                // Execute all relevant callbacks
                if (actionHandler["K" + key] && actionHandler["K" + key].tick) {
                    for (i = 0; i < actionHandler["K" + key].tick.length; i += 1) {
                        actionHandler["K" + key].tick[i](constructCallback({delta: delta}));
                    }
                }
            }
        }

        // Gamepad / Controller updates
        manageControllers(delta);
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

    //@TODO: Manage buttonState after controller removal?
    manageControllers = function (delta) {
        var rawGamepads,
            previousGamepadCount,
            i,
            j,
            k;

        previousGamepadCount = self.Gamepads.length;

        rawGamepads =
            (navigator.getGamepads && navigator.getGamepads()) ||
            (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

        // Iterate through raw data
        if (rawGamepads) {
            self.Gamepads = [];
            for (i = 0; i < rawGamepads.length; i += 1) {
                if (rawGamepads[i]) {
                    self.Gamepads.push(rawGamepads[i]);
                }
            }
        }
        if (self.Gamepads.length < previousGamepadCount && debug) {
            console.log("Gamepad Disconnected");
        }
        if (self.Gamepads.length > previousGamepadCount && debug) {
            console.log("Gamepad Connected");
        }

        for (i = 0; i < self.Gamepads.length; i += 1) {
            // Check for button presses
            for (j = 0; j < self.Gamepads[i].buttons.length; j += 1) {

                // Button Down
                if (self.Gamepads[i].buttons[j].pressed && !buttonState[i][j]) {
                    buttonState[i][j] = true;

                    if (actionHandler["CB" + j] && actionHandler["CB + j"].start) {
                        for (k = 0; k < actionHandler["CB + j"].start.length; k += 1) {
                            actionHandler["CB" + j].start[k](constructCallback({
                                controller: i,
                                delta: delta
                            }));
                        }
                    }
                }

                // Tick
                if (self.Gamepads[i].buttons[j].pressed) {
                    if (actionHandler["CB" + j] && actionHandler["CB + j"].start) {
                        for (k = 0; k < actionHandler["CB + j"].start.length; k += 1) {
                            actionHandler["CB" + j].start[k](constructCallback({
                                controller: i,
                                delta: delta
                            }));
                        }
                    }
                }

                // Button Up
                if (!self.Gamepads[i].buttons[j].pressed && buttonState[i][j]) {
                    buttonState[i][j] = false;

                    if (actionHandler["CB" + j] && actionHandler["CB + j"].end) {
                        for (k = 0; k < actionHandler["CB + j"].end.length; k += 1) {
                            actionHandler["CB" + j].end[k](constructCallback({
                                controller: i,
                                delta: delta
                            }));
                        }
                    }
                }
            }

            // Check for axis movement
            for (j = 0; j < self.Gamepads[i].axes.length; j += 1) {
                // Check for leaving dead zone (Start)
                if (Math.abs(self.Gamepads[i].axes[j]) > self.OPTIONS.axisDeadZone &&
                        Math.abs(axisState[i][j]) < self.OPTIONS.axisDeadZone) {
                    if (actionHandler["CA" + j] && actionHandler["CA" + j].start) {
                        for (k = 0; k < actionHandler["CA" + j].start.length; k += 1) {
                            actionHandler["CA" + j].start[k](constructCallback({
                                controller: i,
                                axis: self.Gamepads[i].axes[j],
                                delta: delta
                            }));
                        }
                    }
                    if (debug) { console.log("Leaving Deadzone!", i, j); }
                }

                // Tick
                if (Math.abs(axisState[i][j]) > self.OPTIONS.axisDeadZone) {
                    if (actionHandler["CA" + j] && actionHandler["CA" + j].tick) {
                        for (k = 0; k < actionHandler["CA" + j].tick.length; k += 1) {
                            actionHandler["CA" + j].tick[k](constructCallback({
                                controller: i,
                                axis: self.Gamepads[i].axes[j],
                                delta: delta
                            }));
                        }
                    }
                    if (debug) { console.log("Ticking out of deadzone", i, j); }
                }

                // Check for entering dead zone (End)
                if (Math.abs(self.Gamepads[i].axes[j]) < self.OPTIONS.axisDeadZone &&
                        Math.abs(axisState[i][j]) > self.OPTIONS.axisDeadZone) {
                    if (actionHandler["CA" + j] && actionHandler["CA" + j].end) {
                        for (k = 0; k < actionHandler["CA" + j].end.length; k += 1) {
                            actionHandler["CA" + j].end[k](constructCallback({
                                controller: i,
                                axis: self.Gamepads[i].axes[j],
                                delta: delta
                            }));
                        }
                    }
                    if (debug) { console.log("Entering Deadzone!", i, j); }
                }

                // Update state at end of life
                axisState[i][j] = self.Gamepads[i].axes[j];
            }
        }
    };

    /* Used to create object to send back to actionHandlers
     *
     * Possible Fields:
     * delta* : Delta Time for smooth movement
     * axis : Used for non boolean inputs / analogue
     * controller: Controller number used (1-4 | null)
     *
     * *Required
     */
    //@TODO: Manage these values, probably remove quite a few of them
    constructCallback = function (callbackObject) {
        return {
            delta: callbackObject.delta || console.error("No delta"),
            axis: callbackObject.axis || null,
            controller: callbackObject.controller || null
        };
    };

    self.getActionHandler = function () {
        return actionHandler;
    };

    return self;
}());
