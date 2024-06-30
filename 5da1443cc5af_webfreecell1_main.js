'use strict';

const NO_CASCADES = 8;
const NO_RESERVES = 4;
const NO_FOUNDATIONS = 4;

function createTable() {
    return {
        reserves: new Array(NO_RESERVES).fill(""),
        foundations: new Array(NO_FOUNDATIONS).fill(""),
        cascades: new Array(NO_CASCADES).fill(new Array()),
        fromJSON(desc) {
            var temp = JSON.parse(desc);
            this.reserves = temp.reserves;
            this.foundations = temp.foundations;
            this.cascades = temp.cascades;
            return this;
        }
    };
}

module.exports = createTable;
