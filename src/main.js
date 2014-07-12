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

/* Tiles
 *
 * Within Terraflan.Data.Tiles are the outlines of what each tile should be when created (Template)
 *
 * The actual objects ontained within should either hold all information or only a subset
 *  and then relay the static information from the *.Tile list
 *
 * Example
 *  {
 *     ID:,
 *     Health:,
 *  }
 *
 */

/* Drawing
 *
 * Need to work on making the drawing loop as painfree as possible
 * Firefox doesn't particularly like drawing a large amount
 *
 * Limit to only drawing the parts of the chunks that are on screen instead of all chunks
 * visible in their entirety
 *
 * Maybe move to using WebGL to speed up the quad drawing // flat sprites no 3d or complex operations
 */

var Terraflan = (function () {
    "use strict";

	var self = {},
        updateChunks,
        updateEntities,
        updateLiquids,

        acontext; // Remove

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
        WORLD_WIDTH: 16,
        WORLD_HEIGHT: 8
    };

    // Canvas Container
    self.Canvas = {};

    // Context Container
    self.Context = {};

    // Chunks
    self.Chunk = [];
    self.Cache = [];

    // Sub Module / Object Stubs
    self.Data = {};
    self.Audio = {};
    self.Image = {};

    //@TODO: Timestep
    self.update = function () {
        var chunkX, chunkY,
            floorCameraChunkStartX,
            floorCameraChunkStartY,
            floorCameraChunkEndX,
            floorCameraChunkEndY;

        // Get input controller to run "tick" handlers
        Terraflan.InputController.update();

        // Make sure camera doesn't break everything
        if (self.WORLD.CAMERA_X < 0) {
            self.WORLD.CAMERA_X = 0;
        }
        if (self.WORLD.CAMERA_Y < 0) {
            self.WORLD.CAMERA_Y = 0;
        }

        //@FIXME Clear Screen (Cheapo!)
        acontext.clearRect(0, 0, self.STATIC.SCREEN_WIDTH, self.STATIC.SCREEN_HEIGHT);

        // Find chunks to draw horizontal
        floorCameraChunkStartX = 0;//Math.floor(self.WORLD.CAMERA_X / (self.STATIC.CHUNK_WIDTH * self.STATIC.TILE_WIDTH));
        floorCameraChunkEndX = 16;//1 + Math.floor((self.WORLD.CAMERA_X + self.STATIC.SCREEN_WIDTH) / (self.STATIC.CHUNK_WIDTH * self.STATIC.TILE_WIDTH));

        // Find chunks to draw vertical
        floorCameraChunkStartY = 0;//Math.floor(self.WORLD.CAMERA_Y / (self.STATIC.CHUNK_HEIGHT * self.STATIC.TILE_HEIGHT));
        floorCameraChunkEndY = 8;//1 + Math.floor((self.WORLD.CAMERA_Y + self.STATIC.SCREEN_WIDTH) / (self.STATIC.CHUNK_HEIGHT * self.STATIC.TILE_HEIGHT));

        // Draw cached chunks
        for (chunkX = floorCameraChunkStartX; chunkX < floorCameraChunkEndX; chunkX += 1) {
            for (chunkY = floorCameraChunkStartY; chunkY < floorCameraChunkEndY; chunkY += 1) {
                acontext.drawImage(self.Cache[chunkX][chunkY], chunkX * self.STATIC.CHUNK_WIDTH * self.STATIC.TILE_WIDTH - self.WORLD.CAMERA_X, chunkY * self.STATIC.CHUNK_HEIGHT * self.STATIC.TILE_HEIGHT - self.WORLD.CAMERA_Y);
            }
        }

        // Draw chunk boundries
        acontext.beginPath();
        for (chunkX = 0; chunkX < self.STATIC.WORLD_WIDTH; chunkX += 1) {
            for (chunkY = 0; chunkY < self.STATIC.WORLD_HEIGHT; chunkY += 1) {
                acontext.rect(chunkX * self.STATIC.CHUNK_WIDTH * self.STATIC.TILE_WIDTH - self.WORLD.CAMERA_X, chunkY * self.STATIC.CHUNK_HEIGHT * self.STATIC.TILE_HEIGHT - self.WORLD.CAMERA_Y, self.STATIC.CHUNK_WIDTH * self.STATIC.TILE_WIDTH, self.STATIC.CHUNK_HEIGHT * self.STATIC.TILE_HEIGHT);
            }
        }
        acontext.stroke();

        // Update Chunks
        // Update Entities
        // Render Game
        // Render UI
        // Stitch

        // Run Again
        window.requestAnimationFrame(self.update); // 60 FPS Max
    };

    self.setup = function (canvaselement) {
        var canvas,
            context,
            gradient,
            chunkX,
            chunkY,
            tileX,
            tileY,
            cacheCanvas,
            cacheContext;

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

        // Add camera controls
        Terraflan.InputController.setup();
        Terraflan.InputController.addActionHandler("MoveLeft", "tick", function () {
            self.WORLD.CAMERA_X -= 10;
        });

        Terraflan.InputController.addActionHandler("MoveRight", "tick", function () {
            self.WORLD.CAMERA_X += 10;
        });

        Terraflan.InputController.addActionHandler("Crouch", "tick", function () {
            self.WORLD.CAMERA_Y += 10;
        });

        Terraflan.InputController.addActionHandler("Jump", "tick", function () {
            self.WORLD.CAMERA_Y -= 10;
        });

        //@FIXME Setup chunks
        // Fills up all chunks with Dirt (1)
        for (chunkX = 0; chunkX < self.STATIC.WORLD_WIDTH; chunkX += 1) {
            self.Chunk[chunkX] = [];
            for (chunkY = 0; chunkY < self.STATIC.WORLD_HEIGHT; chunkY += 1) {
                self.Chunk[chunkX][chunkY] = [];
                for (tileX = 0; tileX < self.STATIC.CHUNK_WIDTH; tileX += 1) {
                    self.Chunk[chunkX][chunkY][tileX] = [];
                    for (tileY = 0; tileY < self.STATIC.CHUNK_HEIGHT; tileY += 1) {
                        self.Chunk[chunkX][chunkY][tileX][tileY] = Math.floor(1 + Math.random() * 4);
                    }
                }
            }
        }

        //@FIXME Cache Chunks
        for (chunkX = 0; chunkX < self.STATIC.WORLD_WIDTH; chunkX += 1) {
            self.Cache[chunkX] = [];
            for (chunkY = 0; chunkY < self.STATIC.WORLD_HEIGHT; chunkY += 1) {
                // Create new canvas
                cacheCanvas = document.createElement("canvas");
                cacheCanvas.width = self.STATIC.CHUNK_WIDTH * self.STATIC.TILE_WIDTH;
                cacheCanvas.height = self.STATIC.CHUNK_HEIGHT * self.STATIC.TILE_HEIGHT;

                // Create new context
                cacheContext = cacheCanvas.getContext("2d");

                // Draw tiles
                for (tileX = 0; tileX < self.STATIC.CHUNK_WIDTH; tileX += 1) {
                    for (tileY = 0; tileY < self.STATIC.CHUNK_HEIGHT; tileY += 1) {
                        if (Terraflan.Data.Tiles[self.Chunk[0][0][tileX][tileY]].Texture) {
                            cacheContext.drawImage(Terraflan.Image.Tile[Terraflan.Data.Tiles[self.Chunk[0][0][tileX][tileY]].Texture], self.STATIC.TILE_WIDTH * tileX - self.WORLD.CAMERA_X, self.STATIC.TILE_HEIGHT * tileY - self.WORLD.CAMERA_Y);
                        }
                    }
                }

                self.Cache[chunkX][chunkY] = cacheCanvas;
            }
        }

        acontext = context; // Horrible sloppy scoping

        self.update(); // Remove later also :D
    };

	return self;
}());
