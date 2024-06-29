const t = require("./5da1443cc5af_webfreecell1_main");

test("Test create empty table", () => {
    var table = t.createTable();
    expect(table.reserves).toStrictEqual(new Array(4).fill(""));
    expect(table.foundations).toStrictEqual(new Array(4).fill(""));
    expect(table.cascades.length).toBe(8);
    for (let i = 0; i < table.cascades.length; i++) {
        expect(table.cascades[i].length).toBe(0);
        expect(table.cascades[i]).toStrictEqual(new Array());
    }
});
