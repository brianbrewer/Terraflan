// Default data for input.js with controls, controller setups and control schemes
/*global Terraflan*/
(function () {
    "use strict";
    Terraflan.Data.Controls = {
        MoveLeft: {
            Keyboard: [
                65
            ],
            Controller: [],
            Mouse: [],
            Mobile: []
        },
        MoveRight: {
            Keyboard: [
                68
            ],
            Controller: [],
            Mouse: [],
            Mobile: []
        },
        Jump: {
            Keyboard: [
                87,
                32
            ],
            Controller: [],
            Mouse: [],
            Mobile: []
        },
        Cursor: {
            Keyboard: [],
            Controller: [],
            Mouse: [
                "Position"
            ],
            Mobile: []
        },
        Use: {
            Keyboard: [],
            Controller: [],
            Mouse: [
                "Left"
            ],
            Mobile: []
        },
        AltUse: {
            Keyboard: [],
            Controller: [],
            Mouse: [
                "Right"
            ],
            Mobile: []
        },
        Pause: {
            Keyboard: [
                27
            ],
            Controller: [],
            Mouse: [],
            Mobile: []
        },
        Inventory: {
            Keyboard: [
                69
            ],
            Controller: [],
            Mouse: [],
            Mobile: []
        }
    };
}());