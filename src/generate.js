/*jslint browser: true, devel: true */
/*global Terraflan*/
Terraflan.generate = (function () {
    "use strict";

    var self = {};

    self.chunk = function () {
        console.log("Generating Chunk");
    };

    self.image = function () {
        console.log("Generating Image");
    };

    self.decToUTF16 = function (dec) {
        var num;

        num = dec.toString(10);
        while (num.length < 4) {
            num = "0" + num;
        }

        return String.fromCharCode(num);
    };

    self.charToDec = function (char) {
        return char.charCodeAt(0);
    };

    self.saveChunk = function (cx, cy) {
        // Chunk is an array in [x, y] format
        // [x[y]] technically

        // Search through and chunk into a large string
        // Based on chunk size static variable

        var chunkX,
            chunkY,
            chunkString,
            getChunkAction;

        chunkString = "";

        // Stub for getting the
        getChunkAction = function () {
            return Math.floor(Math.random() * 4096);
        };

        // Iterate through chunk
        for (chunkX = 0; chunkX < Terraflan.STATIC.CHUNK_WIDTH; chunkX += 1) {
            for (chunkY = 0; chunkY < Terraflan.STATIC.CHUNK_HEIGHT; chunkY += 1) {
                chunkString += self.decToUTF16(getChunkAction());
            }
        }
        localStorage["Terraflan|Chunk|" + cx + "|" + cy] = chunkString;

        return chunkString;
    };

    self.loadChunk = function (cx, cy) {
        var chunkX,
            chunkY,
            loadChunk,
            chunkString;

        chunkString = localStorage["Terraflan|Chunk|" + cx + "|" + cy];
        loadChunk = [];

        // Simulate loading sequence to double check both pieces of code
        loadChunk = [];
        for (chunkX = 0; chunkX < Terraflan.STATIC.CHUNK_WIDTH; chunkX += 1) {
            loadChunk[chunkX] = [];
            for (chunkY = 0; chunkY < Terraflan.STATIC.CHUNK_HEIGHT; chunkY += 1) {
                loadChunk[chunkX][chunkY] = chunkString.charCodeAt(chunkX * Terraflan.STATIC.CHUNK_WIDTH + chunkY);
            }
        }

        return loadChunk;
    };

    return self;
}());
