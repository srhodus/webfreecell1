const t = require("./5da1443cc5af_webfreecell1_main");

test("Test create table from JSON", () => {
    var desc = `{
        "reserves": ["", "", "", ""],
        "foundations": ["", "", "", ""],
        "cascades": [
            ["QD", "4D", "TD", "7S", "AH", "3H", "AS"],
            ["QC", "JD", "JC", "9D", "9S", "AD", "5S"],
            ["KC", "JS", "8C", "KS", "TC", "7H", "TH"],
            ["3C", "6H", "6C", "7C", "2S", "3D", "JH"],
            ["4C", "QS", "8S", "6S", "3S", "5H"],
            ["2C", "6D", "4S", "4H", "TS", "8D"],
            ["KD", "2D", "5D", "AC", "9H", "KH"],
            ["5C", "9C", "QH", "8H", "2H", "7D"]
        ]
    }`;
    var table = t.createTableFromJson(desc);
    expect(table.reserves).toStrictEqual(new Array(4).fill(""));
    expect(table.foundations).toStrictEqual(new Array(4).fill(""));
    expect(table.cascades[0]).toEqual(["QD", "4D", "TD", "7S", "AH", "3H", "AS"]);
    expect(table.cascades[1]).toEqual(["QC", "JD", "JC", "9D", "9S", "AD", "5S"]);
    expect(table.cascades[2]).toEqual(["KC", "JS", "8C", "KS", "TC", "7H", "TH"]);
    expect(table.cascades[3]).toEqual(["3C", "6H", "6C", "7C", "2S", "3D", "JH"]);
    expect(table.cascades[4]).toEqual(["4C", "QS", "8S", "6S", "3S", "5H"]);
    expect(table.cascades[5]).toEqual(["2C", "6D", "4S", "4H", "TS", "8D"]);
    expect(table.cascades[6]).toEqual(["KD", "2D", "5D", "AC", "9H", "KH"]);
    expect(table.cascades[7]).toEqual(["5C", "9C", "QH", "8H", "2H", "7D"]);
});
