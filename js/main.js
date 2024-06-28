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
        var i = 0;
        var table = createTable();
        var solution = [];
        let cascades = true;
        while (buf = stdin.readLine()) {
            var ar = buf.trim().split(" ");
            if (ar[0] == '.') {
                cascades = false;
                i = 0;
                continue;
            }
            if (cascades) {
                table.cascades[i] = ar;
                i++;
            } else {
                solution.push(ar);
            }
        }
        print(JSON.stringify(table));
        print(JSON.stringify(solution));
    } catch (e) {
        print("Caught exception:");
        print(e.stack);
    }
}());
}
