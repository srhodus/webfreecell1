'use strict';

const MAX_DEAL_NO = 999999999;
var table;
var seed;
var movestr = "";

var ready = (callback) => {
    if (document.readyState != "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

ready(() => {
    const el = document.getElementById("text_area1");
    seed = Math.random()*MAX_DEAL_NO+1;
    table = createTableFromSeed(seed);
    renderHtmlTable();
});

function renderHtmlTable() {
    const dn = document.getElementById("deal_text1");
    dn.value = String(Math.round(seed));
    const el = document.getElementById("table1");
    el.innerHTML = "";
    var rr = el.insertRow(-1);
    var c1 = rr.insertCell(-1);
    c1.innerHTML = "0";
    c1 = rr.insertCell(-1);
    for (let i = 0; i < table.reserves.length; i++) {
        if (table.reserves[i].length === 0) {
            c1.innerHTML += getCardCode("rs");
        } else {
            c1.innerHTML += getCardCode(table.reserves[i]);
        }
    }
    var fr = el.insertRow(-1);
    var c2 = fr.insertCell(-1);
    c2.innerHTML = "9";
    var c2 = fr.insertCell(-1);
    for (let i = 0; i < table.foundations.length; i++) {
        if (table.foundations[i].length === 0) {
            c2.innerHTML += getCardCode("fd"+i);
        } else {
            c2.innerHTML += getCardCode(table.foundations[i]);
        }
    }
    for (let i = 0; i < table.cascades.length; i++) {
        var tr = el.insertRow(-1);
        var cl = tr.insertCell(-1);
        cl.innerHTML = i+1;
        cl = tr.insertCell(-1);
        for (let j = 0; j < table.cascades[i].length; j++) {
            cl.innerHTML += getCardCode(table.cascades[i][j]);
        }
    }
}

function getCardCode(desc) {
    var base;
    if (desc === "rs") {
        return `<span class="gray">&#x1f0a0</span>`;
    }
    if (desc.startsWith("fd")) {
        var ret = "";
        switch (Number(desc.slice(-1))) {
            case 0:
                ret = `<span class="gray">&#x1f0d1</span>`;
                break;
            case 1:
                ret = `<span class="gray">&#x1f0c1</span>`;
                break;
            case 2:
                ret = `<span class="gray">&#x1f0b1</span>`;
                break;
            case 3:
                ret = `<span class="gray">&#x1f0a1</span>`;
                break;
        }
        return ret;
    }
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
        const el = document.getElementById("move_text1");
        movestr = String(el.value).trim();
        console.log(movestr);
        var m = convertMove(movestr);
        move(table, m);
        renderHtmlTable();
    } catch (e) {
        console.log(e);
    }
}
