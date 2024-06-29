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

module.exports = createTable, createTableFromJson;
