'use strict';

var table;

var ready = (callback) => {
    if (document.readyState != "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

ready(() => {
    const el = document.getElementById("text_area1");
    table = createTableFromSeed(0);
    el.value = JSON.stringify(table);
});

function getMoveString() {
    const el = document.getElementById("text_area2");
    return String(el.value).trim();
}

function processMove() {
    move(table, convertMove(getMoveString()));
    const el = document.getElementById("text_area1");
    el.value = JSON.stringify(table);
}
