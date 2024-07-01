'use strict';

const NO_CASCADES = 8;
const NO_RESERVES = 4;
const NO_FOUNDATIONS = 4;
const RANK = "A23456789TJQK";
const SUIT = "CDHS";
const RESERVES = "ABCD";

function createTable() {
    return {
        reserves: new Array(NO_RESERVES).fill(""),
        foundations: new Array(NO_FOUNDATIONS).fill(""),
        cascades: new Array(NO_CASCADES).fill(new Array())
    };
}

function createTableFromJson(desc) {
    return JSON.parse(desc);
}

function move(table, str) {
    if (!(typeof str === 'string' || str instanceof String)) {
        throw new Error("Invalid type for move!");
    }
    if (str.length !== 2) {
        throw new Error("Invalid move; too short!");
    }
    var from = str.charAt(0);
    var to = str.charAt(1);
    if (!(isNaN(parseInt(from, 10)) && isNaN(parseInt(to, 10)))) {
        // Move cascade to cascade
        var fromNo = parseInt(from, 10);
        var toNo = parseInt(to, 10);
        var valid = true;
        if (fromNo < 0 || fromNo >= table.cascades.length) {
            valid = false;
        }
        if (toNo < 0 || toNo >= table.cascades.length) {
            valid = false;
        }
        if (fromNo === toNo) {
            valid = false;
        }
        if (!valid) {
            throw new Error("Invalid move!");
        }
        table.cascades[toNo].push(table.cascades[fromNo].pop());
    } else if (!isNaN(parseInt(from, 10)) && isNaN(parseInt(to, 10))) {
        var fromNo = parseInt(from, 10);
        if (!validateCascade(table, fromNo)) {
            return false;
        }
        if (to.toUpperCase() === "H") {
            // Move from cascade to foundations
            var c = table.cascades[fromNo].pop();
            var idx = SUIT.indexOf(c);
            if (idx === -1) {
                table.cascades[fromNo].push(c);
                return false;
            }
            if (table.foundations[idx].length === 0 && RANK.indexOf(c) === 0) {
                table.foundations[idx].push(c);
                return true;
            }
        } else {
            // Move from cascade to reserves
        }
    }
}

if (typeof window === 'undefined') {
    test_createTable();
    test_createTableFromJson1();
    test_createTableFromJson2();
    test_move1();
    test_move2();
}

function test_createTable() {
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var actual = JSON.stringify(createTable());
    if (expect !== actual) {
        print("test_createTable failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_createTableFromJson1() {
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var actual = JSON.stringify(createTableFromJson(expect));
    if (expect !== actual) {
        print("test_createTableFromJson1 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_createTableFromJson2() {
    var expect = `{"reserves":["","","KS",""],"foundations":["KC","KD","KH","QS"],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var actual = JSON.stringify(createTableFromJson(expect));
    if (expect !== actual) {
        print("test_createTableFromJson2 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move1() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["2D"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],["2D"],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "01");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move1 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move2() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],["2D", "9S"]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],["9S"],["2D"]]}`;
    var table = createTableFromJson(setup);
    move(table, "76");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move2 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}
