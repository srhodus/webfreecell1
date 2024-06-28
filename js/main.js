'use strict';

const NO_CASCADES = 8;
const NO_RESERVES = 4;
const NO_FOUNDATIONS = 4;

function createTable() {
    return {
        reserves: new Array(NO_RESERVES).fill(""),
        foundations: new Array(NO_FOUNDATIONS).fill(""),
        cascades: new Array(NO_CASCADES).fill(new Array())
    };
}

if (typeof window === 'undefined') {
(function() {
    try {
        var stdin = new java.io.BufferedReader(new java.io.InputStreamReader(
            java.lang.System.in));
        var buf;
        while (buf = stdin.readLine()) {
            print(buf);
        }
        var table = createTable();
        // table.reserves[0] = "8H";
        // table.foundations[3] = "9S";
        // table.cascades[0].push("4D");
        // table.cascades[0].push("4C");
        // table.cascades[7].push("9C");
        print(JSON.stringify(table));
    } catch (e) {
        print("Caught exception:");
        print(e.stack);
    }
}());
}
