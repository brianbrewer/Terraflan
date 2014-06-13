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

    return self;
}());
