const assetClass = require("./assetClass.js");
async function test() {
    try {
        let res = null;
        res = assetClass.getTemplate();
        // res = await assetClass.classList2Obj();
        // console.log(res);
        // console.log(res);
        // let assetClassList = null;
        // res = assetClass.check(assetClassList);
        // console.log(res);
        // assetClassList = [];
        // res = assetClass.check(assetClassList);
        // console.log(res);
        assetClassList = [{}]
        res = await assetClass.check(assetClassList);
        // console.log(res);
        assetClassList = [{ classId: "Z0000000", className: "t001-name", parentId: "0" },
        { classId: "Z0000000", className: "t001-name", parentId: "0" },
    ]
        res = await assetClass.check(assetClassList);
        console.log(JSON.stringify(res));
    }
    catch (err) {
        console.log(err);
    }
}
test();