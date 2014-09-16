// Default data for input.js with controls, controller setups and control schemes
/*global Terraflan*/
(function () {
    "use strict";
    Terraflan.Data.Controls = {
        MoveLeft: {
            Keyboard: [
                65
            ],
            Controller: {
                Button: [],
                Axis: [0]
            },
            Mouse: [],
            Mobile: []
        },
        MoveRight: {
            Keyboard: [
                68
            ],
            Controller: {
                Button: [],
                Axis: [0]
            },
            Mouse: [],
            Mobile: []
        },
        Jump: {
            Keyboard: [
                87,
                32
            ],
            Controller: {
                Button: [],
                Axis: [1]
            },
            Mouse: [],
            Mobile: []
        },
        Crouch: {
            Keyboard: [
                83
            ],
            Controller: {
                Button: [],
                Axis: [1]
            },
            Mouse: [],
            Mobile: []
        },
        Cursor: {
            Keyboard: [],
            Controller: {
                Button: [],
                Axis: []
            },
            Mouse: [
                "Position"
            ],
            Mobile: []
        },
        Use: {
            Keyboard: [],
            Controller: {
                Button: [],
                Axis: []
            },
            Mouse: [
                "Left"
            ],
            Mobile: []
        },
        AltUse: {
            Keyboard: [],
            Controller: {
                Button: [],
                Axis: []
            },
            Mouse: [
                "Right"
            ],
            Mobile: []
        },
        Pause: {
            Keyboard: [
                27
            ],
            Controller: {
                Button: [],
                Axis: []
            },
            Mouse: [],
            Mobile: []
        },
        Inventory: {
            Keyboard: [
                69
            ],
            Controller: {
                Button: [],
                Axis: []
            },
            Mouse: [],
            Mobile: []
        }
    };
}());
