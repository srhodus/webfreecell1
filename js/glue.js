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
            cl.innerHTML = getCardCode(table.cascades[i][j]);
        }
    }
}

function getCardCode(desc) {
    var base;
    switch (suit(desc)) {
        case 0:
            // Clubs
            base = `<span class="black">&#x1f0d`;
            break;
        case 1:
            // Diamonds
            base = `<span class="red">&#x1f0c`;
            break;
        case 2:
            // Hearts
            base = `<span class="red">&#x1f0b`;
            break
        case 3:
            // Spades
            base = `<span class="black">&#x1f0a`;
            break;
    }
    var r = rank(desc);
    if (r === 11 || r === 12) {
        r++;
    }
    r++;
    return base+r.toString(16)+"</span>";
}

function processMove() {
    try {
        move(table, convertMove(getMoveString()));
        renderHtmlTable();
    } catch (e) {
        console.log(e);
    }
}
