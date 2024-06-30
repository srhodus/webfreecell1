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

function createTableFromJson(desc) {
    return JSON.parse(desc);
}

if (typeof window === 'undefined') {
    test_createTable();
    test_createTableFromJson1();
    test_createTableFromJson2();
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
