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

function stackable(rhs, lhs) {
    return color(rhs) !== color(lhs) && rank(rhs)+1 === rank(lhs);
}

function move(table, str) {
    if (!(typeof str === 'string' || str instanceof String)) {
        throw new Error("Invalid type for move!");
    }
    if (str.length !== 2) {
        throw new Error("Invalid move!");
    }
    const from = str.charAt(0).toUpperCase();
    const to = str.charAt(1).toUpperCase();
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
            var rhs = table.cascades[fromNo][table.cascades[fromNo].length-1];
            var lhs = table.cascades[toNo][table.cascades[toNo].length-1];
            if (stackable(rhs, lhs)) {
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
            if (table.cascades[fromNo].length === 0) {
                throw new Error("Invalid move!");
            }
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
            if (table.cascades[fromNo].length === 0) {
                throw new Error("Invalid move!");
            }
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
        if (table.cascades[toNo].length === 0) {
            table.cascades[toNo].push(table.reserves[idx]);
            table.reserves[idx] = "";
        } else {
            var rhs = table.reserves[idx];
            var lhs = table.cascades[toNo][table.cascades[toNo].length-1];
            if (stackable(rhs, lhs)) {
                table.cascades[toNo].push(rhs);
                table.reserves[idx] = "";
            } else {
                throw new Error("Invalid move!");
            }
        }
    } else if (isNaN(parseInt(from, 10)) && isNaN(parseInt(to, 10))) {
        // Move from reserves to foundations
        var idx = reserve(from);
        if (table.reserves[idx].length === 0) {
            throw new Error("Invalid move!");
        }
        var c = table.reserves[idx];
        if (table.foundations[suit(c)].length === 0 && rank(c) === 0) {
            table.foundations[suit(c)] = c;
            table.reserves[idx] = "";
        } else if (suit(c) === suit(table.foundations[suit(c)])
            && rank(c) === rank(table.foundations[suit(c)])+1) {
            table.foundations[suit(c)] = c;
            table.reserves[idx] = "";
        } else {
            throw new Error("Invalid move!");
        }
    }
}

function convertMove(movestr) {
    if (!(typeof movestr === 'string' || movestr instanceof String)) {
        throw new Error("Invalid type for move!");
    }
    if (movestr.length !== 2) {
        throw new Error("Invalid move!");
    }
    var ret = [];
    for (let i = 0; i < movestr.length; i++) {
        if (!isNaN(parseInt(movestr[i], 10))) {
            ret.push(parseInt(movestr[i], 10)-1);
        } else {
            ret.push(movestr[i]);
        }
    }
    if (ret.length !== 2) {
        throw new Error("Unable to convert move string!");
    }
    return ret.join("");
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
    test_move20();
    test_move21();
    test_move22();
    test_move23();
    test_move24();
    test_move25();
    test_move26();
    test_solve1();
} else {
    var ready = (callback) => {
        if (document.readyState != "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    ready(() => {
        const form = document.getElementById("play_form");
        form.addEventListener("submit", (e) => {
            switch (e.submitter.id) {
                case "move_btn":
                    console.log("You clicked on the move button!");
                    break;
            }
        });
    });
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

function test_move20() {
    var setup = `{"reserves":["AD","","",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","",""],"foundations":["","AD","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "AH");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move20 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move21() {
    var setup = `{"reserves":["","","KS",""],"foundations":["","","","QS"],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","",""],"foundations":["","","","KS"],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    move(table, "CH");
    var actual = JSON.stringify(table);
    if (expect !== actual) {
        print("test_move21 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}


function test_move22() {
    var setup = `{"reserves":["","","KS",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","KS",""],"foundations":["","","",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, "CH");
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move22 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move23() {
    var setup = `{"reserves":["AH","","",""],"foundations":["","","2H",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["AH","","",""],"foundations":["","","2H",""],"cascades":[[],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, "CH");
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move23 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move24() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9D"],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9D"],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, "");
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move24 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move25() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9D"],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9D"],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, 9);
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move25 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_move26() {
    var setup = `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9D"],[],[],[],[],[],[],[]]}`;
    var expect= `{"reserves":["","","",""],"foundations":["","","",""],"cascades":[["9D"],[],[],[],[],[],[],[]]}`;
    var table = createTableFromJson(setup);
    var caughtError = false;
    try {
        move(table, "99");
    } catch (e) {
        caughtError = true;
    }
    var actual = JSON.stringify(table);
    if (expect !== actual || !caughtError) {
        print("test_move26 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}

function test_solve1() {
    var setup = `{
    "reserves":["","","",""],
    "foundations":["","","",""],
    "cascades":[
            ["QD","4D","TD","7S","AH","3H","AS"],
            ["QC","JD","JC","9D","9S","AD","5S"],
            ["KC","JS","8C","KS","TC","7H","TH"],
            ["3C","6H","6C","7C","2S","3D","JH"],
            ["4C","QS","8S","6S","3S","5H"],
            ["2C","6D","4S","4H","TS","8D"],
            ["KD","2D","5D","AC","9H","KH"],
            ["5C","9C","QH","8H","2H","7D"]
    ]}`;
    var table = createTableFromJson(setup);
    var solution = ["1h","6a","64","62","65","15","7b","74","7h","1h","61",
        "6h","2c","21","c1","1h","5c","5d","56","d6","c6","51","58","78",
        "2h","7h","54","57","a2","4a","4c","4d","47","d7","c7","a7","8a",
        "8c","87","c7","a7","4a","4h","8h","1h","6h","48","ah","4a","4c",
        "4h","5h","1h","6h","14","15","12","52","42","14","6h","1h","2h",
        "7h","8d","86","d6","85","83","8h","7h","ah","ch","2h","2h","6h",
        "7h","3a","38","a8","3h","2h","6h","7h","36","3a","3h","2h","7h",
        "8h","2h","4h","6h","7h","8h","2h","7h","2h","3h","7h","1h","2h",
        "5h","ah","bh","3h","7h"];
    for (let i = 0; i < solution.length; i++) {
        move(table, convertMove(solution[i]));
    }
    var actual=JSON.stringify(table);
    var expect= `{"reserves":["","","",""],"foundations":["KC","KD","KH","KS"],"cascades":[[],[],[],[],[],[],[],[]]}`;
    if (expect !== actual) {
        print("test_solve1 failed!");
        print("expected: " + expect);
        print("actual  : " + actual);
        throw new Error();
    }
}
