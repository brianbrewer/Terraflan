/*global Terraflan*/
(function () {
    "use strict";
    Terraflan.Data.Tiles = [
        {
            Name: "Air",
            Breakable: false,
            Health: Infinity,
            Strength: 0,
            Solid: false,
            Texture: null,
            Item: null,
            PickSound: null,
            BreakSound: null,
            StepSound: null,
            LandSound: null,
            PlaceSound: null,
            onBreak: null,
            onPlace: null
        },
        {
            Name: "Dirt",
            Breakable: true,
            Health: 20,
            Strength: 0,
            Solid: true,
            Texture: "Dirt",
            Item: 0,
            PickSound: "DirtPick",
            BreakSound: "DirtBreak",
            StepSound: "DirtStep",
            LandSound: "DirtLand",
            PlaceSound: "DirtPlace",
            onBreak: null,
            onPlace: null
        },
        {
            Name: "Stone",
            Breakable: true,
            Health: 100,
            Strength: 0,
            Solid: true,
            Texture: "Stone",
            Item: 0,
            PickSound: "StonePick",
            BreakSound: "StoneBreak",
            StepSound: "StoneStep",
            LandSound: "StoneLand",
            PlaceSound: "StonePlace",
            onBreak: null,
            onPlace: null
        }
    ];
}());
