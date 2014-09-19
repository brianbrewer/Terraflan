/*
 * Web Worker for creating chunks using seeded noise
 */
/*global SimplexNoise, self*/
(function () {
    "use strict";

    self.importScripts("../thirdparty/seedrandom.min.js");
    self.importScripts("../thirdparty/perlin-noise-simplex.js");

    var computeChunk,
        oldCompute;

    self.addEventListener("message", function (e) {
        computeChunk(e.data.x, e.data.y);
    });

    // Example function for creating a chunks data as RGBA array
    computeChunk = function (chunkX, chunkY) {
        var PRNG,
            SEED,
            SIMPLEX,
            value,
            x,
            y,
            data;

        SEED = "Glacier";
        PRNG = {
            random: new Math.seedrandom(SEED)
        };
        SIMPLEX = new SimplexNoise(PRNG);

        data = [];
        for (y = 0; y < 64; y += 1) {
            for (x = 0; x < 64; x += 1) {
                value = SIMPLEX.noise(chunkX * 2 + (x / 32), chunkY * 2 + (y / 32));
                data.push(Math.round(value * 255));
                data.push(Math.round(value * 255));
                data.push(Math.round(value * 255));
                data.push(255);
            }
        }

        self.postMessage(data);

        self.close();
    };

    oldCompute = function (chunkX, chunkY) {
        var PRNG,
            SEED,
            SIMPLEX,
            data,
            total,
            hgrid,
            frequency,
            octaves,
            aplitude,
            lacunarity,
            gain,
            tileX,
            tileY,
            pixelX,
            pixelY,
            i,
            value;

        data = [];
        SEED = "Example";
        PRNG = {
            random: new Math.seedrandom(SEED)
        };
        SIMPLEX = new SimplexNoise(PRNG);

        for (tileY = 0; tileY < 64; tileY += 1) {
            for (tileX = 0; tileX < 64; tileX += 1) {
                pixelX = (tileX + chunkX * 64) / 192;
                pixelY = (tileY + chunkY * 64) / 256;

                // Fractional Brownian Motion
                total = 0;
                hgrid = 0.7;
                frequency = 1 / hgrid;
                octaves = 10;
                aplitude = 0.85;
                lacunarity = 2.1;
                gain = 0.5;

                for (i = 0; i < octaves; i += 1) {
                    total += SIMPLEX.noise(2 * pixelX * frequency, pixelY / 2 * frequency) * aplitude;
                    frequency *= lacunarity;
                    aplitude *= gain;
                }

                value = 1 - (step(pixelY + (total * 0.25), 0.5) | 0);
                data.push(Math.round(255 * value));
                data.push(Math.round(255 * value));
                data.push(Math.round(255 * value));
                data.push(255);
            }
        }

        self.postMessage(data);

        self.close();
    };
}());
