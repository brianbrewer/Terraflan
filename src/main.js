/*jslint browser: true, devel: true */
/*global AudioFX*/
//-- Terraflan Todo

/*- Programming
 * Loader
 * Renderer
 * Objects
 * Chunks
 * Randomosity
 * Animation
 * AI
 * Saving
 * Loading
 * Multiplayer
 * Server
 * Menus
 * UI
 * Inventory
 */

/*- Art
 * Dirt
 * Grass
 * Stone
 * Tree
 * Leaves
 * Ores
 * Player
 * Enemies
 * Objects
 * Items
 * Weapons
 * UI
 * TerraFlan Logo
 * Noise Butter Logo / Intro Animation :^]
 */

/* Load Order
 *
 * <script></scripts> files (main.js, loader.js)
 * Scripts (chunk, generate, render)
 * Resources (Sounds, Images)
 * Data
 * Setup Everything
 * Load from localhost / generate
 * render loop begin ?
 */

/* Storage
 * Storage will use localStorage
 * can hold 2.5M (2,560,000) characters (5120000 Bytes)
 *
 * Each chunk is 64^2 tiles
 * 4096 Tiles = 4096 Char = 8192 Bytes
 * 625 Chunks Available EXACTLY
 */

var Terraflan = (function () {
    "use strict";

	var self = {};

    // Global > information that can change
    self.WORLD = {
        CAMERA_X: 0,
        CAMERA_Y: 0
    };

    // Static Data > Important stuff that probably wont change ever
    self.STATIC = {
        TILE_WIDTH: 16,
        TILE_HEIGHT: 16,
        CHUNK_WIDTH: 64,
        CHUNK_HEIGHT: 64,
        SCREEN_WIDTH: 800,
        SCREEN_HEIGHT: 600,
        WORLD_WIDTH: 3,
        WORLD_HEIGHT: 3
    };

    // Chunks
    self.Chunk = [];

    // Sub Module / Object Stubs
    self.Data = {};
    self.Audio = {};
    self.Image = {};

    //@TODO: Timestep
    self.update = function () {

        // Draw Tiles


        /*
         * @TODO: Remove maybe
         *
        // Update
        self.PlayerController.update();
        self.InputController.update();

        // Render
        self.RenderController.update();
        */

        // Run Again
        window.setTimeout(self.update, 1000 / 60); // 60 FPS
    };

    self.setup = function (canvaselement) {
        var canvas,
            context,
            gradient,
            chunkX,
            chunkY,
            tileX,
            tileY;

        // Resize Canvas
        canvaselement.width = self.STATIC.SCREEN_WIDTH;
        canvaselement.height = self.STATIC.SCREEN_HEIGHT;

        // Reposition Canvas
        canvaselement.style.left = (window.innerWidth - self.STATIC.SCREEN_WIDTH) / 2 + "px";

        // Reposition Fluff :: Move at some point
        //@TODO: move around / remove
        document.getElementById("acknowledge").style.top = self.STATIC.SCREEN_HEIGHT + 10 + "px";

        // Setup Reposition Hook
        window.addEventListener("resize", function () {
            canvaselement.style.left = (window.innerWidth - self.STATIC.SCREEN_WIDTH) / 2 + "px";
            document.getElementById("acknowledge").style.top = self.STATIC.SCREEN_HEIGHT + 10 + "px";
        });

        //@TODO: Remove this testing
        // Test Sounds Library
        if (AudioFX.supported) {
            console.log("AudioFX supported, version " + AudioFX.version);
        } else {
            console.error("AudioFX not supported");
            alert("Audio Not Supported");
        }

        // Setup context
        context = canvaselement.getContext("2d");

        //@TODO: Remove this example
        context.rect(0, 0, self.STATIC.SCREEN_WIDTH, self.STATIC.SCREEN_HEIGHT);
        gradient = context.createLinearGradient(0, 0, self.STATIC.SCREEN_WIDTH, self.STATIC.SCREEN_HEIGHT);
        gradient.addColorStop(0, "#000");
        gradient.addColorStop(1, "#FFF");
        context.fillStyle = gradient;
        context.fill();

        //@FIXME Setup chunks
        for (chunkX = 0; chunkX < self.STATIC.WORLD_WIDTH; chunkX += 1) {
            self.Chunk[chunkX] = [];
            for (chunkY = 0; chunkY < self.STATIC.WORLD_HEIGHT; chunkY += 1) {
                self.Chunk[chunkX][chunkY] = [];
                for (tileX = 0; tileX < self.STATIC.CHUNK_WIDTH; tileX += 1) {
                    self.Chunk[chunkX][chunkY][tileX] = [];
                    for (tileY = 0; tileY < self.STATIC.CHUNK_HEIGHT; tileY += 1) {
                        self.Chunk[chunkX][chunkY][tileX][tileY] = 0;
                    }
                }
            }
        }
        
        
    };

	return self;
}());
