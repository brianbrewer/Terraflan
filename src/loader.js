// Use similar method than toast.js to load required scripts, images, localhost options, chunks,
// animations, json, etc

/*jslint browser: true, devel: true */
/*global Terraflan, toast, AudioFX*/
Terraflan.loader = (function () {
    "use strict";

    var self = {};

    self.scriptList = [
        ["src/generate.js", function () { return Terraflan.generate; }],
        ["src/input.js", function () { return Terraflan.InputController; }],
        ["src/data/tiles.js", function () { return Terraflan.Data.Tiles; }],
        ["src/data/images.js", function () { return Terraflan.Data.Images; }],
        ["src/data/sounds.js", function () { return Terraflan.Data.Sounds; }],
        ["src/data/controls.js", function () { return Terraflan.Data.Controls; }],
        ["src/data/player.js", function () { return Terraflan.Data.Player; }]
    ];

    //@TODO: Create better loading sequence
    self.load = function (callback) {
        // Load Scripts && Data
        toast(self.scriptList, function () { self.loadAudio(callback); }); // Change callback order

        // Load Resources

        // Pack Resources

        // Pack Sounds

        // Begin Update / Draw Cycle
    };

    self.loadAudio = function (callback) {
        var sound,
            dsound,
            nsound,
            soundsToLoad,
            soundsLoaded,
            soundLoaded,
            i;

        soundsToLoad = Terraflan.Data.Sounds.length;
        soundsLoaded = 0;

        soundLoaded = function () {
            soundsLoaded += 1;
            if (soundsLoaded === soundsToLoad) {
                console.log("Sound Loading Complete");
                self.loadImages(callback);
            }
        };

        // Load Audio
        for (i = 0; i < Terraflan.Data.Sounds.length; i += 1) {
            dsound = Terraflan.Data.Sounds[i];
            nsound = new AudioFX(dsound.src, {
                formats: dsound.Format,
                loop: false,
                autoplay: false,
                volume: 1,
                pool: dsound.Pool
            }, soundLoaded);

            console.log("Loading " + dsound.Name);

            // Create for empty / undefined groups of sounds
            if (!Terraflan.Audio[dsound.Type]) {
                Terraflan.Audio[dsound.Type] = {};
            }
            Terraflan.Audio[dsound.Type][dsound.Name] = nsound;
        }
    };

    self.loadImages = function (callback) {
        var imagesLoaded,
            imageLoaded,
            imagesToLoad,
            dimage,
            nimage,
            i;

        imagesToLoad = Terraflan.Data.Images.length;
        imagesLoaded = 0;

        imageLoaded = function () {
            imagesLoaded += 1;
            if (imagesLoaded === imagesToLoad) {
                console.log("Image Loading Complete");
                callback();
            }
        };

        for (i = 0; i < Terraflan.Data.Images.length; i += 1) {
            dimage = Terraflan.Data.Images[i];
            nimage = new Image();
            nimage.onload = imageLoaded;
            nimage.src = dimage.src;

            console.log("Loading " + dimage.Name);

            // Create for empty / undefined groups of images
            if (!Terraflan.Image[dimage.Type]) {
                Terraflan.Image[dimage.Type] = {};
            }
            Terraflan.Image[dimage.Type][dimage.Name] = nimage;
        }
    };

    return self;
}());
