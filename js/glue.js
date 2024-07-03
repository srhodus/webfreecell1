'use strict';

const MAX_DEAL_NO = 999999999;
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
    table = createTableFromSeed(Math.random()*MAX_DEAL_NO+1);
    renderHtmlTable();
});

function getMoveString() {
    const el = document.getElementById("text_area2");
    return String(el.value).trim();
}

function renderHtmlTable() {
    const el = document.getElementById("table1");
    el.innerHTML = "";
    var rr = el.insertRow(-1);
    var c1 = rr.insertCell(-1);
    c1.innerHTML = "Res.";
    for (let i = 0; i < table.reserves.length; i++) {
        var c1 = rr.insertCell(-1);
        if (table.reserves[i].length === 0) {
            c1.innerHTML = "&nbsp;";
            continue;
        }
        c1.innerHTML = getCardCode(table.reserves[i]);
    }
    var fr = el.insertRow(-1);
    var c2 = fr.insertCell(-1);
    c2.innerHTML = "Fdn.";
    for (let i = 0; i < table.foundations.length; i++) {
        var c2 = fr.insertCell(-1);
        if (table.foundations[i].length === 0) {
            c2.innerHTML = "&nbsp;";
            continue;
        }
        c2.innerHTML = getCardCode(table.foundations[i]);
    }
    for (let i = 0; i < table.cascades.length; i++) {
        var tr = el.insertRow(-1);
        let cl = tr.insertCell(-1);
        cl.innerHTML = (i+1).toString();
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
        var m = convertMove(getMoveString());
        move(table, m);
        renderHtmlTable();
    } catch (e) {
        console.log(e);
    }
}
