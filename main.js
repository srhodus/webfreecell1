'use strict';

const NO_CASCADES = 8;
const NO_RESERVES = 4;
const NO_FOUNDATIONS = 4;
const RANK = "A23456789TJQK";
const SUIT = "CDHS";
const RESERVES = "ABCD";
const COLOR = {
    BLACK: 0,
    RED: 1
}

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

function suit(str) {
    var valid = true;
    if (str.length !== 2) {
        valid = false;
    }
    const idx = SUIT.indexOf(str[1]);
    if (idx === -1) {
        valid = false;
    }
    if (!valid) {
        throw new Error(`Invalid card suit '${str}'!`);
    }
    return idx;
}

function rank(str) {
    var valid = true;
    if (str.length !== 2) {
        valid = false;
    }
    const idx = RANK.indexOf(str[0]);
    if (idx === -1) {
        valid = false;
    }
    if (!valid) {
        throw new Error(`Invalid card rank '${str}'!`);
    }
    return idx;
}

function color(str) {
    const s = suit(str);
    return (s === 1 || s === 2) ? COLOR.RED : COLOR.BLACK;
}

function reserve(str) {
    var valid = true;
    if (str.length !== 1) {
        valid = false;
    }
    const idx = RESERVES.indexOf(str.toUpperCase());
    if (idx === -1) {
        valid = false;
    }
    if (!valid) {
        throw new Error(`Invalid reserve position '${str}'!`);
    }
    return idx;
}

function move(table, str) {
    if (!(typeof str === 'string' || str instanceof String)) {
        throw new Error("Invalid type for move!");
    }
    if (str.length !== 2) {
        throw new Error("Invalid move!");
    }
    const from = str.charAt(0);
    const to = str.charAt(1);
    if (!isNaN(parseInt(from, 10)) && !isNaN(parseInt(to, 10))) {
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
        if (table.cascades[toNo].length === 0) {
            table.cascades[toNo].push(table.cascades[fromNo].pop());
        } else {
            const rhs = table.cascades[fromNo][table.cascades[fromNo].length-1];
            const lhs = table.cascades[toNo][table.cascades[toNo].length-1];
            if ((color(rhs) !== color(lhs)) && (rank(rhs)+1 === rank(lhs))) {
                table.cascades[toNo].push(table.cascades[fromNo].pop());
            } else {
                throw new Error("Invalid move!");
            }
        }
    } else if (!isNaN(parseInt(from, 10)) && isNaN(parseInt(to, 10))) {
        var fromNo = parseInt(from, 10);
        if (fromNo < 0 || fromNo >= table.cascades.length) {
            throw new Error("Invalid move!");
        }
        if (to.toUpperCase() === "H") {
            // Move from cascade to foundations
            var c = table.cascades[fromNo][table.cascades[fromNo].length-1];
            var idx = suit(c);
            const r = rank(c);
            if (table.foundations[idx].length === 0 && r === 0) {
                table.foundations[idx] = c;
                table.cascades[fromNo].pop();
            } else if (table.foundations[idx].length > 0) {
                const cur = table.foundations[idx];
                if (r === rank(cur)+1) {
                    table.foundations[idx] = c;
                    table.cascades[fromNo].pop();
                }
            } else {
                throw new Error("Invalid move!");
            }
        } else {
            // Move from cascade to reserves
            var c = table.cascades[fromNo][table.cascades[fromNo].length-1];
            var idx = reserve(to);
            if (table.reserves[idx].length === 0) {
                table.reserves[idx] = c;
                table.cascades[fromNo].pop();
            } else {
                throw new Error("Invalid move!");
            }
        }
    } else if (isNaN(parseInt(from, 10)) && !isNaN(parseInt(to, 10))) {
        // Move from reserves to cascade
        var idx = reserve(from);
        if (table.reserves[idx].length === 0) {
            throw new Error("Invalid move!");
        }
        var toNo = parseInt(to, 10);
        if (toNo < 0 || toNo >= table.cascades.length) {
            throw new Error("Invalid move!");
        }
        table.cascades[toNo].push(table.reserves[idx]);
        table.reserves[idx] = "";
    } else if (isNaN(parseInt(from, 10)) && isNaN(parseInt(to, 10))) {
        // Move from reserves to foundations
    }
}

if (typeof window === 'undefined') {
    test_createTable();
    test_createTableFromJson1();
    test_createTableFromJson2();
    test_move1();
    test_move2();
    test_move3();
    test_move4();
    test_move5();
    test_move6();
    test_move7();
    test_move8();
    test_move9();
    test_move10();
    test_move11();
    test_move12();
    test_move13();
    test_move14();
    test_move15();
    test_move16();
    test_move17();
    test_move18();
    test_move19();
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

function test_move3() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["AC"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["AC","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0H");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move3 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move4() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["AS"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","","AS"],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0H");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move4 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move5() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["AD"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","AD","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0H");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move5 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move6() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["AH"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","AH",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0H");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move6 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move7() {
    var setup = `{"reserves":["","","",""],"foundations":["","","AH",""],"cascades":[["2H"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","2H",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0H");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move7 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move8() {
    var setup = `{"reserves":["","","",""],"foundations":["","","","QS"],"cascades":[["KS"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","","KS"],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0H");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move8 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move9() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["8C"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["8C","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0A");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move9 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move10() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["8C"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","8C","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0B");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move10 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move11() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["8C"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","8C",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0C");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move11 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move12() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["8C"],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","","8C"],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "0D");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move12 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move13() {
    var setup = `{"reserves":["QD","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],["QD"],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "A2");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move13 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move14() {
    var setup = `{"reserves":["","","","2H"],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],["3S"]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],["3S","2H"]]}`;
    var table = createTableFromJson(setup);
    move(table, "D7");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move14 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move15() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9S"],[],[],[],[],[],[],["QC","TH"]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],["QC","TH","9S"]]}`;
    var table = createTableFromJson(setup);
    move(table, "07");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move15 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move16() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["QH"],["KS"],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[[],["KS","QH"],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "01");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move16 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move17() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["QH"],["KH"],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["QH"],["KH"],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, "01");
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move17 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move18() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["QH"],["4C"],[],[],[],[],[],[]]}`;
    var expect = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["QH"],["4C"],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, "01");
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move18 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move19() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["KC","QH","JS","TH","9C","8D","7C","6D","5C","4D","3C","2D","AC"],["2H"],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["KC","QH","JS","TH","9C","8D","7C","6D","5C","4D","3C","2D"],["2H","AC"],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "01");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move19 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}
