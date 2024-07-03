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
    renderHtmlTable();
});

function getMoveString() {
    const el = document.getElementById("text_area2");
    return String(el.value).trim();
}

function renderHtmlTable() {
    const el = document.getElementById("table1");
    el.innerHTML = "";
    for (let i = 0; i < table.cascades.length; i++) {
        var tr = el.insertRow(-1);
        let cl = tr.insertCell(-1);
        cl.innerHTML = parseInt(i)+1;
        for (let j = 0; j < table.cascades[i].length; j++) {
            cl = tr.insertCell(-1);
            cl.innerHTML = table.cascades[i][j];
        }
    }
}

function processMove() {
    try {
        move(table, convertMove(getMoveString()));
        renderHtmlTable();
    } catch (e) {
        console.log(e);
    }
}
